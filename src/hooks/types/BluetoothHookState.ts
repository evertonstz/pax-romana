export interface BluetoothHookState {
  server?: BluetoothRemoteGATTServer;
  connected: boolean;
  error?: string; // Todo return error class
  connect: () => void;
  disconnect: () => void;
  addCharacteristicListener: (
    characteristicUUID: string,
    callback: (event: Event) => void,
  ) => void;
}
