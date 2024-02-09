import { Pax3Imp } from '../../../core/crypt';
import { ActualTemperatureMessage } from '../../../core/messages';
import { Devices, Messages } from '../../../shared/enums';
import {
  PaxDecryptedPacket,
  PaxEncryptedPacket,
} from '../../../shared/models/Packet';
import { PaxSerial } from '../../../shared/models/PaxSerial';
import { hexToBuffer } from '../../../shared/utils/hexToBuffer';
import { buildPaxClassFromDevice, decodeDecryptedPacket, get } from '../get';

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
  describe('buildPaxClassFromDevice', () => {
    it('should return Pax3Imp when device is Pax3Device', () => {
      const response = buildPaxClassFromDevice(pax3Device, paxSerial);
      expect(response instanceof Pax3Imp).toBe(true);
    });
  });
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
  });
});