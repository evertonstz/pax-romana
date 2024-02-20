import { Pax } from '@/pax';
import { useCallback } from 'react';

import { PaxBluetoothCharacteristics } from './enums/PaxBluetoothCharacteristics';
import { PaxBluetoothServices } from './enums/PaxBluetoothServices';
import useBluetooth from './useBluetooth';

export interface UsePaxBluetoothServicesState {
  connected: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
  eventListener: {
    startListening: (callback: (event: Event) => void) => Promise<void>;
    isListenerAdded: boolean;
  };
  readFromMainService: () => Promise<Pax.lib.messages.MessageAbs>;
  writeToMainService: (message: Pax.lib.PaxEncryptedPacket) => Promise<void>;
}

export const usePaxBluetoothServices = (
  serial: Pax.lib.PaxSerial,
): UsePaxBluetoothServicesState => {
  const {
    connected,
    connect,
    disconnect,
    isListenerAdded,
    readFromCharacteristic,
    addCharacteristicListener,
    writeToCharacteristic,
  } = useBluetooth(
    serial.device,
    PaxBluetoothServices.MainService,
    Object.values(PaxBluetoothServices),
  );

  const startListening = useCallback(
    (callback: (event: Event) => void): Promise<void> => {
      if (!connected) return Promise.reject('Not connected');
      if (isListenerAdded) return Promise.reject('Listener already added');

      return addCharacteristicListener(
        PaxBluetoothCharacteristics.Notifications,
        callback,
      );
    },
    [addCharacteristicListener, connected, isListenerAdded],
  );

  const readFromMainService =
    useCallback(async (): Promise<Pax.lib.messages.MessageAbs> => {
      return readFromCharacteristic(
        PaxBluetoothServices.MainService,
        PaxBluetoothCharacteristics.Read,
      ).then(response => {
        const decodedMessage = Pax.api.get(
          new Pax.lib.PaxEncryptedPacket(response.buffer),
          serial,
        );
        return decodedMessage.message;
      });
    }, [readFromCharacteristic, serial]);

  const writeToMainService = useCallback(
    async (packet: Pax.lib.PaxEncryptedPacket): Promise<void> => {
      return writeToCharacteristic(
        PaxBluetoothServices.MainService,
        PaxBluetoothCharacteristics.Write,
        packet,
      );
    },
    [writeToCharacteristic],
  );

  return {
    connect,
    disconnect,
    connected,
    eventListener: {
      startListening,
      isListenerAdded,
    },
    readFromMainService,
    writeToMainService,
  };
};
