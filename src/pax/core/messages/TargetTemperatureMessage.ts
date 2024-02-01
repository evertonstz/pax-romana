import { Messages } from '../../shared/enums/Messages';
import { PaxDecryptedPacket } from '../../shared/models/Packet';
import { BaseTemperatureMessage } from './BaseTemperatureMessage';

export class TargetTemperatureMessage extends BaseTemperatureMessage {
  constructor(packet: PaxDecryptedPacket) {
    const messageType = Messages.ATTRIBUTE_CURRENT_TARGET_TEMP;
    super(messageType, packet);
  }
}
