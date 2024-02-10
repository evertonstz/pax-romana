import { BaseBluetoothException } from './BaseBluetoothException';

export class BluetoothAbortException extends BaseBluetoothException {
  constructor(message?: string) {
    super(`BluetoothAbortException: ${message}`);
    Object.setPrototypeOf(this, BluetoothAbortException.prototype);
  }
}
