import { Hexadecimal } from '../types/hex';
import { bufferToHex } from '../utils/bufferToHex';

export class PaxPacket extends DataView {
  toHex(): Hexadecimal {
    return bufferToHex(this.buffer);
  }
}

export class PaxDecryptedPacket extends PaxPacket {}

export class PaxEncryptedPacket extends PaxPacket {}
