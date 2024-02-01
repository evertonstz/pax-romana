export class BaseCoreException extends Error {
  constructor(message?: string) {
    super(message);
    Object.setPrototypeOf(this, BaseCoreException.prototype);
  }
}
