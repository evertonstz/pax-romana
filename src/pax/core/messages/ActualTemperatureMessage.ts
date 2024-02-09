import { Messages } from '../../shared/enums/Messages';
import { PaxDecryptedPacket } from '../../shared/models/Packet';
import { ReadOnlyTemperatureMessage } from './BaseTemperatureMessages';

export class ActualTemperatureMessage extends ReadOnlyTemperatureMessage {
  constructor(packet: PaxDecryptedPacket) {
    const messageType = Messages.ATTRIBUTE_ACTUAL_TEMP;
    super(messageType, packet);
  }
}
