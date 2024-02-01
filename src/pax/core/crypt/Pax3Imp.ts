import CryptoJS from 'crypto-js';

import {
  PaxDecryptedPacket,
  PaxEncryptedPacket,
} from '../../shared/models/Packet';
import { hexToBuffer } from '../../shared/utils/hexToBuffer';
import { PaxAbs } from './PaxAbs';
import { buildKey } from './key/key';

export class Pax3Imp extends PaxAbs {
  decrypt(packet: PaxEncryptedPacket): PaxDecryptedPacket {
    const hexPacket = packet.toHex();
    const { iv, hexPacketToDecrypt } = this.splitPacket(hexPacket);

    const key = buildKey(this.paxSerial.serial);

    const result = this.decryptAESOFB(hexPacketToDecrypt, key, iv);
    const hexResult = result.toString(CryptoJS.enc.Hex);
    const dataView = new PaxDecryptedPacket(hexToBuffer(hexResult));
    return dataView;
  }

  private splitPacket(hexPacket: string): {
    iv: CryptoJS.lib.WordArray;
    hexPacketToDecrypt: CryptoJS.lib.WordArray;
  } {
    return {
      iv: CryptoJS.enc.Hex.parse(hexPacket.slice(-32)),
      hexPacketToDecrypt: CryptoJS.enc.Hex.parse(hexPacket.slice(0, 32)),
    };
  }

  private decryptAESOFB(
    ciphertext: CryptoJS.lib.WordArray,
    key: CryptoJS.lib.WordArray,
    iv: CryptoJS.lib.WordArray,
  ): CryptoJS.lib.WordArray {
    const cipherText = { ciphertext: ciphertext } as CryptoJS.lib.CipherParams;
    const decrypted: CryptoJS.lib.WordArray = CryptoJS.AES.decrypt(
      cipherText,
      key,
      { iv, mode: CryptoJS.mode.OFB, padding: CryptoJS.pad.NoPadding },
    );
    return decrypted;
  }
}
