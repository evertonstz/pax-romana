import { useDevicesLocalStorage } from '@/hooks';
import { Pax } from '@/pax';
import { useState } from 'react';

import DevicesModal from '../DevicesModal';
import { NoSelectedDevice } from './NoSelectedDevice';
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
        onClose={() => openDevicesModal(false)}
      />
      {renderDevicesContent(deviceStore.currentDevice)}
    </>
  );
};

export default MainContent;
