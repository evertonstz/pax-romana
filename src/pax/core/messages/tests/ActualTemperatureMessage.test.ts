import { describe, expect, it } from 'vitest';

import { Messages } from '../../../shared/enums/Messages';
import { PaxDecryptedPacket } from '../../../shared/models/Packet';
import { ActualTemperatureMessage } from '../ActualTemperatureMessage';

describe('ActualTemperatureMessage.ts', () => {
  it.each([
    [1870, 174],
    [1979, 184],
    [1980, 185],
    [2350, 215],
  ])('decodes raw %i as %i °C', (raw, celsius) => {
    const packet = new PaxDecryptedPacket(new ArrayBuffer(16));
    packet.setUint8(0, Messages.ATTRIBUTE_ACTUAL_TEMP);
    packet.setUint16(1, raw, true);

    const message = new ActualTemperatureMessage(packet);

    expect(message.temperature).toBe(celsius);
    expect(message.messageType).toBe(Messages.ATTRIBUTE_ACTUAL_TEMP);
    expect(message.packet).toBe(packet);
  });
});
