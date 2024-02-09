import { Button, ConfigProvider, Flex, Row, Typography, theme } from 'antd';
import { useCallback, useEffect, useState } from 'react';

import { PageLayout } from './Layout';
import ResizableSquare from './ResizableSquare';
import DevicesModal from './components/DevicesModal';
import TemperatureProgress from './components/TemperatureProgress';
import ThemeSwitcher from './components/ThemeSwitcher';
import { PaxBluetoothCharacteristics } from './enums/PaxBluetoothCharacteristics';
import { PaxBluetoothServices } from './enums/PaxBluetoothServices';
import {
  BluetoothHookState,
  useBluetooth,
  useDevicesLocalStorage,
} from './hooks';
import { Pax } from './pax';
import { usePaxContext, useThemeContext } from './state/hooks';
import { ThemeColor } from './state/themeState/types';

const DEVICES = [Pax.lib.Devices.PAX3];

const getTheme = (color: ThemeColor) => {
  if (color === 'light') return theme.defaultAlgorithm;
  return theme.darkAlgorithm;
};

const consumePacket = async (
  bluetooth: BluetoothHookState,
  serial: Pax.lib.PaxSerial,
): Promise<Pax.api.models.GetResponse> => {
  if (!bluetooth.server) {
    throw new Error('No server found');
  }

  const service = await bluetooth.server.getPrimaryService(
    PaxBluetoothServices.MainService,
  );

  const readAndWriteCharacteristic = await service?.getCharacteristic(
    PaxBluetoothCharacteristics.ReadAndWrite,
  );

  const currentValue = await readAndWriteCharacteristic?.readValue();
  const dec_message = Pax.api.get(
    new Pax.lib.PaxEncryptedPacket(currentValue.buffer),
    serial,
  );
  return dec_message;
};

function App() {
  const { state, actions } = usePaxContext();
  const { state: themeState } = useThemeContext();
  const deviceStore = useDevicesLocalStorage();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const bluetoothState = useBluetooth(Pax.lib.Devices.PAX3);

  const handleUpdateOnInterval = useCallback(async () => {
    if (deviceStore.currentDevice === undefined || !bluetoothState.connected) {
      return;
    }

    const response = await consumePacket(
      bluetoothState,
      deviceStore.currentDevice,
    );

    if (response.message instanceof Pax.lib.messages.UnknownMessage) {
      return;
    }

    if (response.message instanceof Pax.lib.messages.ActualTemperatureMessage) {
      actions.setActualTemperature(response.message.temperature);
    }
    if (response.message instanceof Pax.lib.messages.HeaterSetPointMessage) {
      actions.setHeaterSetPointTemperature(response.message.temperature);
    }
  }, [actions, bluetoothState, deviceStore.currentDevice]);

  useEffect(() => {
    if (bluetoothState.connected) {
      // add event listener to consume notifications
      // this is needed because new info to read will only
      // be broadcasted once a new Notification is consumed
      void bluetoothState.addCharacteristicListener(
        PaxBluetoothCharacteristics.Notifications,
        () => {
          void handleUpdateOnInterval();
        },
      );
    }
  }, [bluetoothState, handleUpdateOnInterval]);

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
