import { usePaxBluetoothServices } from '@/hooks';
import { BaseBluetoothException } from '@/hooks/usePaxBluetoothServices/useBluetooth/exceptions';
import { Pax } from '@/pax';
import { usePaxContext } from '@/state/hooks';
import { Button, Flex, Row, Typography } from 'antd';
import { useCallback, useEffect } from 'react';

import HeaterStatus from '../HeaterStatus';
import TemperatureProgress from '../TemperatureProgress';

interface SelectedDeviceProps {
  currentDevice: Pax.lib.PaxSerial;
  openDevicesModal: () => void;
}

export const SelectedDevice = ({
  currentDevice,
  openDevicesModal,
}: SelectedDeviceProps) => {
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

  return (
    <>
      <Flex
        style={{ height: '70%' }}
        justify="center"
        align="center"
        gap="middle"
        vertical
      >
        <TemperatureProgress
          connected={bluetoothState.connected}
          heaterSetPointTemperature={state.heaterSetPointTemperature}
          actualTemperature={state.actualTemperature}
          unit={'C'}
        />
        <HeaterStatus heaterStatus={state.heatingSate} />
        <Typography.Text>
          Current Device: {!currentDevice ? '' : currentDevice.serial}
        </Typography.Text>
        <Row>
          <Button type="primary" onClick={openDevicesModal}>
            Devices
          </Button>
          <Button
            onClick={
              bluetoothState.connected
                ? bluetoothState.disconnect
                : bluetoothState.connect
            }
          >
            {bluetoothState.connected ? 'Disconnect' : 'Connect'}
          </Button>
        </Row>
      </Flex>
    </>
  );
};
