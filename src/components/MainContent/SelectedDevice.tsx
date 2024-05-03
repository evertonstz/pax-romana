import { usePaxBluetoothServices } from '@/hooks';
import { BaseBluetoothException } from '@/hooks/usePaxBluetoothServices/useBluetooth/exceptions';
import { Pax } from '@/pax';
import { post } from '@/pax/containers/api';
import {
  BatteryPercentageMessage,
  BrightnessMessage,
  ColorThemeMessage,
  HapticsMessage,
  RequestStatusMessage,
} from '@/pax/core/messages';
import { Messages } from '@/pax/shared/enums';
import { ColorTheme } from '@/pax/shared/types';
import { usePaxContext } from '@/state/hooks';
import { isEqual } from 'lodash';
import { useCallback, useEffect } from 'react';

import HeaterStatus from '../HeaterStatus';
import TemperatureProgress from '../TemperatureProgress';
import { ThemePicker } from '../ThemePicker';
import { hardcodedThemes } from '../ThemePicker/colors';
import { Button } from '../ui/button';
import { Slider } from '../ui/slider';
import { Connect } from './SelectedDevice/Connect';

interface SelectedDeviceProps {
  currentDevice: Pax.lib.PaxSerial;
  openDevicesModal: () => void;
}

export const SelectedDevice = ({ currentDevice }: SelectedDeviceProps) => {
  const { state, actions } = usePaxContext();
  const bluetoothState = usePaxBluetoothServices(currentDevice);

  const messagesConsumer = useCallback(() => {
    if (!bluetoothState.connected) {
      return;
    }

    bluetoothState
      .readFromMainService()
      .then(message => {
        if (message instanceof Pax.lib.messages.UnknownMessage) {
          return;
        }
        if (message instanceof Pax.lib.messages.ActualTemperatureMessage) {
          actions.setActualTemperature(message.temperature);
        }
        if (message instanceof Pax.lib.messages.HeaterSetPointMessage) {
          actions.setHeaterSetPointTemperature(message.temperature);
        }
        if (message instanceof Pax.lib.messages.HeatingStateMessage) {
          actions.setHeatingState(message.heatingState);
        }
        if (message instanceof Pax.lib.messages.ColorThemeMessage) {
          actions.setColorTheme(message.theme);
        }
        if (message instanceof BatteryPercentageMessage) {
          actions.setBatteryPercentage(message.percentage);
        }
        if (message instanceof BrightnessMessage) {
          actions.setBrightness(message.brightness);
        }
        if (message instanceof HapticsMessage) {
          actions.setHaptics(message.percentage);
        }
      })
      .catch(e => {
        if (e instanceof BaseBluetoothException) {
          // eslint-disable-next-line no-console
          console.error('messagesConsumer', String(e));
        }
      });
  }, [actions, bluetoothState]);

  useEffect(() => {
    if (
      bluetoothState.connected &&
      !bluetoothState.eventListener.isListenerAdded
    ) {
      // add event listener to consume notifications
      // this is needed because new info to read will only
      // be broadcasted once a new Notification is consumed
      void bluetoothState.eventListener.startListening(messagesConsumer);
    }
  }, [bluetoothState, messagesConsumer]);

  useEffect(() => {
    if (!bluetoothState.connected) {
      actions.resetPaxState();
    }
  }, [actions, bluetoothState.connected]);

  if (!bluetoothState.connected) {
    return (
      <div className="mx-3 flex flex-grow justify-center">
        <Connect connect={bluetoothState.connect} />
      </div>
    );
  }

  return (
    <div className="mx-auto flex flex-col gap-6 self-center">
      <TemperatureProgress
        connected={bluetoothState.connected}
        heaterSetPointTemperature={state.heaterSetPointTemperature}
        actualTemperature={state.actualTemperature}
        unit={'C'}
      />
      <Slider
        disabled={!bluetoothState.connected && !state.brightness}
        max={1}
        step={0.1}
        value={state.brightness ? [state.brightness] : [0]}
        onValueChange={value => {
          actions.setBrightness(value[0]);
        }}
        onValueCommit={value => {
          const toPost = post(
            BrightnessMessage.createWithBrightness(value[0]),
            currentDevice,
          );
          void bluetoothState.writeToMainService(toPost.packet);
        }}
      />
      <Slider
        disabled={!bluetoothState.connected && !state.haptics}
        max={1}
        step={0.1}
        value={state.haptics ? [state.haptics] : [0]}
        onValueChange={value => {
          actions.setHaptics(value[0]);
        }}
        onValueCommit={value => {
          const toPost = post(
            HapticsMessage.createWithHaptics(value[0]),
            currentDevice,
          );
          void bluetoothState.writeToMainService(toPost.packet);
        }}
      />

      <HeaterStatus heaterStatus={state.heatingSate} />
      <h1>Device: {!currentDevice ? '' : currentDevice.serial}</h1>
      <Button
        onClick={
          bluetoothState.connected
            ? bluetoothState.disconnect
            : bluetoothState.connect
        }
        variant="secondary"
      >
        {bluetoothState.connected ? 'Disconnect' : 'Connect'}
      </Button>
      <Button
        onClick={() => {
          const toPost = post(
            RequestStatusMessage.createWithMessage([
              Messages.ATTRIBUTE_COLOR_THEME,
              Messages.ATTRIBUTE_BRIGHTNESS,
              Messages.ATTRIBUTE_HAPTIC_MODE,
            ]),
            currentDevice,
          );
          void bluetoothState.writeToMainService(toPost.packet);
        }}
        variant="secondary"
      >
        Update stats
      </Button>
      <ThemePicker
        loading={!bluetoothState.connected}
        colorThemes={hardcodedThemes}
        selectedThemeIndex={hardcodedThemes.findIndex(theme =>
          isEqual(theme.theme, state.colorTheme),
        )}
        onClick={(selectedTheme: ColorTheme) => {
          const toPost = post(
            ColorThemeMessage.createWithTheme(selectedTheme),
            currentDevice,
          );
          bluetoothState
            .writeToMainService(toPost.packet)
            .then(() => {
              actions.setColorTheme(selectedTheme);
            })
            .catch(e => {
              if (e instanceof BaseBluetoothException) {
                // eslint-disable-next-line no-console
                console.error('ThemePicker', String(e));
              }
            });
        }}
      />
    </div>
  );
};
