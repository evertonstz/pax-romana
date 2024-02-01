import { BaseSharedException } from './BaseSharedException';

export class InvalidSerialException extends BaseSharedException {
  constructor(message?: string) {
    super(message);
    Object.setPrototypeOf(this, InvalidSerialException.prototype);
  }
}
