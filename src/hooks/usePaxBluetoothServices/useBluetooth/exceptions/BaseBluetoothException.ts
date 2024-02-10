export class BaseBluetoothException extends Error {
  constructor(message?: string) {
    super(message);
    Object.setPrototypeOf(this, BaseBluetoothException.prototype);
  }
}
