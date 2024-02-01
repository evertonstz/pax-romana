import { Messages } from '../../shared/enums/Messages';
import { PaxDecryptedPacket } from '../../shared/models/Packet';
import { BaseTemperatureMessage } from './BaseTemperatureMessage';

export class ActualTemperatureMessage extends BaseTemperatureMessage {
  constructor(packet: PaxDecryptedPacket) {
    const messageType = Messages.ATTRIBUTE_ACTUAL_TEMP;
    super(messageType, packet);
  }
}
