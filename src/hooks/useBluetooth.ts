import { useCallback, useEffect, useState } from 'react';

import { PaxBluetoothServices } from '../enums/PaxBluetoothServices';
import { Pax } from '../pax';

export type Error = { isError: boolean; message?: string };

export type BluetoothHookState = {
  server?: BluetoothRemoteGATTServer;
  connected: boolean;
  error: Error;
  connect: () => void;
  disconnect: () => void;
  addCharacteristicListener: (
    characteristicUUID: string,
    callback: (event: Event) => void,
  ) => void;
};

export const useBluetooth = (device: Pax.lib.Devices): BluetoothHookState => {
  const [server, setServer] = useState<BluetoothRemoteGATTServer | undefined>(
    undefined,
  );
  const [connected, setConnected] = useState<boolean>(false);

  const [error, setError] = useState<Error>({
    isError: false,
    message: undefined,
  });

  const [isListenerAdded, setIsListenerAdded] = useState<boolean>(false);

  const connect = async () => {
    try {
      const btDevice = await navigator.bluetooth.requestDevice({
        filters: [
          {
            namePrefix: device,
          },
        ],
        optionalServices: [PaxBluetoothServices.MainService],
      });

      const server = await btDevice.gatt?.connect();

      if (server) {
        setServer(server);
        setConnected(true);
        setError({ isError: false, message: undefined });

        // Listen for the disconnect event
        btDevice.addEventListener('gattserverdisconnected', () => {
          setConnected(false);
          setServer(undefined);
          setIsListenerAdded(false);
        });
      }
    } catch (error) {
      setConnected(false);
      setError({ isError: true, message: error as string });
    }
  };

  const addCharacteristicListener = useCallback(
    async (characteristicUUID: string, callback: (event: Event) => void) => {
      if (!connected) throw new Error('Device is not connected');

      if (server && !isListenerAdded) {
        try {
          const service = await server.getPrimaryService(
            PaxBluetoothServices.MainService,
          );
          const characteristic =
            await service.getCharacteristic(characteristicUUID);

          characteristic
            .startNotifications()
            .then(characteristic =>
              characteristic.addEventListener(
                'characteristicvaluechanged',
                callback,
              ),
            );
          setIsListenerAdded(true);
        } catch (error) {
          throw new Error(`Error getting service/characteristic: ${error}`);
        }
      }
    },
    [server, isListenerAdded],
  );

  const disconnect = useCallback(() => {
    if (server) {
      server.disconnect();
      setServer(undefined);
      setConnected(false);
      setIsListenerAdded(false);
    }
  }, [server]);

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    server,
    connected,
    error,
    connect,
    disconnect,
    addCharacteristicListener,
  };
};
