import { BaseCoreException } from './BaseCoreException';

export class KeyException extends BaseCoreException {
  constructor(message?: string) {
    super(message);
    Object.setPrototypeOf(this, KeyException.prototype);
  }
}
