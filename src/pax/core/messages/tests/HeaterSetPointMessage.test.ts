import { describe, expect, it } from 'vitest';

import { PaxDecryptedPacket } from '../../../shared/models/Packet';
import {
  ReadAndWriteTemperatureMessageBuilderFromPacket,
  ReadAndWriteTemperatureMessageBuilderFromTemperature,
} from '../BaseTemperatureMessages';
import { HeaterSetPointMessage } from '../HeaterSetPointMessage';

describe('HeaterSetPointMessage.ts', () => {
  const paxDecryptedPacket = new PaxDecryptedPacket(new ArrayBuffer(16));
  const temperature = 235;
  describe('Build from packet', () => {
    it('should be created with a packet builder', () => {
      const builder =
        new ReadAndWriteTemperatureMessageBuilderFromPacket<HeaterSetPointMessage>();
      builder.setPacket(paxDecryptedPacket);

      const message = new HeaterSetPointMessage(builder);

      expect(message).toBeInstanceOf(HeaterSetPointMessage);
      expect(message.packet).toBe(paxDecryptedPacket);
    });

    it('should be created with a packet using the static method', () => {
      const message =
        HeaterSetPointMessage.createWithPacket(paxDecryptedPacket);

      expect(message).toBeInstanceOf(HeaterSetPointMessage);
      expect(message.packet).toBe(paxDecryptedPacket);
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
    });

    it('should be created with a packet using the static method', () => {
      const message = HeaterSetPointMessage.createWithTemperature(temperature);

      expect(message).toBeInstanceOf(HeaterSetPointMessage);
      expect(message.temperature).toBe(temperature);
    });
  });
});
