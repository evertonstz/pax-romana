import { useDevicesLocalStorage } from '@/hooks';
import { Pax } from '@/pax';
import { useLocalStorage } from '@uidotdev/usehooks';
import { BluetoothIcon, EarthIcon, PcCase } from 'lucide-react';
import { useState } from 'react';
import {
  isChrome,
  isChromium,
  isEdgeChromium,
  isMacOs,
} from 'react-device-detect';

import DevicesModal from '../DevicesModal';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Button } from '../ui/button';
import { NoSelectedDevice } from './NoSelectedDevice';
import ResizableSquare from './ResizableSquare';
import { SelectedDevice } from './SelectedDevice';

const MainContent = () => {
  const [isDeviceModalOpen, openDevicesModal] = useState(false);
  const deviceStore = useDevicesLocalStorage();
  const [seenOsPsa, setSeenOsPsa] = useLocalStorage('seenOsPsa', false);

  const renderDevicesContent = (
    currentDevice: Pax.lib.PaxSerial | undefined,
  ) => {
    if (!isMacOs && !seenOsPsa) {
      return (
        <div className="mx-auto place-content-center space-y-4">
          <div className="flex justify-center">
            <PcCase size={175} opacity={0.3} />
          </div>
          <div className="flex justify-center">
            <Alert className="mx-4 md:w-2/3">
              <BluetoothIcon className="h-4 w-4" />
              <AlertTitle>Partially supported</AlertTitle>
              <AlertDescription className="flex flex-col">
                Attention, this operating system only supports readonly messages
                with pax devices, this means you can&#39;t change anything on
                your pax, like changing temperature, color theme or brightness.
                <Button
                  onClick={() => setSeenOsPsa(true)}
                  className="w-20 self-end"
                >
                  Close
                </Button>
              </AlertDescription>
            </Alert>
          </div>
        </div>
      );
    }

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
