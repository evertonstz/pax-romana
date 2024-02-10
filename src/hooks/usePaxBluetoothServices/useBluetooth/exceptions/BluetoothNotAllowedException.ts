import { BaseBluetoothException } from './BaseBluetoothException';

export class BluetoothNotAllowedException extends BaseBluetoothException {
  constructor(message?: string) {
    super(`BluetoothNotAllowedException: ${message}`);
    Object.setPrototypeOf(this, BluetoothNotAllowedException.prototype);
  }
}
