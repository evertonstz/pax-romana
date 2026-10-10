// PAX 3 does not use °C * 10 for temperatures. The official Android app
// (com.pax.app 3.0.3) and PAX's web app convert between °C and the device's
// raw units with these piecewise-linear formulas (integer math).

const div = (a: number, b: number) => Math.trunc(a / b);

export const rawToCelsius = (raw: number): number =>
  raw < 1980 ? div((raw + 4) * 10, 109) + 3 : div(raw, 12) + 20;

export const celsiusToRaw = (celsius: number): number =>
  celsius < 185 ? div((celsius - 3) * 109, 10) + 6 : (celsius - 20) * 12 + 10;
