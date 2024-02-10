import { PaxCrypt } from '../../core';
import {
  ActualTemperatureMessage,
  HeaterSetPointMessage,
  HeatingStateMessage,
  MessageAbs,
  TargetTemperatureMessage,
} from '../../core/messages';
import { UnknownMessage } from '../../core/messages/UnknownMessage';
import { Devices } from '../../shared/enums';
import { Messages } from '../../shared/enums/Messages';
import { UnknownDeviceException } from '../../shared/exceptions';
import {
  PaxDecryptedPacket,
  PaxEncryptedPacket,
} from '../../shared/models/Packet';
import { PaxSerial } from '../../shared/models/PaxSerial';
import { getEnumKeyByEnumValue } from '../../shared/utils/getEnumKeyByEnumValue';
import { GetResponse } from './models/getResponse';

export const buildPaxClassFromDevice = (
  paxSerial: PaxSerial,
): PaxCrypt.PaxAbs => {
  switch (paxSerial.device) {
    case Devices.PAX3:
      return new PaxCrypt.Pax3Imp(paxSerial);
    default:
      throw new UnknownDeviceException();
  }
};

export const decodeDecryptedPacket = (
  messageType: Messages,
  packet: PaxDecryptedPacket,
): MessageAbs => {
  switch (messageType) {
    case Messages.ATTRIBUTE_ACTUAL_TEMP:
      return new ActualTemperatureMessage(packet);
    case Messages.ATTRIBUTE_CURRENT_TARGET_TEMP:
      return new TargetTemperatureMessage(packet);
    case Messages.ATTRIBUTE_HEATER_SET_POINT:
      return new HeaterSetPointMessage(packet);
    case Messages.ATTRIBUTE_HEATING_STATE:
      return new HeatingStateMessage(packet);
    default:
      return new UnknownMessage(messageType, packet);
  }
};

export const get = (
  packet: PaxEncryptedPacket,
  paxSerial: PaxSerial,
): GetResponse => {
  const paxClass = buildPaxClassFromDevice(paxSerial);
  const decryptedPacket = paxClass.decrypt(packet);
  const messageTypeInt = decryptedPacket.getUint8(0);
  const messageType = getEnumKeyByEnumValue(Messages, messageTypeInt);
  const decodedPacket = !messageType
    ? new UnknownMessage(messageTypeInt, decryptedPacket)
    : decodeDecryptedPacket(messageType, decryptedPacket);

  return { device: paxSerial.device, message: decodedPacket as MessageAbs };
};
