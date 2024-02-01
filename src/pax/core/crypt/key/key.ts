import CryptoJS from 'crypto-js';

import { KeyException } from '../../exceptions';
import { PAX_KEY_KEY } from './constants';

const derivateKeyMessage = (serial: string): string => `${serial}${serial}`;

export const buildKey = (serial: string): CryptoJS.lib.WordArray => {
  const keyKey = CryptoJS.enc.Hex.parse(PAX_KEY_KEY);
  const keyCipher = CryptoJS.AES.encrypt(derivateKeyMessage(serial), keyKey, {
    mode: CryptoJS.mode.ECB,
  });

  if (!keyCipher.ciphertext) {
    throw new KeyException('Unable to build keyKey');
  }

  return CryptoJS.enc.Hex.parse(keyCipher.ciphertext.toString().slice(0, 32));
};
