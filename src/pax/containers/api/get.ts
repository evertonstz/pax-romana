import { PaxCrypt } from '../../core';
import {
  ActualTemperatureMessage,
  HeaterSetPointMessage,
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
import { GetResponse } from './models/getResponse';

export const buildPaxClassFromDevice = (
  device: Devices,
  paxSerial: PaxSerial,
): PaxCrypt.PaxAbs => {
  switch (device) {
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
    default:
      return new UnknownMessage(messageType, packet);
  }
};

export const get = (
  packet: PaxEncryptedPacket,
  paxSerial: PaxSerial,
): GetResponse => {
  const device = paxSerial.device;
  //decrypt packet
  const paxClass = buildPaxClassFromDevice(device, paxSerial);
  const decryptedPacket = paxClass.decrypt(packet);
  const messageType = decryptedPacket.getUint8(0) as Messages;
  const decodedPacket = decodeDecryptedPacket(messageType, decryptedPacket);

  return { device: device, message: decodedPacket };
};
