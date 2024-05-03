import { PaxDecryptedPacket } from '@/pax/containers/lib';
import { Messages } from '@/pax/shared/enums';

import { MessageAbs } from './MessageAbs';
import { ReadAndWriteMessageAbs } from './ReadAndWriteMessageAbs';

export class HapticsMessage
  extends ReadAndWriteMessageAbs
  implements MessageAbs
{
  readonly percentage: number;
  readonly messageType: Messages;
  readonly packet: PaxDecryptedPacket;

  readonly PaxHapticsAmpMin = 0;
  readonly PaxHapticsAmpMax = 128;

  constructor(
    builder:
      | HapticsMessageBuilderFromPacket<HapticsMessage>
      | HapticsMessageBuilderFromValue<HapticsMessage>,
  ) {
    super();
    this.messageType = Messages.ATTRIBUTE_HAPTIC_MODE;
    if (builder instanceof HapticsMessageBuilderFromPacket) {
      this.packet = builder.getPacket();
      const hapticsAmplitude = this.packet.getUint8(1);
      this.percentage = this.hapticsToPercentage(hapticsAmplitude);
    } else if (builder instanceof HapticsMessageBuilderFromValue) {
      this.percentage = builder.getHaptics();
      const buffer = new ArrayBuffer(16);
      const view = new PaxDecryptedPacket(buffer);
      view.setUint8(0, this.messageType);
      view.setUint8(1, this.percentageToHaptics(this.percentage));
      this.packet = view;
    } else {
      throw new Error('Invalid builder');
    }
  }

  private hapticsToPercentage(haptics: number): number {
    return (
      (haptics - this.PaxHapticsAmpMin) /
      (this.PaxHapticsAmpMax - this.PaxHapticsAmpMin)
    );
  }

  private percentageToHaptics(percentage: number): number {
    return Math.round(percentage * this.PaxHapticsAmpMax);
  }

  static createWithPacket(packet: PaxDecryptedPacket): HapticsMessage {
    const builder = new HapticsMessageBuilderFromPacket<HapticsMessage>();
    builder.setPacket(packet);
    return new HapticsMessage(builder);
  }

  static createWithHaptics(percentage: number): HapticsMessage {
    const builder = new HapticsMessageBuilderFromValue<HapticsMessage>();
    builder.setBrightness(percentage);
    return new HapticsMessage(builder);
  }
}

export class HapticsMessageBuilderFromPacket<T extends HapticsMessage> {
  private packet?: PaxDecryptedPacket;

  setPacket(packet: PaxDecryptedPacket): HapticsMessageBuilderFromPacket<T> {
    this.packet = packet;
    return this;
  }

  getPacket(): PaxDecryptedPacket {
    if (!this.packet) {
      throw new Error('Packet is not set');
    }
    return this.packet;
  }

  build(ctor: new (builder: HapticsMessageBuilderFromPacket<T>) => T): T {
    if (!this.packet) {
      throw new Error('Packet is not set');
    }
    return new ctor(this);
  }
}

export class HapticsMessageBuilderFromValue<T extends HapticsMessage> {
  private percentage?: number;

  setBrightness(percentage: number): HapticsMessageBuilderFromValue<T> {
    this.percentage = percentage;
    return this;
  }

  getHaptics(): number {
    if (this.percentage === undefined) {
      throw new Error('Percentage is not set');
    }
    return this.percentage;
  }

  build(ctor: new (builder: HapticsMessageBuilderFromValue<T>) => T): T {
    if (this.percentage === undefined) {
      throw new Error('Percentage is not set');
    }
    return new ctor(this);
  }
}
