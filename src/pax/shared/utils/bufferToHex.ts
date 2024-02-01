import { Hexadecimal } from '../types';

export function bufferToHex(buffer: ArrayBuffer): Hexadecimal {
  return [...new Uint8Array(buffer)]
    .map(x => x.toString(16).padStart(2, '0'))
    .join('');
}
