import { Messages } from '../../shared/enums/Messages';
import { PaxDecryptedPacket } from '../../shared/models/Packet';
import { MessageAbs } from './MessageAbs';

export class BatteryPercentageMessage implements MessageAbs {
  readonly percentage: number;
  readonly messageType: Messages;
  readonly packet: PaxDecryptedPacket;

  constructor(packet: PaxDecryptedPacket) {
    const temperature = packet.getUint8(1);
    this.percentage = temperature;
    this.messageType = Messages.ATTRIBUTE_BATTERY;
    this.packet = packet;
  }
}
