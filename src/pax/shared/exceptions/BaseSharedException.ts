export class BaseSharedException extends Error {
  constructor(message?: string) {
    super(message);
    Object.setPrototypeOf(this, BaseSharedException.prototype);
  }
}
