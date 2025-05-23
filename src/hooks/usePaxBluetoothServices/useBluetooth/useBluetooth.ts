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
  // Using duck typing as instanceof Error seems unreliable in test environment
  if (error && typeof error === 'object' && 'message' in error && 'name' in error) {
    const errorLike = error as { name: string; message: string }; // Cast for easier access

    // Priority 1: Specific known messages that might override error.name classification
    if (errorLike.message === 'User cancelled the requestDevice() chooser.') {
      throw new BluetoothAbortException(errorLike.message);
    }
    if (errorLike.message === 'GATT operation failed for unknown reason.') {
      throw new BluetoothUnknownException(errorLike.message);
    }

    // Priority 2: Standard DOMException names using if/else if
    const errorName = errorLike.name;
    if (errorName === 'NotFoundError') {
      throw new BluetoothAdapterNotFoundException(errorLike.message);
    } else if (errorName === 'NetworkError') {
      throw new BluetoothNetworkException(errorLike.message);
    } else if (errorName === 'SecurityError') {
      throw new BluetoothSecurityException(errorLike.message);
    } else if (errorName === 'NotAllowedError') {
      throw new BluetoothNotAllowedException(errorLike.message);
    } else if (errorName === 'AbortError') {
      throw new BluetoothAbortException(errorLike.message);
    } else if (errorName === 'NotSupportedError') {
      throw new BluetoothNotSupportedException(errorLike.message);
    } else {
      // Fallback for other Error-like types not matching specific names or messages
      throw new BluetoothUnknownException(`Unhandled Error (${errorName}): ${errorLike.message}`);
    }
  } else {
    // Handle cases where the thrown 'error' is not Error-like
    throw new BluetoothUnknownException(String(error || 'Unknown non-Error object thrown'));
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

  const connect = async (): Promise<void> => {
    console.log('[useBluetooth] connect: Attempting to connect...');
    try {
      const btDevice = await navigator.bluetooth.requestDevice({
        filters: [
          {
            namePrefix: device,
          },
        ],
        optionalServices: optionalServices,
      });
      console.log('[useBluetooth] connect: Device requested.');

      const gattServer = await btDevice.gatt?.connect();
      console.log('[useBluetooth] connect: GATT server connected attempt.');

      if (gattServer) {
        console.log('[useBluetooth] connect: GATT server obtained. Setting state.');
        setServer(gattServer);
        setConnected(true);

        btDevice.addEventListener('gattserverdisconnected', () => {
          console.log('[useBluetooth] Event: gattserverdisconnected triggered!');
          setConnected(false);
          setServer(undefined);
          setIsListenerAdded(false);
        });
      } else {
        console.log('[useBluetooth] connect: No GATT server obtained.');
      }
    } catch (error) {
      console.error('[useBluetooth] connect: Error during connection.', error);
      setConnected(false);
      parseErrors(error); 
    }
  };

  const addCharacteristicListener = useCallback(
    async (characteristicUUID: string, callback: (event: Event) => void): Promise<void> => {
      console.log(`[useBluetooth] addCharacteristicListener: Called. Connected: ${connected}, Server: ${!!server}, ListenerAdded: ${isListenerAdded}`);
      if (!connected) {
        console.error('[useBluetooth] addCharacteristicListener: Not connected, throwing error.');
        throw new Error('Device is not connected');
      }

      if (server && !isListenerAdded) {
        console.log('[useBluetooth] addCharacteristicListener: Server exists and listener not yet added. Proceeding.');
        try {
          const service = await server.getPrimaryService(primaryService);
          const characteristic =
            await service.getCharacteristic(characteristicUUID);

          const toNotify = await characteristic.startNotifications();
          toNotify.addEventListener('characteristicvaluechanged', callback);
          setIsListenerAdded(true);
          console.log('[useBluetooth] addCharacteristicListener: Listener added successfully.');
          return; 
        } catch (error) {
          console.error('[useBluetooth] addCharacteristicListener: Error adding listener.', error);
          parseErrors(error);
        }
      } else {
        if (!server) console.log('[useBluetooth] addCharacteristicListener: Skipped, server is null.');
        if (isListenerAdded) console.log('[useBluetooth] addCharacteristicListener: Skipped, listener already added.');
      }
      // If execution reaches here due to conditions not met or error in try-catch that parseErrors didn't stop
      if (isListenerAdded) return; // Successfully no-op if listener was already added
      // Fallback if something unexpected happened and parseErrors didn't throw
      throw new Error("addCharacteristicListener: Could not add listener or unexpected state.");
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
        if (!result) {
          throw new BluetoothUnknownException('Read operation returned no value');
        }
        return result;
      } catch (error) {
        parseErrors(error); 
      }
      throw new Error("Internal Error: parseErrors did not throw in readFromCharacteristic.");
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
        await characteristic.writeValueWithoutResponse(value.buffer);
        return; 
      } catch (error) {
        parseErrors(error); 
      }
      throw new Error("Internal Error: parseErrors did not throw in writeToCharacteristic.");
    },
    [connected, server],
  );

  const disconnect = useCallback(() => {
    console.log('[useBluetooth] disconnect: Called.');
    if (server) {
      console.log('[useBluetooth] disconnect: Server found, disconnecting.');
      server.disconnect(); // This is the mockServer.disconnect()
      setServer(undefined);
      setConnected(false);
      setIsListenerAdded(false);
    } else {
      console.log('[useBluetooth] disconnect: No server to disconnect.');
    }
  }, [server]);

  useEffect(() => {
    console.log('[useBluetooth] useEffect: Running effect (setup/cleanup). Current server:', server ? 'defined' : 'undefined');
    // Cleanup on unmount
    return () => {
      console.log('[useBluetooth] useEffect: Cleanup function called. Current server in cleanup closure:', server ? 'defined' : 'undefined');
      disconnect();
    };
  }, [disconnect]); // `disconnect` changes when `server` changes.

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
