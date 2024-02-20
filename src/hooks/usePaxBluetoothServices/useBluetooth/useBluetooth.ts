import { useCallback, useEffect, useState } from 'react';

import {
  BluetoothAbortException,
  BluetoothAdapterNotFoundException,
  BluetoothNetworkException,
  BluetoothNotAllowedException,
  BluetoothNotSupportedException,
  BluetoothSecurityException,
  BluetoothUnknownException,
} from './exceptions';

export interface Error {
  isError: boolean;
  message?: string;
}

export interface BluetoothHookState {
  server?: BluetoothRemoteGATTServer;
  connected: boolean;
  isListenerAdded: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
  addCharacteristicListener: (
    characteristicUUID: string,
    callback: (event: Event) => void,
  ) => Promise<void>;
  readFromCharacteristic: (
    serviceUUID: string,
    characteristicUUID: string,
  ) => Promise<DataView>;
  writeToCharacteristic: (
    serviceUUID: string,
    characteristicUUID: string,
    value: DataView,
  ) => Promise<void>;
}

const parseErrors = (error: unknown): void => {
  if (error instanceof Error) {
    if (error.message === 'GATT operation failed for unknown reason.') {
      throw new BluetoothUnknownException(error.message);
    }
    if (error.message === 'User cancelled the requestDevice() chooser.') {
      throw new BluetoothAbortException(error.message);
    }

    switch (error.name) {
      case 'NotFoundError':
        throw new BluetoothAdapterNotFoundException(error.message);
      case 'NetworkError':
        throw new BluetoothNetworkException(error.message);
      case 'SecurityError':
        throw new BluetoothSecurityException(error.message);
      case 'NotAllowedError':
        throw new BluetoothNotAllowedException(error.message);
      case 'AbortError':
        throw new BluetoothAbortException(error.message);
      case 'NotSupportedError':
        throw new BluetoothNotSupportedException(error.message);
      default:
        throw new BluetoothUnknownException(error.message);
    }
  }
};

const useBluetooth = (
  device: string,
  primaryService: string,
  optionalServices: string[],
): BluetoothHookState => {
  const [server, setServer] = useState<BluetoothRemoteGATTServer | undefined>(
    undefined,
  );
  const [connected, setConnected] = useState<boolean>(false);

  const [isListenerAdded, setIsListenerAdded] = useState<boolean>(false);

  const connect = async () => {
    try {
      const btDevice = await navigator.bluetooth.requestDevice({
        filters: [
          {
            namePrefix: device,
          },
        ],
        optionalServices: optionalServices,
      });

      const server = await btDevice.gatt?.connect();

      if (server) {
        setServer(server);
        setConnected(true);

        // Listen for the disconnect event
        btDevice.addEventListener('gattserverdisconnected', () => {
          setConnected(false);
          setServer(undefined);
          setIsListenerAdded(false);
        });
      }
    } catch (error) {
      setConnected(false);
      parseErrors(error);
    }
  };

  const addCharacteristicListener = useCallback(
    async (characteristicUUID: string, callback: (event: Event) => void) => {
      if (!connected) throw new Error('Device is not connected');

      if (server && !isListenerAdded) {
        try {
          const service = await server.getPrimaryService(primaryService);
          const characteristic =
            await service.getCharacteristic(characteristicUUID);

          const toNotify = await characteristic.startNotifications();
          toNotify.addEventListener('characteristicvaluechanged', callback),
            setIsListenerAdded(true);
        } catch (error) {
          parseErrors(error);
        }
      }
    },
    [connected, server, isListenerAdded, primaryService],
  );

  const readFromCharacteristic = useCallback(
    async (
      serviceUUID: string,
      characteristicUUID: string,
    ): Promise<DataView> => {
      if (!connected || !server) throw new Error('Device is not connected');

      try {
        const service = await server.getPrimaryService(serviceUUID);
        const characteristic =
          await service?.getCharacteristic(characteristicUUID);
        const result = await characteristic?.readValue();
        return result;
      } catch (error) {
        parseErrors(error);
        throw new BluetoothUnknownException(String(error));
      }
    },
    [connected, server],
  );

  const writeToCharacteristic = useCallback(
    async (
      serviceUUID: string,
      characteristicUUID: string,
      value: DataView,
    ): Promise<void> => {
      if (!connected || !server) throw new Error('Device is not connected');

      try {
        const service = await server.getPrimaryService(serviceUUID);
        const characteristic =
          await service.getCharacteristic(characteristicUUID);
        // use writeValueWithoutResponse instead
        await characteristic.writeValueWithoutResponse(value.buffer);
        // await characteristic.writeValue(value);
      } catch (error) {
        parseErrors(error);
        throw new BluetoothUnknownException(String(error));
      }
    },
    [connected, server],
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
    connect,
    disconnect,
    addCharacteristicListener,
    isListenerAdded,
    readFromCharacteristic,
    writeToCharacteristic,
  };
};

export default useBluetooth;
