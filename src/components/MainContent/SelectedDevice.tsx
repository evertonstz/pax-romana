import { usePaxBluetoothServices } from '@/hooks';
import { BaseBluetoothException } from '@/hooks/usePaxBluetoothServices/useBluetooth/exceptions';
import { Pax } from '@/pax';
import { post } from '@/pax/containers/api';
import {
  BatteryPercentageMessage,
  BrightnessMessage,
  ColorThemeMessage,
} from '@/pax/core/messages';
import { ColorTheme } from '@/pax/shared/types';
import { usePaxContext } from '@/state/hooks';
import { isEqual } from 'lodash';
import { useCallback, useEffect } from 'react';

import HeaterStatus from '../HeaterStatus';
import TemperatureProgress from '../TemperatureProgress';
import { ThemePicker } from '../ThemePicker';
import { hardcodedThemes } from '../ThemePicker/colors';
import { Button } from '../ui/button';
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
