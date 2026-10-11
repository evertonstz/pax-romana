import { describe, expect, it } from 'vitest';

import { Messages } from '../../../shared/enums/Messages';
import { PaxDecryptedPacket } from '../../../shared/models/Packet';
import {
  ReadAndWriteTemperatureMessageBuilderFromPacket,
  ReadAndWriteTemperatureMessageBuilderFromTemperature,
} from '../BaseTemperatureMessages';
import { HeaterSetPointMessage } from '../HeaterSetPointMessage';

describe('HeaterSetPointMessage.ts', () => {
  const paxDecryptedPacket = new PaxDecryptedPacket(new ArrayBuffer(16));
  paxDecryptedPacket.setUint8(0, Messages.ATTRIBUTE_HEATER_SET_POINT);
  paxDecryptedPacket.setUint16(1, 2350, true);
  const temperature = 215;

  describe('Build from packet', () => {
    it('should be created with a packet builder', () => {
      const builder =
        new ReadAndWriteTemperatureMessageBuilderFromPacket<HeaterSetPointMessage>();
      builder.setPacket(paxDecryptedPacket);

      const message = new HeaterSetPointMessage(builder);

      expect(message).toBeInstanceOf(HeaterSetPointMessage);
      expect(message.packet).toBe(paxDecryptedPacket);
      expect(message.temperature).toBe(215);
    });

    it('should be created with a packet using the static method', () => {
      const message =
        HeaterSetPointMessage.createWithPacket(paxDecryptedPacket);

      expect(message).toBeInstanceOf(HeaterSetPointMessage);
      expect(message.packet).toBe(paxDecryptedPacket);
      expect(message.temperature).toBe(215);
    });
  });

  describe('Build from temperature', () => {
    it('should be created with a temperature builder', () => {
      const builder =
        new ReadAndWriteTemperatureMessageBuilderFromTemperature<HeaterSetPointMessage>();
      builder.setTemperature(temperature);

      const message = new HeaterSetPointMessage(builder);
      expect(message).toBeInstanceOf(HeaterSetPointMessage);
      expect(message.temperature).toBe(temperature);
      expect(message.packet.getUint16(1, true)).toBe(2350);
    });

    it('should be created with a packet using the static method', () => {
      const message = HeaterSetPointMessage.createWithTemperature(temperature);

      expect(message).toBeInstanceOf(HeaterSetPointMessage);
      expect(message.temperature).toBe(temperature);
      expect(message.packet.getUint16(1, true)).toBe(2350);
    });

    it.each([
      [175, 1880],
      [184, 1978],
      [185, 1990],
      [186, 2002],
      [215, 2350],
    ])('encodes %i °C as raw %i in a little-endian packet', (celsius, raw) => {
      const message = HeaterSetPointMessage.createWithTemperature(celsius);

      expect(message.packet.byteLength).toBe(16);
      expect(message.packet.getUint8(0)).toBe(
        Messages.ATTRIBUTE_HEATER_SET_POINT,
      );
      expect(message.packet.getUint8(1)).toBe(raw & 0xff);
      expect(message.packet.getUint8(2)).toBe(raw >> 8);
      expect(
        HeaterSetPointMessage.createWithPacket(message.packet).temperature,
      ).toBe(celsius);
    });
  });
});
