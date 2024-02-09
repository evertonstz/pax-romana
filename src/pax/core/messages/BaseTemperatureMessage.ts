import { Messages } from '../../shared/enums/Messages';
import { PaxDecryptedPacket } from '../../shared/models/Packet';
import { InvalidPacketTypeException } from '../exceptions';
import { MessageAbs } from './MessageAbs';

export class BaseTemperatureMessage implements MessageAbs {
  readonly temperature: number;
  readonly messageType: Messages;
  readonly packet: PaxDecryptedPacket;

  constructor(messageType: Messages, packet: PaxDecryptedPacket) {
    this.validatePacket(packet);
    const temperature = packet.getUint16(1, true) / 10.0; // true for little-endian
    this.temperature = temperature;
    this.messageType = messageType;
    this.packet = packet;
  }

  private validatePacket(packet: PaxDecryptedPacket) {
    if (packet.byteLength <= 1 + 2) {
      throw new InvalidPacketTypeException('Packet too small');
    }
  }
}