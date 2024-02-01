import { Messages } from '../../shared/enums/Messages';
import { PaxDecryptedPacket } from '../../shared/models/Packet';
import { MessageAbs } from './MessageAbs';

export class UnknownMessage implements MessageAbs {
  messageType: Messages;
  packet: PaxDecryptedPacket;

  constructor(messageType: Messages, packet: PaxDecryptedPacket) {
    this.messageType = messageType;
    this.packet = packet;
  }
}
