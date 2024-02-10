import { BaseBluetoothException } from './BaseBluetoothException';

export class BluetoothAdapterNotFoundException extends BaseBluetoothException {
  constructor(message?: string) {
    super(`BluetoothAdapterNotFoundException: ${message}`);
    Object.setPrototypeOf(this, BluetoothAdapterNotFoundException.prototype);
  }
}
