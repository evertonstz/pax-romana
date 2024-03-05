import CryptoJS from 'crypto-js';
import { describe, expect, it } from 'vitest';

import { buildKey } from '../key';

describe('key.ts', () => {
  const serialNumber = 'KRZQ2NW9';

  it('should build key from serial number correctly', () => {
    const expectedKey = '8423398c3781fa6b008cba8c6c5366d4';
    const key = buildKey(serialNumber);
    expect(key.toString(CryptoJS.enc.Hex)).toBe(expectedKey);
  });
});
