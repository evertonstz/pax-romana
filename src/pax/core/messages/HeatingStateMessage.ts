import { HeatingStates } from '../../shared/enums';
import { Messages } from '../../shared/enums/Messages';
import { PaxDecryptedPacket } from '../../shared/models/Packet';
import { getEnumKeyByEnumValue } from '../../shared/utils/getEnumKeyByEnumValue';
import { InvalidPacketTypeException } from '../exceptions';
import { MessageAbs } from './MessageAbs';

export class HeatingStateMessage implements MessageAbs {
  readonly heatingState: HeatingStates;
  readonly messageType: Messages = Messages.ATTRIBUTE_HEATING_STATE;
  readonly packet: PaxDecryptedPacket;

  constructor(packet: PaxDecryptedPacket) {
    this.validatePacket(packet);
    this.packet = packet;

    const heatingStateInt = packet.getUint8(1);
    const heatingState = getEnumKeyByEnumValue(HeatingStates, heatingStateInt);

    if (!heatingState) {
      throw new Error('Unknown Heating Message');
    }
    this.heatingState = heatingState;
  }

  private validatePacket(packet: PaxDecryptedPacket) {
    if (packet.byteLength <= 1 + 2) {
      throw new InvalidPacketTypeException('Packet too small');
    }
  }
}
