import { Modal } from '@/components';
import { useDevicesLocalStorage } from '@/hooks';
import { Pax } from '@/pax';
import { TriangleAlert } from 'lucide-react';
import { useState } from 'react';

import AddDeviceFooter from '../AddDeviceFooter';
import DeviceCard from './DeviceCard';
import { SUPPORTED_DEVICES } from './constants';

export interface DevicesModalProps {
  open: boolean;
  onOpenChange: () => void;
}

const DevicesModal = ({ open, onOpenChange }: DevicesModalProps) => {
  const [serialInput, setSerialInput] = useState<string | undefined>(undefined);
  const defaultDevice = SUPPORTED_DEVICES[0];
  const [deviceValue, setDeviceValue] =
    useState<Pax.lib.Devices>(defaultDevice);
  const deviceStore = useDevicesLocalStorage();

  const renderCards = () => {
    return deviceStore.store.map(serial => {
      return <DeviceCard key={serial.serial} serial={serial}></DeviceCard>;
    });
  };

  const renderContent = () => {
    return (
      <div className="grid min-h-[175px] grid-cols-1 gap-5 md:grid-cols-2">
        {deviceStore.store.length === 0 ? (
          <div className="flex justify-center">
            <TriangleAlert size={175} opacity={0.3} />
          </div>
        ) : (
          renderCards()
        )}
      </div>
    );
  };

  const renderFooter = () => {
    return (
      <AddDeviceFooter
        serialInput={serialInput}
        setSerialInput={setSerialInput}
        deviceValue={deviceValue}
        setDeviceValue={setDeviceValue}
      />
    );
  };

  return (
    <Modal
      title={'Your Pax Romana devices'}
      open={open}
      onOpenChange={onOpenChange}
      footer={renderFooter()}
    >
      {renderContent()}
    </Modal>
  );
};

export { DevicesModal };
