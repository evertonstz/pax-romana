import { useDevicesLocalStorage } from '@/hooks';
import { Pax } from '@/pax';
import { useState } from 'react';

import DevicesModal from '../DevicesModal';
import { NoSelectedDevice } from './NoSelectedDevice';
import ResizableSquare from './ResizableSquare';
import { SelectedDevice } from './SelectedDevice';

const MainContent = () => {
  const [isDeviceModalOpen, openDevicesModal] = useState(false);
  const deviceStore = useDevicesLocalStorage();

  const renderDevicesContent = (
    currentDevice: Pax.lib.PaxSerial | undefined,
  ) => {
    return !currentDevice ? (
      <NoSelectedDevice />
    ) : (
      <SelectedDevice
        currentDevice={currentDevice}
        openDevicesModal={() => openDevicesModal(true)}
      />
    );
  };

  return (
    <>
      <DevicesModal
        open={isDeviceModalOpen}
        onOpenChange={openDevicesModal as () => void}
      />
      <ResizableSquare>
        {renderDevicesContent(deviceStore.currentDevice)}
      </ResizableSquare>
    </>
  );
};

export default MainContent;
