import { PaxDecryptedPacket } from '@/pax/containers/lib';
import { Messages } from '@/pax/shared/enums';

import { MessageAbs } from './MessageAbs';
import { ReadAndWriteMessageAbs } from './ReadAndWriteMessageAbs';

export class RequestStatusMessage
  extends ReadAndWriteMessageAbs
  implements MessageAbs
{
  readonly messages: Messages[];
  readonly messageType: Messages;
  readonly packet: PaxDecryptedPacket;

  readonly PaxBrightnessMin = 0;
  readonly PaxBrightnessMax = 128;

  constructor(
    builder: RequestStatusMessageBuilderFromValue<RequestStatusMessage>,
  ) {
    super();
    this.messageType = Messages.ATTRIBUTE_STATUS_UPDATE;
    if (builder instanceof RequestStatusMessageBuilderFromValue) {
      this.messages = builder.getMessages();
      const value = this.messages.reduce((acc, attributeId) => {
        return acc + Math.pow(2, attributeId);
      }, 0);
      const buffer = new ArrayBuffer(16);
      const view = new PaxDecryptedPacket(buffer);
      view.setUint8(0, this.messageType);
      view.setBigUint64(1, BigInt(value), true);
      this.packet = view;
    } else {
      throw new Error('Invalid builder');
    }
  }

  static createWithMessage(message: Messages[]): RequestStatusMessage {
    const builder =
      new RequestStatusMessageBuilderFromValue<RequestStatusMessage>();
    builder.setMessages(message);
    return new RequestStatusMessage(builder);
  }
}

export class RequestStatusMessageBuilderFromValue<
  T extends RequestStatusMessage,
> {
  private message?: Messages[];

  setMessages(message: Messages[]): RequestStatusMessageBuilderFromValue<T> {
    this.message = message;
    return this;
  }

  getMessages(): Messages[] {
    if (!this.message) {
      throw new Error('Messages are not set');
    }
    return this.message;
  }

  build(ctor: new (builder: RequestStatusMessageBuilderFromValue<T>) => T): T {
    if (!this.message) {
      throw new Error('Messages are not set');
    }
    return new ctor(this);
  }
}
