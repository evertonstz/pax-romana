import { useDevicesLocalStorage } from '@/hooks';
import { Pax } from '@/pax';
import { Check } from 'lucide-react';

import { Button } from '../ui/button';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/card';

interface DeviceCardProps {
  serial: Pax.lib.PaxSerial;
}

const DeviceCard = ({ serial }: DeviceCardProps) => {
  const { popFromStore, saveCurrentDevice, currentDevice } =
    useDevicesLocalStorage();

  const selectButtonDisabled =
    currentDevice !== undefined &&
    currentDevice.device === serial.device &&
    currentDevice.serial === serial.serial;

  return (
    <Card className="grid min-w-[200px] grid-cols-2 md:grid-cols-1">
      <CardHeader>
        <CardTitle>{serial.serial}</CardTitle>
        <CardDescription className="text-xl">{serial.device}</CardDescription>
      </CardHeader>
      <CardFooter
        className={
          'grid grid-cols-1 content-between gap-2 p-6 md:grid-cols-2 md:pt-0'
        }
      >
        <Button
          disabled={selectButtonDisabled}
          onClick={() => saveCurrentDevice(serial)}
        >
          {selectButtonDisabled ? <Check /> : 'Select'}
        </Button>
        <Button onClick={() => popFromStore(serial)} variant={'destructive'}>
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DeviceCard;
