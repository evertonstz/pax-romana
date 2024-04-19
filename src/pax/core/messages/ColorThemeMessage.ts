import { PaxDecryptedPacket } from '@/pax/containers/lib';
import { Messages } from '@/pax/shared/enums';
import { ColorMode, ColorTheme } from '@/pax/shared/types/colorTheme';

import { MessageAbs } from './MessageAbs';
import { ReadAndWriteMessageAbs } from './ReadAndWriteMessageAbs';

export class ColorThemeMessage
  extends ReadAndWriteMessageAbs
  implements MessageAbs
{
  readonly theme: ColorTheme;
  readonly messageType: Messages;
  readonly packet: PaxDecryptedPacket;

  constructor(
    builder:
      | ColorThemeMessageBuilderFromPacket<ColorThemeMessage>
      | ColorThemeMessageBuilderFromValue<ColorThemeMessage>,
  ) {
    super();
    this.messageType = Messages.ATTRIBUTE_COLOR_THEME;
    if (builder instanceof ColorThemeMessageBuilderFromPacket) {
      this.packet = builder.getPacket();
      const colorModesCount = this.packet.getUint8(1);

      const colorModes: ColorMode[] = [];

      for (let i = 0; i < colorModesCount; i++) {
        const byteOffset = 2 + i * 8;
        const colorBytes = new Uint8Array(this.packet.buffer, byteOffset, 8);
        const colorMode = this.bytesToColorMode(colorBytes);
        colorModes.push(colorMode);
      }
      const colorTheme = {
        heating: colorModes[1],
        regulating: colorModes[2],
        standby: colorModes[3],
        startup: colorModes[0],
      };
      this.theme = colorTheme;
    } else if (builder instanceof ColorThemeMessageBuilderFromValue) {
      this.theme = builder.getTheme();

      const extractIntFromColorMode = (colorMode: ColorMode): number[] => {
        return [
          colorMode.color1.red,
          colorMode.color1.green,
          colorMode.color1.blue,
          colorMode.color2.red,
          colorMode.color2.green,
          colorMode.color2.blue,
          colorMode.animation,
          colorMode.frequency,
        ];
      };

      const arr = new Uint8Array([
        this.messageType,
        Object.keys(this.theme).length,
        ...extractIntFromColorMode(this.theme.startup),
        ...extractIntFromColorMode(this.theme.heating),
        ...extractIntFromColorMode(this.theme.regulating),
        ...extractIntFromColorMode(this.theme.standby),
      ]);

      const view = new PaxDecryptedPacket(
        arr.buffer,
        arr.byteOffset,
        arr.byteLength,
      );
      view.setUint8(0, this.messageType);
      this.packet = view;
    } else {
      throw new Error('Invalid builder');
    }
  }

  bytesToColorMode(array: Uint8Array): ColorMode {
    return {
      animation: array[6],
      color1: {
        blue: array[2],
        green: array[1],
        red: array[0],
      },
      color2: {
        blue: array[5],
        green: array[4],
        red: array[3],
      },
      frequency: array[7],
    };
  }

  static createWithPacket(packet: PaxDecryptedPacket): ColorThemeMessage {
    const builder = new ColorThemeMessageBuilderFromPacket<ColorThemeMessage>();
    builder.setPacket(packet);
    return new ColorThemeMessage(builder);
  }

  static createWithTheme(theme: ColorTheme): ColorThemeMessage {
    const builder = new ColorThemeMessageBuilderFromValue<ColorThemeMessage>();
    builder.setTheme(theme);
    return new ColorThemeMessage(builder);
  }
}

export class ColorThemeMessageBuilderFromPacket<T extends ColorThemeMessage> {
  private packet?: PaxDecryptedPacket;

  setPacket(packet: PaxDecryptedPacket): ColorThemeMessageBuilderFromPacket<T> {
    this.packet = packet;
    return this;
  }

  getPacket(): PaxDecryptedPacket {
    if (!this.packet) {
      throw new Error('Packet is not set');
    }
    return this.packet;
  }

  build(ctor: new (builder: ColorThemeMessageBuilderFromPacket<T>) => T): T {
    if (!this.packet) {
      throw new Error('Packet is not set');
    }
    return new ctor(this);
  }
}

export class ColorThemeMessageBuilderFromValue<T extends ColorThemeMessage> {
  private theme?: ColorTheme;

  setTheme(theme: ColorTheme): ColorThemeMessageBuilderFromValue<T> {
    this.theme = theme;
    return this;
  }

  getTheme(): ColorTheme {
    if (!this.theme) {
      throw new Error('Theme is not set');
    }
    return this.theme;
  }

  build(ctor: new (builder: ColorThemeMessageBuilderFromValue<T>) => T): T {
    if (!this.theme) {
      throw new Error('Theme is not set');
    }
    return new ctor(this);
  }
}
