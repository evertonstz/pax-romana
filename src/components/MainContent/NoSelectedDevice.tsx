import { useIsMobile } from '@/hooks';
import { Pax } from '@/pax';
import { Terminal } from 'lucide-react';
import { useState } from 'react';

import AddDeviceFooter from '../AddDeviceFooter';
import { SUPPORTED_DEVICES } from '../DevicesModal/constants';
import { PaxAddSerial } from '../Graphics';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

export const NoSelectedDevice = () => {
  const isMobile = useIsMobile();
  const [serialInput, setSerialInput] = useState<string | undefined>(undefined);
  const defaultDevice = SUPPORTED_DEVICES[0];
  const [deviceValue, setDeviceValue] =
    useState<Pax.lib.Devices>(defaultDevice);
  return (
    <div className="flex flex-col gap-6 self-center">
      <PaxAddSerial
        parallax={!isMobile}
        serial={{ serial: serialInput, device: deviceValue }}
      />
      <AddDeviceFooter
        serialInput={serialInput}
        setSerialInput={setSerialInput}
        deviceValue={deviceValue}
        setDeviceValue={setDeviceValue}
      />
      <Alert>
        <Terminal className="h-4 w-4" />
        <AlertTitle>Heads up!</AlertTitle>
        <AlertDescription>
          Make sure to add the correct serial from the back of your device.
        </AlertDescription>
      </Alert>
    </div>
  );
};
