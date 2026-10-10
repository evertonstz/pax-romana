import { describe, expect, it } from 'vitest';

import { celsiusToRaw, rawToCelsius } from '../pax3Temperature';

describe('pax3Temperature.ts', () => {
  it('maps the official app slider range (raw 1870-2350) to 174-215 °C', () => {
    expect(rawToCelsius(1870)).toBe(174);
    expect(rawToCelsius(2350)).toBe(215);
    expect(celsiusToRaw(215)).toBe(2350);
  });

  it('round-trips whole degrees across the PAX 3 range', () => {
    for (let celsius = 175; celsius <= 215; celsius++) {
      expect(rawToCelsius(celsiusToRaw(celsius))).toBe(celsius);
    }
  });
});
