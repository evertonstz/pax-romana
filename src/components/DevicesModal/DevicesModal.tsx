import { useWindowSize } from '@uidotdev/usehooks';
import { Button, Col, Drawer, Input, Modal, Row, Select, Space } from 'antd';
import { useState } from 'react';

import { useDevicesLocalStorage } from '../../hooks';
import { Pax } from '../../pax';
import DeviceCard from './DeviceCard';
import NoDevices from './NoDevices';

const SERIAL_SIZE = 8;
const INPUT_PLACEHOLDER = `Insert device's ${SERIAL_SIZE} digit serial`;

const buildOptions = (devices: Pax.lib.Devices[]) => {
  return devices.map(device => {
    return { value: device, label: device };
  });
};

interface DevicesModalProps {
  open: boolean;
  devices: Pax.lib.Devices[];
  defaultDevice: Pax.lib.Devices;
  onCancel: (
    e: React.MouseEvent<Element, MouseEvent> | React.KeyboardEvent<Element>,
  ) => void;
}

const DevicesModal = ({
  open,
  devices,
  defaultDevice,
  onCancel,
}: DevicesModalProps) => {
  const { width } = useWindowSize();
  const isSmallScreen = !width ? false : width < 550;
  const deviceStore = useDevicesLocalStorage();

  const [serialInput, setSerialInput] = useState<string | undefined>(undefined);
  const [selectedDevice, setSelectedDevice] =
    useState<Pax.lib.Devices>(defaultDevice);

  const handleAddNewDeviceButton = () => {
    if (serialInput) {
      const serialClass = new Pax.lib.PaxSerial(serialInput, selectedDevice);
      if (!deviceStore.inStore(serialClass)) {
        deviceStore.appendStore(serialClass);
        setSerialInput(undefined);
        return;
      }
    }
  };

  const addNewDeviceButtonDisabled = () => {
    if (serialInput?.length !== SERIAL_SIZE) {
      return true;
    }
    return false;
  };

  const renderCards = () => {
    return deviceStore.store.map(serial => {
      return (
        <Col key={serial.serial} xs={24} sm={12}>
          <DeviceCard serial={serial}></DeviceCard>
        </Col>
      );
    });
  };

  const renderContent = () => {
    return (
      <Row
        gutter={[16, 16]}
        justify="center"
        align="middle"
        style={{ minHeight: '155px' }}
      >
        {deviceStore.store.length === 0 ? <NoDevices /> : renderCards()}
      </Row>
    );
  };

  const renderFooter = () => {
    return (
      <Row justify="center">
        <Space.Compact style={{ width: '100%' }}>
          <Select
            defaultValue={defaultDevice}
            options={buildOptions(devices)}
            onChange={value => {
              setSelectedDevice(value);
            }}
          />
          <Input
            count={{
              show: true,
              max: SERIAL_SIZE,
              exceedFormatter: (txt, { max }) => txt.slice(0, max),
            }}
            value={serialInput}
            placeholder={INPUT_PLACEHOLDER}
            onChange={e => setSerialInput(e.target.value.toUpperCase())}
          />
          <Button
            type="primary"
            disabled={addNewDeviceButtonDisabled()}
            onClick={handleAddNewDeviceButton}
          >
            Add Device
          </Button>
        </Space.Compact>
      </Row>
    );
  };

  if (isSmallScreen) {
    return (
      <Drawer
        title={'Your Pax Romana devices'}
        height={'100vh'}
        visible={open}
        onClose={onCancel}
        placement="bottom"
        footer={renderFooter()}
      >
        {renderContent()}
      </Drawer>
    );
  }

  return (
    <Modal
      open={open}
      footer={renderFooter()}
      title={'Your Pax Romana devices'}
      onCancel={onCancel}
    >
      {renderContent()}
    </Modal>
  );
};

export { DevicesModal };
