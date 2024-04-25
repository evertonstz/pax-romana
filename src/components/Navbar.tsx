import { useDevicesLocalStorage, useIsMobile } from '@/hooks';
import { Cloudy } from 'lucide-react';
import { useState } from 'react';

import { ThemeDropdownButton } from '.';
import { BatteryIndicator } from './BatteryIndicator';
import DevicesModal from './DevicesModal';
import { Button } from './ui/button';

const Navbar = () => {
  const isMobile = useIsMobile();
  const [isDeviceModalOpen, openDevicesModal] = useState(false);
  const deviceStore = useDevicesLocalStorage();

  return (
    <>
      <DevicesModal
        open={isDeviceModalOpen}
        onOpenChange={openDevicesModal as () => void}
      />
      <div
        className="mx-auto flex h-16 w-screen items-center border-b 
        border-neutral-300 bg-white px-6 dark:border-neutral-800 dark:bg-black"
      >
        <div className="flex items-center gap-3">
          <Cloudy size={40} />
          <h1 className="select-none scroll-m-20 font-extrabold tracking-tight md:text-4xl">
            Pax Romana
          </h1>
        </div>
        <div className="flex-grow bg-white"></div>
        <div className="flex gap-3">
          <Button
            variant={deviceStore.currentDevice ? 'secondary' : 'default'}
            onClick={openDevicesModal as () => void}
          >
            {deviceStore.currentDevice ? (
              <div className="flex flex-row place-items-center gap-3">
                <BatteryIndicator />
                {isMobile ? null : deviceStore.currentDevice.serial}
              </div>
            ) : (
              'Devices'
            )}
          </Button>
          <ThemeDropdownButton />
        </div>
      </div>
    </>
  );
};

export default Navbar;
