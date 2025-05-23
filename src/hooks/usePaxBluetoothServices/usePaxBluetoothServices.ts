import { Pax } from '@/pax';
import { useCallback, useMemo, useRef } from 'react'; 

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
  writeToMainService: (packet: Pax.lib.PaxEncryptedPacket) => Promise<void>;
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

  const pendingPacketsQueue = useMemo<Pax.lib.PaxEncryptedPacket[]>(
    () => [],
    [],
  );
  const isWritingRef = useRef<boolean>(false); 

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

  let writeToMainServiceQueue: () => Promise<void>;

  writeToMainServiceQueue = useCallback(async (): Promise<void> => {
    if (!pendingPacketsQueue.length || isWritingRef.current) {
      return;
    }

    isWritingRef.current = true;
    const packet = pendingPacketsQueue.shift();
    
    if (!packet) {
      isWritingRef.current = false; 
      return;
    }

    try {
      await writeToCharacteristic(
        PaxBluetoothServices.MainService,
        PaxBluetoothCharacteristics.Write,
        packet,
      );
    } catch (error) {
      console.error('Error writing to Pax device:', error);
    } finally {
      isWritingRef.current = false;
      if (pendingPacketsQueue.length > 0) {
        // Simpler recursive call, still async due to function signature
        // but avoids extra microtask from Promise.resolve().then()
        void writeToMainServiceQueue(); 
      }
    }
  }, [pendingPacketsQueue, writeToCharacteristic]);

  const writeToMainService = useCallback(
    async (packet: Pax.lib.PaxEncryptedPacket): Promise<void> => {
      pendingPacketsQueue.push(packet);
      if (!isWritingRef.current) {
        await writeToMainServiceQueue(); 
      }
    },
    [pendingPacketsQueue, writeToMainServiceQueue],
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
