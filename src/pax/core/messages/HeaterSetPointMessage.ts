import { PaxDecryptedPacket } from '@/pax/containers/lib';

import { Messages } from '../../shared/enums/Messages';
import {
  ReadAndWriteTemperatureMessage,
  ReadAndWriteTemperatureMessageBuilderFromPacket,
  ReadAndWriteTemperatureMessageBuilderFromTemperature,
} from './BaseTemperatureMessages';

export class HeaterSetPointMessage extends ReadAndWriteTemperatureMessage {
  constructor(
    builder:
      | ReadAndWriteTemperatureMessageBuilderFromPacket<HeaterSetPointMessage>
      | ReadAndWriteTemperatureMessageBuilderFromTemperature<HeaterSetPointMessage>,
  ) {
    super(builder, Messages.ATTRIBUTE_HEATER_SET_POINT);
  }

  static createWithPacket(packet: PaxDecryptedPacket): HeaterSetPointMessage {
    const builder =
      new ReadAndWriteTemperatureMessageBuilderFromPacket<HeaterSetPointMessage>();
    builder.setPacket(packet);
    return new HeaterSetPointMessage(builder);
  }

  static createWithTemperature(temperature: number): HeaterSetPointMessage {
    const builder =
      new ReadAndWriteTemperatureMessageBuilderFromTemperature<HeaterSetPointMessage>();
    builder.setTemperature(temperature);
    return new HeaterSetPointMessage(builder);
  }
}
