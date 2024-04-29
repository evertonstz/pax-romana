import { PaxDecryptedPacket } from '@/pax/containers/lib';
import { Messages } from '@/pax/shared/enums';

import { MessageAbs } from './MessageAbs';
import { ReadAndWriteMessageAbs } from './ReadAndWriteMessageAbs';

export class BrightnessMessage
  extends ReadAndWriteMessageAbs
  implements MessageAbs
{
  readonly brightness: number;
  readonly messageType: Messages;
  readonly packet: PaxDecryptedPacket;

  readonly PaxBrightnessMin = 0;
  readonly PaxBrightnessMax = 128;

  constructor(
    builder:
      | BrightnessMessageBuilderFromPacket<BrightnessMessage>
      | BrightnessMessageBuilderFromValue<BrightnessMessage>,
  ) {
    super();
    this.messageType = Messages.ATTRIBUTE_BRIGHTNESS;
    if (builder instanceof BrightnessMessageBuilderFromPacket) {
      this.packet = builder.getPacket();
      const absoluteBrightness = this.packet.getUint8(1);
      const brightnessPercentage =
        this.brightnessToPercentage(absoluteBrightness);

      this.brightness = brightnessPercentage;
    } else if (builder instanceof BrightnessMessageBuilderFromValue) {
      this.brightness = builder.getBrightness();
      const buffer = new ArrayBuffer(16);
      const view = new PaxDecryptedPacket(buffer);
      view.setUint8(0, this.messageType);
      view.setUint8(1, this.brightnessToAbsolute(this.brightness));
      this.packet = view;
    } else {
      throw new Error('Invalid builder');
    }
  }

  private brightnessToPercentage(brightness: number): number {
    return (
      (brightness - this.PaxBrightnessMin) /
      (this.PaxBrightnessMax - this.PaxBrightnessMin)
    );
  }

  private brightnessToAbsolute(brightness: number): number {
    return brightness * (this.PaxBrightnessMax - this.PaxBrightnessMin);
  }

  static createWithPacket(packet: PaxDecryptedPacket): BrightnessMessage {
    const builder = new BrightnessMessageBuilderFromPacket<BrightnessMessage>();
    builder.setPacket(packet);
    return new BrightnessMessage(builder);
  }

  static createWithBrightness(brightness: number): BrightnessMessage {
    const builder = new BrightnessMessageBuilderFromValue<BrightnessMessage>();
    builder.setBrightness(brightness);
    return new BrightnessMessage(builder);
  }
}

export class BrightnessMessageBuilderFromPacket<T extends BrightnessMessage> {
  private packet?: PaxDecryptedPacket;

  setPacket(packet: PaxDecryptedPacket): BrightnessMessageBuilderFromPacket<T> {
    this.packet = packet;
    return this;
  }

  getPacket(): PaxDecryptedPacket {
    if (!this.packet) {
      throw new Error('Packet is not set');
    }
    return this.packet;
  }

  build(ctor: new (builder: BrightnessMessageBuilderFromPacket<T>) => T): T {
    if (!this.packet) {
      throw new Error('Packet is not set');
    }
    return new ctor(this);
  }
}

export class BrightnessMessageBuilderFromValue<T extends BrightnessMessage> {
  private brightness?: number;

  setBrightness(brightness: number): BrightnessMessageBuilderFromValue<T> {
    this.brightness = brightness;
    return this;
  }

  getBrightness(): number {
    if (!this.brightness) {
      throw new Error('Theme is not set');
    }
    return this.brightness;
  }

  build(ctor: new (builder: BrightnessMessageBuilderFromValue<T>) => T): T {
    if (!this.brightness) {
      throw new Error('Brightness is not set');
    }
    return new ctor(this);
  }
}
