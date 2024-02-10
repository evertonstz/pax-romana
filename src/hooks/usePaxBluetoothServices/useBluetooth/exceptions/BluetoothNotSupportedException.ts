import { BaseBluetoothException } from './BaseBluetoothException';

export class BluetoothNotSupportedException extends BaseBluetoothException {
  constructor(message?: string) {
    super(`BluetoothNotSupportedException: ${message}`);
    Object.setPrototypeOf(this, BluetoothNotSupportedException.prototype);
  }
}
