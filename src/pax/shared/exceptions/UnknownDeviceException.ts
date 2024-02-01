import { BaseSharedException } from './BaseSharedException';

export class UnknownDeviceException extends BaseSharedException {
  constructor(message?: string) {
    super(message);
    Object.setPrototypeOf(this, UnknownDeviceException.prototype);
  }
}
