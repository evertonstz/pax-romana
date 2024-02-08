import { useLocalStorage } from '@uidotdev/usehooks';

import { Pax } from '../pax';

const CURRENT_DEVICE_STORE_NAME = 'currentDevice';

interface CurrentDeviceHookType {
  currentDevice?: Pax.lib.PaxSerial;
  saveCurrentDevice: React.Dispatch<
    React.SetStateAction<Pax.lib.PaxSerial | undefined>
  >;
}

const useCurrentDevice = (): CurrentDeviceHookType => {
  const [currentDevice, saveCurrentDevice] = useLocalStorage<
    Pax.lib.PaxSerial | undefined
  >(CURRENT_DEVICE_STORE_NAME, undefined);
  return { currentDevice, saveCurrentDevice };
};

export { useCurrentDevice };
