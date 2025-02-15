import { useDevicesLocalStorage } from '@/hooks';
import { Pax } from '@/pax';

import { SUPPORTED_DEVICES } from '../DevicesModal/constants';
import { Button } from '../ui/button';
import DeviceButton from './DeviceButton';
import SerialInput from './SerialInput';

const SERIAL_SIZE = 8;
const INPUT_PLACEHOLDER = `Insert ${SERIAL_SIZE} digits serial`;

interface Props {
  onFocus?: React.FocusEventHandler<HTMLInputElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  serialInput?: string;
  setSerialInput: React.Dispatch<React.SetStateAction<string | undefined>>;
  deviceValue: Pax.lib.Devices;
  setDeviceValue: React.Dispatch<React.SetStateAction<Pax.lib.Devices>>;
}

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

const AddDeviceFooter = (props: Props) => {
  const { serialInput, setSerialInput, deviceValue, setDeviceValue } = props;

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
            onFocus={props.onFocus}
            onBlur={props.onBlur}
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
