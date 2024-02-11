import { Pax } from '@/pax';
import { useLocalStorage } from '@uidotdev/usehooks';
import { useCallback, useEffect } from 'react';

import useCurrentDevice from './useCurrentDevice';

export const useDevicesLocalStorage = () => {
  const [store, saveStore] = useLocalStorage<Pax.lib.PaxSerial[]>(
    'devicesSerials',
    [],
  );
  const { currentDevice, saveCurrentDevice } = useCurrentDevice();

  const appendStore = (serial: Pax.lib.PaxSerial): void => {
    if (!inStore(serial)) {
      const newStore: Pax.lib.PaxSerial[] = [...store, serial];
      saveStore(newStore);
      if (!currentDevice) {
        saveCurrentDevice(serial);
      }
    }
  };

  const inStore = useCallback(
    (serial: Pax.lib.PaxSerial): boolean => {
      const existingInstance = store.find(
        foundDevice =>
          foundDevice.device === serial.device &&
          foundDevice.serial === serial.serial,
      );
      if (!existingInstance) {
        return false;
      }
      return true;
    },
    [store],
  );

  const popFromStore = (serial: Pax.lib.PaxSerial): void => {
    const index = store.findIndex(
      foundDevice =>
        foundDevice.device === serial.device &&
        foundDevice.serial === serial.serial,
    );

    if (index !== -1) {
      const newStore = [...store.slice(0, index), ...store.slice(index + 1)];
      saveStore(newStore);
    }
  };

  useEffect(() => {
    if (currentDevice !== undefined && !inStore(currentDevice)) {
      // removes current device in case it gets deleted from store
      saveCurrentDevice(undefined);
    }

    if (store.length === 1 && !currentDevice) {
      // sets the only available device as current device
      saveCurrentDevice(store[0]);
    }
  }, [store, currentDevice, inStore, saveCurrentDevice]);

  return {
    store,
    saveStore,
    appendStore,
    inStore,
    popFromStore,
    currentDevice,
    saveCurrentDevice,
  };
};
