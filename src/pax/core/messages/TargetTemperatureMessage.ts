import { Messages } from '../../shared/enums/Messages';
import { PaxDecryptedPacket } from '../../shared/models/Packet';
import { ReadOnlyTemperatureMessage } from './BaseTemperatureMessages';

export class TargetTemperatureMessage extends ReadOnlyTemperatureMessage {
  constructor(packet: PaxDecryptedPacket) {
    const messageType = Messages.ATTRIBUTE_CURRENT_TARGET_TEMP;
    super(messageType, packet);
  }
}
