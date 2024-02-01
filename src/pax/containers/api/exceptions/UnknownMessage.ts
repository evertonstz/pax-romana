import { BaseApiException } from './BaseApiException';

export class UnknownMessage extends BaseApiException {
  constructor(message?: string) {
    super(message);
    Object.setPrototypeOf(this, UnknownMessage.prototype);
  }
}
