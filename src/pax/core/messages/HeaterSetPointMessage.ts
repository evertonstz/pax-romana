import { Messages } from '../../shared/enums/Messages';
import { PaxDecryptedPacket } from '../../shared/models/Packet';
import { ReadAndWriteTemperatureMessage } from './BaseTemperatureMessages';

export class HeaterSetPointMessage extends ReadAndWriteTemperatureMessage {
  constructor(packet: PaxDecryptedPacket) {
    const messageType = Messages.ATTRIBUTE_HEATER_SET_POINT;
    super(messageType, packet);
  }
}
