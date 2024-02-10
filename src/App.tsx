import { Button, ConfigProvider, Flex, Row, Typography, theme } from 'antd';
import { useCallback, useEffect, useState } from 'react';

import { PageLayout } from './Layout';
import ResizableSquare from './ResizableSquare';
import DevicesModal from './components/DevicesModal';
import HeaterStatus from './components/HeaterStatus';
import TemperatureProgress from './components/TemperatureProgress';
import ThemeSwitcher from './components/ThemeSwitcher';
import { useDevicesLocalStorage, usePaxBluetoothServices } from './hooks';
import { BaseBluetoothException } from './hooks/usePaxBluetoothServices/useBluetooth/exceptions';
import { Pax } from './pax';
import { usePaxContext, useThemeContext } from './state/hooks';
import { ThemeColor } from './state/themeState/types';

const DEVICES = [Pax.lib.Devices.PAX3];

const getTheme = (color: ThemeColor) => {
  if (color === 'light') return theme.defaultAlgorithm;
  return theme.darkAlgorithm;
};

function App() {
  const { state, actions } = usePaxContext();
  const { state: themeState } = useThemeContext();
  const deviceStore = useDevicesLocalStorage();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // TODO do not render if there's no device in store
  const bluetoothState = usePaxBluetoothServices(deviceStore.currentDevice);

  const messagesConsumer = useCallback(() => {
    if (deviceStore.currentDevice === undefined || !bluetoothState.connected) {
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
  }, [actions, bluetoothState, deviceStore.currentDevice]);

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
    <ConfigProvider theme={{ algorithm: getTheme(themeState.themeColor) }}>
      <PageLayout>
        <DevicesModal
          open={isModalOpen}
          devices={DEVICES}
          defaultDevice={DEVICES[0]}
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
              Current Device:{' '}
              {!deviceStore.currentDevice
                ? ''
                : deviceStore.currentDevice.serial}
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
      </PageLayout>
    </ConfigProvider>
  );
}

export default App;
