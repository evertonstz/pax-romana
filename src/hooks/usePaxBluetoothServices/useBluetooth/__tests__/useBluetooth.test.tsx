import { act, renderHook, waitFor } from '@testing-library/react'; // Added waitFor
import useBluetooth, {
  BluetoothHookState,
} from '../useBluetooth'; // Adjust path as necessary
import {
  BluetoothAbortException,
  BluetoothAdapterNotFoundException,
  BluetoothNetworkException,
  BluetoothNotAllowedException,
  BluetoothNotSupportedException,
  BluetoothSecurityException,
  BluetoothUnknownException,
} from '../exceptions'; // Adjust path for exceptions

// --- Mocks for Web Bluetooth API ---

// Store event listeners for manual triggering
let mockGattServerDisconnectedListener: (() => void) | null = null;
let mockCharacteristicValueChangedListener: ((event: Event) => void) | null = null;

// Mock Characteristic
const mockCharacteristic = {
  startNotifications: vi.fn(),
  stopNotifications: vi.fn(),
  readValue: vi.fn(),
  writeValueWithoutResponse: vi.fn(), // As used in the hook
  writeValueWithResponse: vi.fn(), // Alias for writeValue if needed
  writeValue: vi.fn(), // General writeValue
  addEventListener: vi.fn((type, listener) => {
    if (type === 'characteristicvaluechanged') {
      mockCharacteristicValueChangedListener = listener as (event: Event) => void;
    }
  }),
  removeEventListener: vi.fn((type, listener) => {
     if (type === 'characteristicvaluechanged' && mockCharacteristicValueChangedListener === listener) {
      mockCharacteristicValueChangedListener = null;
    }
  }),
  properties: {
    read: true,
    write: true,
    writeWithoutResponse: true,
    notify: true,
  } as BluetoothCharacteristicProperties, // Cast to the actual type
  uuid: '', // Will be set per instance if needed
  value: null as DataView | null, // Will be set per instance if needed
};

// Mock Service
const mockService = {
  getCharacteristic: vi.fn(),
  getCharacteristics: vi.fn(),
  uuid: '', // Will be set per instance if needed
};

// Mock Server
const mockServer = {
  connect: vi.fn(), // Note: gatt.connect is on device, this is server's own connect if any (not standard)
  disconnect: vi.fn(),
  getPrimaryService: vi.fn(),
  getPrimaryServices: vi.fn(),
  connected: false, // Mock internal state
};

// Mock Device
const mockDevice = {
  gatt: {
    connect: vi.fn(), // This is the key connect method
  },
  name: 'TestDevice',
  id: 'test-device-id',
  addEventListener: vi.fn((type, listener) => {
    if (type === 'gattserverdisconnected') {
      mockGattServerDisconnectedListener = listener as () => void;
    }
  }),
  removeEventListener: vi.fn((type, listener) => {
    if (type === 'gattserverdisconnected' && mockGattServerDisconnectedListener === listener) {
        mockGattServerDisconnectedListener = null;
    }
  }),
  watchingAdvertisements: false,
  watchAdvertisements: vi.fn(),
  unwatchAdvertisements: vi.fn(),
};

// Mock navigator.bluetooth
const mockRequestDevice = vi.fn();
const mockGetAvailability = vi.fn(() => Promise.resolve(true)); // Assume BT is available

vi.stubGlobal('navigator', {
  bluetooth: {
    requestDevice: mockRequestDevice,
    getAvailability: mockGetAvailability,
    // Add other navigator.bluetooth properties/methods if the hook uses them
  },
});

// Helper to reset all mocks before each test
const resetAllBluetoothMocks = () => {
  mockRequestDevice.mockReset();
  mockGetAvailability.mockReset(); // Reset if its behavior changes per test

  // Reset device mocks
  mockDevice.gatt.connect.mockReset();
  mockDevice.addEventListener.mockReset();
  mockDevice.removeEventListener.mockReset();
  mockGattServerDisconnectedListener = null;

  // Reset server mocks
  mockServer.disconnect.mockReset();
  mockServer.getPrimaryService.mockReset();
  mockServer.connected = false; // Reset mock internal state

  // Reset service mocks
  mockService.getCharacteristic.mockReset();

  // Reset characteristic mocks
  mockCharacteristic.startNotifications.mockReset();
  mockCharacteristic.readValue.mockReset();
  mockCharacteristic.writeValueWithoutResponse.mockReset();
  mockCharacteristic.addEventListener.mockReset();
  mockCharacteristic.removeEventListener.mockReset();
  mockCharacteristicValueChangedListener = null;
};

// --- Test Suite ---
describe('useBluetooth Hook', () => {
  const testDeviceName = 'PaxDevice';
  const testPrimaryServiceUUID = 'service1-uuid';
  const testOptionalServicesUUIDs = ['optional-service-uuid'];
  const testCharacteristicUUID = 'char1-uuid';

  beforeEach(() => {
    resetAllBluetoothMocks();
  });

  // Helper to simulate event dispatch
  const simulateGattServerDisconnected = () => {
    act(() => {
      if (mockGattServerDisconnectedListener) {
        mockGattServerDisconnectedListener();
      }
    });
  };

  const simulateCharacteristicValueChanged = (value: DataView) => {
    act(() => {
      if (mockCharacteristicValueChangedListener) {
        // Create a mock event object
        const mockEvent = { target: { value } } as unknown as Event;
        mockCharacteristicValueChangedListener(mockEvent);
      }
    });
  };

  describe('1. Connection Flow', () => {
    test('should connect successfully, set server and connected state', async () => {
      mockRequestDevice.mockResolvedValue(mockDevice);
      // Ensure gatt.connect resolves to our mockServer object
      // And simulate that the server is "connected" by setting its internal state
      mockDevice.gatt.connect.mockImplementation(async () => {
        mockServer.connected = true; // Simulate connection on the server
        return mockServer;
      });

      const { result } = renderHook(() =>
        useBluetooth(testDeviceName, testPrimaryServiceUUID, testOptionalServicesUUIDs),
      );

      await act(async () => {
        await result.current.connect();
      });

      expect(mockRequestDevice).toHaveBeenCalledWith({
        filters: [{ namePrefix: testDeviceName }],
        optionalServices: testOptionalServicesUUIDs,
      });
      expect(mockDevice.gatt.connect).toHaveBeenCalledTimes(1);
      expect(result.current.connected).toBe(true);
      expect(result.current.server).toBe(mockServer);
      expect(mockDevice.addEventListener).toHaveBeenCalledWith(
        'gattserverdisconnected',
        expect.any(Function),
      );
    });

    // Helper to create Error objects with a specific name property
    // Moved to top-level scope of the test file
  }); // End of "beforeEach" for the main describe block

  // Helper to create Error objects with a specific name property - MOVED TO TOP LEVEL
  const createMockError = (message: string, name: string): Error => {
    const error = new Error(message);
    error.name = name;
    return error;
  };

  describe('1. Connection Flow', () => { // Re-open describe for tests
    test('should handle user cancelling requestDevice (AbortError)', async () => {
      const abortError = createMockError('User cancelled the requestDevice() chooser.', 'AbortError');
      mockRequestDevice.mockRejectedValue(abortError);

      const { result } = renderHook(() =>
        useBluetooth(testDeviceName, testPrimaryServiceUUID, testOptionalServicesUUIDs),
      );

      await act(async () => {
        // Expect connect to throw the custom exception
        await expect(result.current.connect()).rejects.toThrow(BluetoothAbortException);
      });
      
      expect(result.current.connected).toBe(false);
      expect(result.current.server).toBeUndefined();
    });

    test('should handle no device found (NotFoundError from requestDevice)', async () => {
      const notFoundError = createMockError('No device found.', 'NotFoundError');
      mockRequestDevice.mockRejectedValue(notFoundError);
    
      const { result } = renderHook(() =>
        useBluetooth(testDeviceName, testPrimaryServiceUUID, testOptionalServicesUUIDs),
      );
    
      await act(async () => {
        await expect(result.current.connect()).rejects.toThrow(BluetoothAdapterNotFoundException);
      });
    
      expect(result.current.connected).toBe(false);
      expect(result.current.server).toBeUndefined();
    });

    test('should handle gatt.connect failure', async () => {
      mockRequestDevice.mockResolvedValue(mockDevice);
      const connectError = createMockError('GATT connect failed.', 'NetworkError');
      mockDevice.gatt.connect.mockRejectedValue(connectError);

      const { result } = renderHook(() =>
        useBluetooth(testDeviceName, testPrimaryServiceUUID, testOptionalServicesUUIDs),
      );

      await act(async () => {
        await expect(result.current.connect()).rejects.toThrow(BluetoothNetworkException);
      });

      expect(result.current.connected).toBe(false);
      expect(result.current.server).toBeUndefined();
    });
  });

  describe('2. Disconnection Flow', () => {
    beforeEach(async () => {
      // Setup a connected state for these tests
      mockRequestDevice.mockResolvedValue(mockDevice);
      mockDevice.gatt.connect.mockImplementation(async () => {
        mockServer.connected = true;
        return mockServer;
      });
    });

    test('disconnect() should disconnect server and update state', async () => {
      const { result, unmount } = renderHook(() => // get unmount
        useBluetooth(testDeviceName, testPrimaryServiceUUID, testOptionalServicesUUIDs),
      );
      // Connect first
      await act(async () => {
        await result.current.connect();
      });
      expect(result.current.connected).toBe(true);
      
      mockServer.disconnect.mockClear(); // Clear any calls during connect/setup phase if server.disconnect was called by old effects

      act(() => {
        result.current.disconnect(); // Explicit disconnect call from hook's returned function
      });

      // The explicit call to result.current.disconnect() should trigger mockServer.disconnect.
      // The useEffect cleanup will also attempt to call disconnect.
      // Depending on the exact timing and mock behavior, it might be called once or twice.
      // For robustness, let's check it was called at least once by the explicit action.
      expect(mockServer.disconnect).toHaveBeenCalled();
      // More importantly, check the state:
      expect(result.current.connected).toBe(false);
      expect(result.current.server).toBeUndefined();
      expect(result.current.isListenerAdded).toBe(false);
      
      act(() => {
        unmount(); // Trigger useEffect cleanup
      });
      // After unmount, the number of calls might increase due to cleanup.
      // If the server was already cleared by the explicit disconnect, cleanup's disconnect won't call mockServer.disconnect.
      // If server state update and effect cleanup are batched, it might be complex.
      // Sticking to toHaveBeenCalled() for the explicit action is safer.
    });

    test('gattserverdisconnected event should update state', async () => {
      const { result, rerender } = renderHook(() => 
        useBluetooth(testDeviceName, testPrimaryServiceUUID, testOptionalServicesUUIDs),
      );
      await act(async () => {
        await result.current.connect();
      });
      expect(result.current.connected).toBe(true); // Initial state after connect

      simulateGattServerDisconnected(); // This already uses act

      // Wait for assertions to pass, polling for state changes
      await waitFor(() => {
        expect(result.current.connected).toBe(false);
      });
      
      // Check other states after connected is confirmed false
      expect(result.current.server).toBeUndefined();
      expect(result.current.isListenerAdded).toBe(false);
    });
  });

  describe('3. addCharacteristicListener', () => {
    const listenerCallback = vi.fn();

    beforeEach(async () => {
      // Connect and setup server/service/characteristic for these tests
      mockRequestDevice.mockResolvedValue(mockDevice);
      mockDevice.gatt.connect.mockResolvedValue(mockServer);
      mockServer.getPrimaryService.mockResolvedValue(mockService);
      mockService.getCharacteristic.mockResolvedValue(mockCharacteristic);
      mockCharacteristic.startNotifications.mockResolvedValue(mockCharacteristic); // startNotifications returns itself
    });

    test('should add listener successfully when connected', async () => {
      const { result } = renderHook(() =>
        useBluetooth(testDeviceName, testPrimaryServiceUUID, testOptionalServicesUUIDs),
      );
      await act(async () => {
        await result.current.connect(); // Connect first
      });
      
      await act(async () => {
        await result.current.addCharacteristicListener(testCharacteristicUUID, listenerCallback);
      });

      expect(mockServer.getPrimaryService).toHaveBeenCalledWith(testPrimaryServiceUUID);
      expect(mockService.getCharacteristic).toHaveBeenCalledWith(testCharacteristicUUID);
      expect(mockCharacteristic.startNotifications).toHaveBeenCalledTimes(1);
      expect(mockCharacteristic.addEventListener).toHaveBeenCalledWith('characteristicvaluechanged', listenerCallback);
      expect(result.current.isListenerAdded).toBe(true);
    });

    test('should throw if not connected', async () => {
      const { result } = renderHook(() =>
        useBluetooth(testDeviceName, testPrimaryServiceUUID, testOptionalServicesUUIDs),
      );
      // DO NOT connect

      await act(async () => {
        await expect(
          result.current.addCharacteristicListener(testCharacteristicUUID, listenerCallback)
        ).rejects.toThrow('Device is not connected');
      });
       expect(result.current.isListenerAdded).toBe(false);
    });

    test('should not add listener if already added', async () => {
        const { result } = renderHook(() =>
          useBluetooth(testDeviceName, testPrimaryServiceUUID, testOptionalServicesUUIDs),
        );
        await act(async () => {
          await result.current.connect();
          await result.current.addCharacteristicListener(testCharacteristicUUID, listenerCallback);
        });
        expect(result.current.isListenerAdded).toBe(true);
        mockCharacteristic.startNotifications.mockClear(); 
        
        // Verify connection state robustly before attempting to add listener again
        await waitFor(() => {
          expect(result.current.connected).toBe(true);
          expect(result.current.isListenerAdded).toBe(true); 
        });
        
        rerender(); // Explicitly rerender to ensure result.current is fresh before next act

        // Attempt to add again
        await act(async () => {
          // This call should be a no-op because isListenerAdded is true,
          // so it shouldn't throw "Device is not connected".
          // If it throws "Device is not connected", then connected state was lost.
          await result.current.addCharacteristicListener(testCharacteristicUUID, listenerCallback);
        });
        expect(mockCharacteristic.startNotifications).not.toHaveBeenCalled(); 
      });

    test('should handle error during startNotifications', async () => {
        const notificationError = createMockError('Notification failed', 'NetworkError');
        mockCharacteristic.startNotifications.mockRejectedValue(notificationError);
        const { result } = renderHook(() =>
          useBluetooth(testDeviceName, testPrimaryServiceUUID, testOptionalServicesUUIDs),
        );
        await act(async () => {
          await result.current.connect();
        });
        // Ensure connected is true before attempting to add listener
        expect(result.current.connected).toBe(true);
  
        await act(async () => {
          // This should now reject with BluetoothNetworkException due to hook changes
          await expect(
            result.current.addCharacteristicListener(testCharacteristicUUID, listenerCallback)
          ).rejects.toThrow(BluetoothNetworkException); 
        });
        expect(result.current.isListenerAdded).toBe(false);
      });
  });

  describe('4. readFromCharacteristic', () => {
    const mockDataView = new DataView(new ArrayBuffer(2));
    mockDataView.setUint8(0, 42);

    beforeEach(async () => {
      mockRequestDevice.mockResolvedValue(mockDevice);
      mockDevice.gatt.connect.mockResolvedValue(mockServer);
      mockServer.getPrimaryService.mockResolvedValue(mockService); // Default service mock for reads
      mockService.getCharacteristic.mockResolvedValue(mockCharacteristic);
      mockCharacteristic.readValue.mockResolvedValue(mockDataView);
    });
    
    test('should read value successfully', async () => {
      const { result } = renderHook(() =>
        useBluetooth(testDeviceName, testPrimaryServiceUUID, testOptionalServicesUUIDs),
      );
      await act(async () => {
        await result.current.connect();
      });

      let readResult: DataView | undefined;
      await act(async () => {
        readResult = await result.current.readFromCharacteristic(testPrimaryServiceUUID, testCharacteristicUUID);
      });

      expect(mockServer.getPrimaryService).toHaveBeenCalledWith(testPrimaryServiceUUID);
      expect(mockService.getCharacteristic).toHaveBeenCalledWith(testCharacteristicUUID);
      expect(mockCharacteristic.readValue).toHaveBeenCalledTimes(1);
      expect(readResult).toEqual(mockDataView);
    });

    test('should throw if not connected', async () => {
        const { result } = renderHook(() =>
          useBluetooth(testDeviceName, testPrimaryServiceUUID, testOptionalServicesUUIDs),
        );
        // DO NOT connect
  
        await act(async () => {
          await expect(
            result.current.readFromCharacteristic(testPrimaryServiceUUID, testCharacteristicUUID)
          ).rejects.toThrow('Device is not connected');
        });
      });

    test('should handle read error (e.g., characteristic read fails)', async () => {
        const readError = createMockError('Read failed', 'NotAllowedError');
        mockCharacteristic.readValue.mockRejectedValue(readError);
        const { result } = renderHook(() =>
          useBluetooth(testDeviceName, testPrimaryServiceUUID, testOptionalServicesUUIDs),
        );
        await act(async () => {
          await result.current.connect();
        });
  
        await act(async () => {
          await expect(
            result.current.readFromCharacteristic(testPrimaryServiceUUID, testCharacteristicUUID)
          ).rejects.toThrow(BluetoothNotAllowedException); // parseErrors converts this
        });
      });
  });

  describe('5. writeToCharacteristic', () => {
    const valueToWrite = new DataView(new Uint8Array([1, 2, 3]).buffer);

    beforeEach(async () => {
        mockRequestDevice.mockResolvedValue(mockDevice);
        mockDevice.gatt.connect.mockResolvedValue(mockServer);
        mockServer.getPrimaryService.mockResolvedValue(mockService);
        mockService.getCharacteristic.mockResolvedValue(mockCharacteristic);
        mockCharacteristic.writeValueWithoutResponse.mockResolvedValue(undefined); // Resolves with void
      });

    test('should write value successfully', async () => {
      const { result } = renderHook(() =>
        useBluetooth(testDeviceName, testPrimaryServiceUUID, testOptionalServicesUUIDs),
      );
      await act(async () => {
        await result.current.connect();
      });

      await act(async () => {
        await result.current.writeToCharacteristic(testPrimaryServiceUUID, testCharacteristicUUID, valueToWrite);
      });

      expect(mockServer.getPrimaryService).toHaveBeenCalledWith(testPrimaryServiceUUID);
      expect(mockService.getCharacteristic).toHaveBeenCalledWith(testCharacteristicUUID);
      expect(mockCharacteristic.writeValueWithoutResponse).toHaveBeenCalledWith(valueToWrite.buffer);
      expect(mockCharacteristic.writeValueWithoutResponse).toHaveBeenCalledTimes(1);
    });
    
    test('should throw if not connected', async () => {
        const { result } = renderHook(() =>
          useBluetooth(testDeviceName, testPrimaryServiceUUID, testOptionalServicesUUIDs),
        );
        // DO NOT connect
  
        await act(async () => {
          await expect(
            result.current.writeToCharacteristic(testPrimaryServiceUUID, testCharacteristicUUID, valueToWrite)
          ).rejects.toThrow('Device is not connected');
        });
      });

    test('should handle write error', async () => {
        const writeError = createMockError('Write failed', 'SecurityError');
        mockCharacteristic.writeValueWithoutResponse.mockRejectedValue(writeError);
        const { result } = renderHook(() =>
          useBluetooth(testDeviceName, testPrimaryServiceUUID, testOptionalServicesUUIDs),
        );
        await act(async () => {
          await result.current.connect();
        });
  
        await act(async () => {
          await expect(
            result.current.writeToCharacteristic(testPrimaryServiceUUID, testCharacteristicUUID, valueToWrite)
          ).rejects.toThrow(BluetoothSecurityException); // parseErrors converts this
        });
      });
  });
  
  describe('6. Error Parsing (parseErrors function direct test - though it is internal)', () => {
    // The parseErrors function is not exported, so we test it indirectly via connect() or other methods.
    // The previous tests for connect failures already cover some of these.
    // For more direct testing, parseErrors would need to be exported or tested via its effects.
    // Here are examples of testing via connect, if specific error messages are needed:
    
    test('NetworkError during connect results in BluetoothNetworkException', async () => {
        const networkError = createMockError('Network issue', 'NetworkError');
        mockRequestDevice.mockRejectedValue(networkError);
        const { result } = renderHook(() => useBluetooth(testDeviceName, testPrimaryServiceUUID, testOptionalServicesUUIDs));
        await act(async () => {
            await expect(result.current.connect()).rejects.toThrow(BluetoothNetworkException);
        });
    });

    test('SecurityError during connect results in BluetoothSecurityException', async () => {
        const securityError = createMockError('Security issue', 'SecurityError');
        mockRequestDevice.mockRejectedValue(securityError);
        const { result } = renderHook(() => useBluetooth(testDeviceName, testPrimaryServiceUUID, testOptionalServicesUUIDs));
        await act(async () => {
            await expect(result.current.connect()).rejects.toThrow(BluetoothSecurityException);
        });
    });
    
    test('NotSupportedError during connect results in BluetoothNotSupportedException', async () => {
        const notSupportedError = createMockError('Not Supported', 'NotSupportedError');
        mockRequestDevice.mockRejectedValue(notSupportedError);
        const { result } = renderHook(() => useBluetooth(testDeviceName, testPrimaryServiceUUID, testOptionalServicesUUIDs));
        await act(async () => {
            await expect(result.current.connect()).rejects.toThrow(BluetoothNotSupportedException);
        });
    });

    test('Special message "GATT operation failed for unknown reason." results in BluetoothUnknownException', async () => {
        // This error usually has a generic name like 'Error' but a specific message
        const gattUnknownError = new Error('GATT operation failed for unknown reason.');
        // gattUnknownError.name is 'Error' by default. parseErrors checks message first.
        mockRequestDevice.mockRejectedValue(gattUnknownError);
        const { result } = renderHook(() => useBluetooth(testDeviceName, testPrimaryServiceUUID, testOptionalServicesUUIDs));
        await act(async () => {
            await expect(result.current.connect()).rejects.toThrow(BluetoothUnknownException);
        });
    });

    test('Special message "User cancelled the requestDevice() chooser." results in BluetoothAbortException (even if name is not AbortError)', async () => {
        const userCancelledError = new Error('User cancelled the requestDevice() chooser.');
        mockRequestDevice.mockRejectedValue(userCancelledError);
        const { result } = renderHook(() => useBluetooth(testDeviceName, testPrimaryServiceUUID, testOptionalServicesUUIDs));
        await act(async () => {
            await expect(result.current.connect()).rejects.toThrow(BluetoothAbortException);
        });
    });
  });

  describe('7. Unmount cleanup', () => {
    test('should call disconnect on unmount if connected', async () => {
        mockRequestDevice.mockResolvedValue(mockDevice);
        mockDevice.gatt.connect.mockResolvedValue(mockServer);
        const { result, unmount } = renderHook(() => useBluetooth(testDeviceName, testPrimaryServiceUUID, testOptionalServicesUUIDs));
        
        await act(async () => {
            await result.current.connect();
        });
        expect(result.current.connected).toBe(true);
        mockServer.disconnect.mockClear(); // Clear any calls from connect if server had a disconnect method
        
        act(() => {
            unmount();
        });
        
        expect(mockServer.disconnect).toHaveBeenCalledTimes(1);
    });

    test('should not call disconnect on unmount if not connected', () => {
        const { unmount } = renderHook(() => useBluetooth(testDeviceName, testPrimaryServiceUUID, testOptionalServicesUUIDs));
        
        act(() => {
            unmount();
        });
        
        expect(mockServer.disconnect).not.toHaveBeenCalled();
    });
  });

});
