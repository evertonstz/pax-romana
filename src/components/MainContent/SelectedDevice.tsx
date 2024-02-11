import { usePaxBluetoothServices } from '@/hooks';
// eslint-disable-next-line prettier/prettier
import { BaseBluetoothException } 
        from '@/hooks/usePaxBluetoothServices/useBluetooth/exceptions';
import { Pax } from '@/pax';
import { usePaxContext } from '@/state/hooks';
import { Button, Flex, Row, Typography } from 'antd';
import { useCallback, useEffect, useState } from 'react';

import DevicesModal from '../DevicesModal';
import HeaterStatus from '../HeaterStatus';
import TemperatureProgress from '../TemperatureProgress';
import ThemeSwitcher from '../ThemeSwitcher';
import ResizableSquare from './ResizableSquare';
import { SUPPORTED_DEVICES } from './constants';

interface SelectedDeviceProps {
  currentDevice: Pax.lib.PaxSerial;
}

export const SelectedDevice = ({ currentDevice }: SelectedDeviceProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
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
      bluetoothState.eventListener.startListening(messagesConsumer).catch(e => {
        if (e instanceof BaseBluetoothException) {
          // eslint-disable-next-line no-console
          console.error('startListening', String(e));
        }
      });
    }
  }, [bluetoothState, messagesConsumer]);

  return (
    <>
      <DevicesModal
        open={isModalOpen}
        devices={SUPPORTED_DEVICES}
        defaultDevice={SUPPORTED_DEVICES[0]}
        onCancel={() => setIsModalOpen(false)}
      ></DevicesModal>
      <ResizableSquare>
        <Flex
          style={{ height: '70%' }}
          justify="center"
          align="center"
          gap="middle"
          vertical
        >
          <Row>
            <ThemeSwitcher />
          </Row>
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
            <Button type="primary" onClick={() => setIsModalOpen(true)}>
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
      </ResizableSquare>
    </>
  );
};
