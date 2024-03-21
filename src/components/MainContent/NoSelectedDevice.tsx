import { useIsMobile } from '@/hooks';
import { useState } from 'react';

import AddDeviceFooter from '../AddDeviceFooter';
import { PaxPairing } from '../Graphics';

export const NoSelectedDevice = () => {
  const isMobile = useIsMobile();
  const [isInputOnFocus, setIsInputOnFocus] = useState(false);
  return (
    <div className="mx-auto flex flex-col gap-6 self-center">
      <PaxPairing
        parallax={!isMobile}
        pulsatingLightSpeed={isInputOnFocus ? 'fast' : 'slow'}
      />
      <AddDeviceFooter
        onFocus={() => setIsInputOnFocus(true)}
        onBlur={() => setIsInputOnFocus(false)}
      />
    </div>
  );
};
