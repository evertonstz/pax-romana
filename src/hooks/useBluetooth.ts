import { useCallback, useEffect, useState } from 'react';

import { PaxBluetoothServices } from '../enums/PaxBluetoothServices';
import { Pax } from '../pax';
import { BluetoothHookState } from './types';

export const useBluetooth = (device: Pax.lib.Devices): BluetoothHookState => {
  const [server, setServer] = useState<BluetoothRemoteGATTServer | undefined>(
    undefined,
  );
  const [connected, setConnected] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>(undefined);
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
        setError(undefined);

        // Listen for the disconnect event
        btDevice.addEventListener('gattserverdisconnected', () => {
          setConnected(false);
          setServer(undefined);
          setError('Disconnected from Bluetooth server');
        });
      }
    } catch (err) {
      console.error('Error connecting to Bluetooth device:', err);
      setConnected(false);
      setError('Error connecting to Bluetooth device');
    }
  };

  const addCharacteristicListener = useCallback(
    async (characteristicUUID: string, callback: (event: Event) => void) => {
      if (server && !isListenerAdded) {
        try {
          const service = await server.getPrimaryService(
            PaxBluetoothServices.MainService,
          );
          const characteristic =
            await service.getCharacteristic(characteristicUUID);

          // characteristic.addEventListener('characteristicvaluechanged', callback);
          characteristic
            .startNotifications()
            .then(characteristic =>
              characteristic.addEventListener(
                'characteristicvaluechanged',
                callback,
              ),
            );

          setIsListenerAdded(true); // Set listener status to true after successful addition
        } catch (error) {
          console.error('Error getting service/characteristic:', error);
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
