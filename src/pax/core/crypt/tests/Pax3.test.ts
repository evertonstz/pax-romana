import { describe, expect, it } from 'vitest';

import { Devices } from '../../../shared/enums';
import { PaxEncryptedPacket } from '../../../shared/models/Packet';
import { PaxSerial } from '../../../shared/models/PaxSerial';
import { hexToBuffer } from '../../../shared/utils/hexToBuffer';
import { Pax3Imp } from '../Pax3Imp';

describe('Pax3.ts', () => {
  const serialNumber = 'KRZQ2NW9';
  const device = Devices.PAX3;
  it('should decrypt the hex pax packet correctly', () => {
    const hexPacket =
      '63d33e940e5246f4a4f891b834e3654ff20d5cb4e3d880d13a236ecb30626bec';
    const packetDataView = new PaxEncryptedPacket(hexToBuffer(hexPacket));
    const paxSerial = new PaxSerial(serialNumber, device);
    const expectedPlainText = '3568637cfde13dd55052dd77648c8ad0';

    const paxCryptClass = new Pax3Imp(paxSerial);
    const decryptedText = paxCryptClass.decrypt(packetDataView);
    expect(decryptedText.toHex()).toBe(expectedPlainText);
  });
});
