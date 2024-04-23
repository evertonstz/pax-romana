import { useDevicesLocalStorage } from '@/hooks';
import { Pax } from '@/pax';
import { EarthIcon } from 'lucide-react';
import { useState } from 'react';
import { isChrome, isChromium, isEdgeChromium } from 'react-device-detect';

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
    if (!(isChrome || isChromium || isEdgeChromium)) {
      return (
        <div className="mx-auto place-content-center">
          <div className="flex justify-center">
            <EarthIcon size={175} opacity={0.3} />
          </div>
          <h1>Unsupported browser, please use a chromium-based browser</h1>
        </div>
      );
    }
    return !currentDevice ? (
      <div className="mx-3 flex flex-grow justify-center">
        <NoSelectedDevice />
      </div>
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
