import { describe, expect, it } from 'vitest';

import {
  ActualTemperatureMessage,
  HeaterSetPointMessage,
  HeatingStateMessage,
  TargetTemperatureMessage,
} from '../../../core/messages';
import { Devices, Messages } from '../../../shared/enums';
import {
  PaxDecryptedPacket,
  PaxEncryptedPacket,
} from '../../../shared/models/Packet';
import { PaxSerial } from '../../../shared/models/PaxSerial';
import { hexToBuffer } from '../../../shared/utils/hexToBuffer';
import { decodeDecryptedPacket, get } from '../get';

describe('get.ts', () => {
  const serialNumber = 'KRZQ2NW9';
  const pax3Device = Devices.PAX3;
  const paxSerial = new PaxSerial(serialNumber, pax3Device);
  describe('get', () => {
    const hexPacket =
      '63d33e940e5246f4a4f891b834e3654ff20d5cb4e3d880d13a236ecb30626bec';
    it('should return GetResponse sucessfully', () => {
      const packetDataView = new PaxEncryptedPacket(hexToBuffer(hexPacket));
      const response = get(packetDataView, paxSerial);
      expect(response.device).toBe(paxSerial.device);
    });
  });
  // TODO migrate to its own test file
  // describe('buildPaxClassFromDevice', () => {
  //   it('should return Pax3Imp when device is Pax3Device', () => {
  //     const response = buildPaxCryptClassFromDevice(paxSerial);
  //     expect(response instanceof Pax3Imp).toBe(true);
  //   });
  // });
  describe('decodeDecryptedPacket', () => {
    it('should return ActualTemperatureMessage when ATTRIBUTE_ACTUAL_TEMP', () => {
      const paxDecryptedPacket = new PaxDecryptedPacket(new ArrayBuffer(16));
      paxDecryptedPacket.setUint8(0, 1);
      const response = decodeDecryptedPacket(
        Messages.ATTRIBUTE_ACTUAL_TEMP,
        paxDecryptedPacket,
      );
      expect(response instanceof ActualTemperatureMessage).toBe(true);
    });
    it('should return TargetTemperatureMessage when ATTRIBUTE_CURRENT_TARGET_TEMP', () => {
      const paxDecryptedPacket = new PaxDecryptedPacket(new ArrayBuffer(16));
      paxDecryptedPacket.setUint8(0, 1);
      const response = decodeDecryptedPacket(
        Messages.ATTRIBUTE_CURRENT_TARGET_TEMP,
        paxDecryptedPacket,
      );
      expect(response instanceof TargetTemperatureMessage).toBe(true);
    });
    it('should return HeaterSetPointMessage when ATTRIBUTE_HEATER_SET_POINT', () => {
      const paxDecryptedPacket = new PaxDecryptedPacket(new ArrayBuffer(16));
      paxDecryptedPacket.setUint8(0, 1);
      const response = decodeDecryptedPacket(
        Messages.ATTRIBUTE_HEATER_SET_POINT,
        paxDecryptedPacket,
      );
      expect(response instanceof HeaterSetPointMessage).toBe(true);
    });
    it('should return HeaterSetPointMessage when ATTRIBUTE_HEATING_STATE', () => {
      const paxDecryptedPacket = new PaxDecryptedPacket(new ArrayBuffer(16));
      paxDecryptedPacket.setUint8(0, 1);
      const response = decodeDecryptedPacket(
        Messages.ATTRIBUTE_HEATING_STATE,
        paxDecryptedPacket,
      );
      expect(response instanceof HeatingStateMessage).toBe(true);
    });
  });
});
