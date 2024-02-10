import { BaseBluetoothException } from './BaseBluetoothException';

export class BluetoothNetworkException extends BaseBluetoothException {
  constructor(message?: string) {
    super(`BluetoothNetworkException: ${message}`);
    Object.setPrototypeOf(this, BluetoothNetworkException.prototype);
  }
}
