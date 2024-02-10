import { BaseBluetoothException } from './BaseBluetoothException';

export class BluetoothUnknownException extends BaseBluetoothException {
  constructor(message?: string) {
    super(`BluetoothUnknownException: ${message}`);
    Object.setPrototypeOf(this, BluetoothUnknownException.prototype);
  }
}
