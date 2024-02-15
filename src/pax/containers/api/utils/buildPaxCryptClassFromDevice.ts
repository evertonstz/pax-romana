import { PaxCrypt } from '../../../core';
import { Devices } from '../../../shared/enums';
import { UnknownDeviceException } from '../../../shared/exceptions';
import { PaxSerial } from '../../../shared/models/PaxSerial';

export const buildPaxCryptClassFromDevice = (
  paxSerial: PaxSerial,
): PaxCrypt.PaxAbs => {
  switch (paxSerial.device) {
    case Devices.PAX3:
      return new PaxCrypt.Pax3Imp(paxSerial);
    default:
      throw new UnknownDeviceException();
  }
};
