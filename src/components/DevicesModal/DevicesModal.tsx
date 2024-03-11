import { Modal } from '@/components';
import { useDevicesLocalStorage } from '@/hooks';
import { WarningFilled } from '@ant-design/icons';

import AddDeviceFooter from '../AddDeviceFooter';
import DeviceCard from './DeviceCard';

export interface DevicesModalProps {
  open: boolean;
  onOpenChange: () => void;
}

const DevicesModal = ({ open, onOpenChange }: DevicesModalProps) => {
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
          <WarningFilled style={{ fontSize: '64px', opacity: 0.3 }} />
        ) : (
          renderCards()
        )}
      </div>
    );
  };

  const renderFooter = () => {
    return <AddDeviceFooter />;
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
