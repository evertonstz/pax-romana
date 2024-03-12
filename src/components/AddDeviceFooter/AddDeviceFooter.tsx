import { useDevicesLocalStorage } from '@/hooks';
import { Pax } from '@/pax';
import { useState } from 'react';

import { SUPPORTED_DEVICES } from '../DevicesModal/constants';
import { Button } from '../ui/button';
import DeviceButton from './DeviceButton';
import SerialInput from './SerialInput';

const SERIAL_SIZE = 8;
const INPUT_PLACEHOLDER = `Insert ${SERIAL_SIZE} digits serial`;

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
  const [deviceValue, setDeviceValue] =
    useState<Pax.lib.Devices>(defaultDevice);

  const deviceStore = useDevicesLocalStorage();

  const handleAddNewDeviceButton = () => {
    if (serialInput) {
      const serialClass = new Pax.lib.PaxSerial(serialInput, deviceValue);
      if (!deviceStore.inStore(serialClass)) {
        deviceStore.appendStore(serialClass);
        setSerialInput(undefined);
        return;
      }
    }
  };

  return (
    <>
      <div className="flex grow gap-0">
        <DeviceButton
          value={deviceValue}
          options={buildOptions(SUPPORTED_DEVICES)}
          onValueChange={setDeviceValue as (value: string) => void}
        />
        <div className="grow">
          <SerialInput
            max={SERIAL_SIZE}
            value={serialInput}
            onValueChange={setSerialInput}
            placeholder={INPUT_PLACEHOLDER}
          />
        </div>
        <Button
          className="rounded-l-none border-l-0"
          variant={'outline'}
          onClick={handleAddNewDeviceButton}
          disabled={addNewDeviceButtonDisabled(serialInput)}
        >
          Add Device
        </Button>
      </div>
    </>
  );
};

export default AddDeviceFooter;
