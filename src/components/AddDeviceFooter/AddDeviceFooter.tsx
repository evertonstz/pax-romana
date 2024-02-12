import { useDevicesLocalStorage } from '@/hooks';
import { Pax } from '@/pax';
import { Button, Input, Select, Space } from 'antd';
import { useState } from 'react';

import { SUPPORTED_DEVICES } from '../DevicesModal/constants';

const SERIAL_SIZE = 8;
const INPUT_PLACEHOLDER = `Insert device's ${SERIAL_SIZE} digit serial`;

const buildOptions = (devices: Pax.lib.Devices[]) => {
  return devices.map(device => {
    return { value: device, label: device };
  });
};

const addNewDeviceButtonDisabled = (serialInput: string | undefined) => {
  if (serialInput?.length !== SERIAL_SIZE) {
    return true;
  }
  return false;
};

const AddDeviceFooter = () => {
  const defaultDevice = SUPPORTED_DEVICES[0];
  const [serialInput, setSerialInput] = useState<string | undefined>(undefined);
  const [selectedDevice, setSelectedDevice] =
    useState<Pax.lib.Devices>(defaultDevice);

  const deviceStore = useDevicesLocalStorage();

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
  // TODO add on enter key press to add new device
  return (
    <Space.Compact style={{ width: '100%' }}>
      <Select
        defaultValue={defaultDevice}
        options={buildOptions(SUPPORTED_DEVICES)}
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
        onPressEnter={handleAddNewDeviceButton}
      />
      <Button
        type="primary"
        disabled={addNewDeviceButtonDisabled(serialInput)}
        onClick={handleAddNewDeviceButton}
      >
        Add Device
      </Button>
    </Space.Compact>
  );
};

export default AddDeviceFooter;
