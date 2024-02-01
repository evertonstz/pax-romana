import { BaseCoreException } from './BaseCoreException';

export class InvalidPacketTypeException extends BaseCoreException {
  constructor(message?: string) {
    super(message);
    Object.setPrototypeOf(this, InvalidPacketTypeException.prototype);
  }
}
