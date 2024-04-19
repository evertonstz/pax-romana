import { PaxDecryptedPacket } from '@/pax/containers/lib';
import { hexToBuffer } from '@/pax/shared/utils/hexToBuffer';
import { describe, expect, it } from 'vitest';

import { ColorThemeMessage } from '../ColorThemeMessage';

const theme = {
  heating: {
    animation: 0,
    color1: {
      blue: 40,
      green: 115,
      red: 255,
    },
    color2: {
      blue: 104,
      green: 0,
      red: 153,
    },
    frequency: 15,
  },
  regulating: {
    animation: 2,
    color1: {
      blue: 40,
      green: 149,
      red: 253,
    },
    color2: {
      blue: 136,
      green: 0,
      red: 153,
    },
    frequency: 11,
  },
  standby: {
    animation: 1,
    color1: {
      blue: 125,
      green: 114,
      red: 255,
    },
    color2: {
      blue: 154,
      green: 64,
      red: 0,
    },
    frequency: 6,
  },
  startup: {
    animation: 1,
    color1: {
      blue: 40,
      green: 115,
      red: 255,
    },
    color2: {
      blue: 104,
      green: 0,
      red: 153,
    },
    frequency: 5,
  },
};

describe('ColorThemeMessage.ts', () => {
  // eslint-disable-next-line max-len
  const decryptedHexPacket = `1404ff73289900680105ff7328990068000ffd9528990088020bff727d00409a01063af54f71f8899a493279d0a9e0fa`;

  const paxDecryptedPacket = new PaxDecryptedPacket(
    hexToBuffer(decryptedHexPacket),
  );

  describe('Build from packet', () => {
    it('should be created with a packet using the static method', () => {
      const message = ColorThemeMessage.createWithPacket(paxDecryptedPacket);

      expect(message).toBeInstanceOf(ColorThemeMessage);
      expect(message.packet).toBe(paxDecryptedPacket);
    });
  });

  describe('Build from temperature', () => {
    it('should be created with a packet using the static method', () => {
      const message = ColorThemeMessage.createWithTheme(theme);

      expect(message).toBeInstanceOf(ColorThemeMessage);
      expect(decryptedHexPacket).contain(message.packet.toHex());
    });
  });
});
