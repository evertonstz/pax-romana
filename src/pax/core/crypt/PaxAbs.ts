import {
  PaxDecryptedPacket,
  PaxEncryptedPacket,
} from '../../shared/models/Packet';
import { PaxSerial } from '../../shared/models/PaxSerial';

export abstract class PaxAbs {
  readonly paxSerial: PaxSerial;

  constructor(paxSerial: PaxSerial) {
    this.paxSerial = paxSerial;
  }

  abstract decrypt(packet: PaxEncryptedPacket): PaxDecryptedPacket;
  abstract encrypt(packet: PaxDecryptedPacket): PaxEncryptedPacket;
}
