export class BaseApiException extends Error {
  constructor(message?: string) {
    super(message);
    Object.setPrototypeOf(this, BaseApiException.prototype);
  }
}
