import { Messages } from '../../shared/enums/Messages';
import { PaxDecryptedPacket } from '../../shared/models/Packet';
import { BaseTemperatureMessage } from './BaseTemperatureMessage';

export class HeaterSetPointMessage extends BaseTemperatureMessage {
  constructor(packet: PaxDecryptedPacket) {
    const messageType = Messages.ATTRIBUTE_HEATER_SET_POINT;
    super(messageType, packet);
  }
}
