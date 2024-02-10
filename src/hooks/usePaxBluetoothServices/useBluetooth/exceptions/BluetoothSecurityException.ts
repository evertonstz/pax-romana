import { BaseBluetoothException } from './BaseBluetoothException';

export class BluetoothSecurityException extends BaseBluetoothException {
  constructor(message?: string) {
    super(`BluetoothSecurityException: ${message}`);
    Object.setPrototypeOf(this, BluetoothSecurityException.prototype);
  }
}
