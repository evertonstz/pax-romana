import { Button, ConfigProvider, Flex, Row, Typography, theme } from 'antd';
import { useEffect, useState } from 'react';

import { PageLayout } from './Layout';
import ResizableSquare from './ResizableSquare';
import DevicesModal from './components/DevicesModal';
import TemperatureProgress from './components/TemperatureProgress';
// import './App.css';
import ThemeSwitcher from './components/ThemeSwitcher';
import { PaxBluetoothCharacteristics } from './enums/PaxBluetoothCharacteristics';
import { PaxBluetoothServices } from './enums/PaxBluetoothServices';
import { useBluetooth, useDevicesLocalStorage } from './hooks';
import { BluetoothHookState } from './hooks/types';
import { Pax } from './pax';
import useAppContext from './state/hooks/useAppContext';
import { setHeaterSetPointTemperature } from './state/paxState/actions';
import { Theme } from './state/paxState/types';

const DEVICES = [Pax.lib.Devices.PAX3];

const getTheme = (color: Theme) => {
  if (color === 'light') return theme.defaultAlgorithm;
  return theme.darkAlgorithm;
};

const consumePacket = async (
  bt: BluetoothHookState,
  serial: Pax.lib.PaxSerial,
): Promise<Pax.api.models.GetResponse> => {
  if (!bt.server) {
    throw new Error('No server found');
  }

  const service = await bt.server.getPrimaryService(
    PaxBluetoothServices.MainService,
  );
  const toggleCharacteristic = await service?.getCharacteristic(
    PaxBluetoothCharacteristics.ReadAndWrite,
  );
  const currentValue = await toggleCharacteristic?.readValue();
  const dec_message = Pax.api.get(
    new Pax.lib.PaxEncryptedPacket(currentValue.buffer),
    serial,
  );
  return dec_message;
};

function App() {
  const { state, dispatch } = useAppContext();
  const deviceStore = useDevicesLocalStorage();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const bluetoothState = useBluetooth(Pax.lib.Devices.PAX3);

  const handleUpdateOnInterval = async (bluetoothState: BluetoothHookState) => {
    if (deviceStore.currentDevice === undefined || !bluetoothState.connected) {
      return;
    }

    const response = await consumePacket(
      bluetoothState,
      deviceStore.currentDevice,
    );

    if (response.message instanceof Pax.lib.messages.ActualTemperatureMessage) {
      dispatch({
        type: 'SET_ACTUAL_TEMPERATURE',
        payload: response.message.temperature,
      });
    }
    if (response.message instanceof Pax.lib.messages.HeaterSetPointMessage) {
      setHeaterSetPointTemperature(dispatch, response.message.temperature);
    }
  };

  // useInterval({
  //   callback: () => handleUpdateOnInterval(bluetoothState),
  //   delay: 1000,
  //   disabled: !bluetoothState.connected,
  // });

  useEffect(() => {
    if (bluetoothState.connected) {
      // add event listener to consume notifications
      // this is needed because new info to read will only
      // be broadcasted once a new Notification is consumed
      bluetoothState.addCharacteristicListener(
        PaxBluetoothCharacteristics.Notifications,
        () => {
          handleUpdateOnInterval(bluetoothState);
          // console.log('Characteristic value changed:', event);
        },
      );
    }
  }, [bluetoothState]);

  return (
    <ConfigProvider theme={{ algorithm: getTheme(state.pageTheme) }}>
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
