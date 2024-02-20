import { Messages } from '../../shared/enums/Messages';
import { PaxDecryptedPacket } from '../../shared/models/Packet';
import { InvalidPacketTypeException } from '../exceptions';
import { MessageAbs } from './MessageAbs';
import { ReadAndWriteMessageAbs } from './ReadAndWriteMessageAbs';

export class ReadOnlyTemperatureMessage implements MessageAbs {
  readonly temperature: number;
  readonly messageType: Messages;
  readonly packet: PaxDecryptedPacket;

  constructor(messageType: Messages, packet: PaxDecryptedPacket) {
    this.validatePacket(packet);
    const temperature = packet.getUint16(1, true) / 10.0;
    this.temperature = temperature;
    this.messageType = messageType;
    this.packet = packet;
  }

  private validatePacket(packet: PaxDecryptedPacket) {
    if (packet.byteLength <= 1 + 2) {
      throw new InvalidPacketTypeException('Packet too small');
    }
  }
}

export abstract class ReadAndWriteTemperatureMessage
  extends ReadAndWriteMessageAbs
  implements MessageAbs
{
  readonly temperature: number;
  readonly messageType: Messages;
  readonly packet: PaxDecryptedPacket;

  constructor(
    builder:
      | ReadAndWriteTemperatureMessageBuilderFromPacket<ReadAndWriteTemperatureMessage>
      | ReadAndWriteTemperatureMessageBuilderFromTemperature<ReadAndWriteTemperatureMessage>,
    messageType: Messages,
  ) {
    super();
    this.messageType = messageType;
    if (builder instanceof ReadAndWriteTemperatureMessageBuilderFromPacket) {
      // infer temperature and packet
      this.packet = builder.getPacket();
      this.temperature = this.packet.getUint16(1, true) / 10.0;
    } else if (
      builder instanceof ReadAndWriteTemperatureMessageBuilderFromTemperature
    ) {
      // infer packet from temperature
      // TODO: temperature should be  temp >= 175, temp <= 215
      this.temperature = builder.getTemperature();
      const buffer = new ArrayBuffer(16);
      const view = new PaxDecryptedPacket(buffer);
      // sets message type and message content
      view.setUint8(0, this.messageType);
      view.setUint16(1, Math.round(this.temperature * 10), true);
      this.packet = view;
    } else {
      throw new Error('Invalid builder');
    }
  }

  // private validatePacket(packet: PaxDecryptedPacket) {
  //   if (packet.byteLength <= 1 + 2) {
  //     throw new InvalidPacketTypeException('Packet too small');
  //   }
  // }
}

export class ReadAndWriteTemperatureMessageBuilderFromPacket<
  T extends ReadAndWriteTemperatureMessage,
> {
  private packet?: PaxDecryptedPacket;

  setPacket(
    packet: PaxDecryptedPacket,
  ): ReadAndWriteTemperatureMessageBuilderFromPacket<T> {
    this.packet = packet;
    return this;
  }

  getPacket(): PaxDecryptedPacket {
    if (!this.packet) {
      throw new Error('Packet is not set');
    }
    return this.packet;
  }

  build(
    ctor: new (
      builder: ReadAndWriteTemperatureMessageBuilderFromPacket<T>,
    ) => T,
  ): T {
    if (!this.packet) {
      throw new Error('Packet is not set');
    }
    return new ctor(this);
  }
}

export class ReadAndWriteTemperatureMessageBuilderFromTemperature<
  T extends ReadAndWriteTemperatureMessage,
> {
  private temperature?: number;

  setTemperature(
    temperature: number,
  ): ReadAndWriteTemperatureMessageBuilderFromTemperature<T> {
    this.temperature = temperature;
    return this;
  }

  getTemperature(): number {
    if (!this.temperature) {
      throw new Error('Temperature is not set');
    }
    return this.temperature;
  }

  build(
    ctor: new (
      builder: ReadAndWriteTemperatureMessageBuilderFromTemperature<T>,
    ) => T,
  ): T {
    if (!this.temperature) {
      throw new Error('Temperature is not set');
    }
    return new ctor(this);
  }
}
