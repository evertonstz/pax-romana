import { act, renderHook, waitFor } from '@testing-library/react';
import { Pax } from '@/pax'; // Assuming Pax namespace is available for types
import useBluetooth from '../useBluetooth'; // The hook we are mocking
import { usePaxBluetoothServices } from '../usePaxBluetoothServices'; // The hook we are testing
import { PaxBluetoothCharacteristics } from '../enums/PaxBluetoothCharacteristics';
import { PaxBluetoothServices } from '../enums/PaxBluetoothServices';

// --- Mock Pax.lib.PaxSerial for test argument ---
const mockPaxSerial = { device: 'PaxDevice1', serial: '12345' } as Pax.lib.PaxSerial;

// --- Mock useBluetooth ---
const mockUseBluetoothConnect = vi.fn();
const mockUseBluetoothDisconnect = vi.fn();
const mockUseBluetoothAddCharacteristicListener = vi.fn();
const mockUseBluetoothReadFromCharacteristic = vi.fn();
const mockUseBluetoothWriteToCharacteristic = vi.fn();

// These will be controllable per test
let mockBluetoothConnected = false;
let mockBluetoothIsListenerAdded = false;

vi.mock('../useBluetooth', () => ({
  default: vi.fn(() => ({
    connected: mockBluetoothConnected,
    isListenerAdded: mockBluetoothIsListenerAdded,
    connect: mockUseBluetoothConnect,
    disconnect: mockUseBluetoothDisconnect,
    addCharacteristicListener: mockUseBluetoothAddCharacteristicListener,
    readFromCharacteristic: mockUseBluetoothReadFromCharacteristic,
    writeToCharacteristic: mockUseBluetoothWriteToCharacteristic,
  })),
}));

// --- Mock Pax module ---
vi.mock('@/pax', async (importOriginal) => {
  const originalPax = await importOriginal<typeof Pax>(); // Import original to keep other parts
  const mockDecodedMessage = { type: 'testMessage' } as unknown as Pax.lib.messages.MessageAbs;
  
  // Define the mock for Pax.api.get within the factory
  const localMockPaxApiGet = vi.fn(() => ({ message: mockDecodedMessage }));

  return {
    ...originalPax, 
    Pax: {
      ...originalPax.Pax,
      api: {
        ...originalPax.Pax.api,
        get: localMockPaxApiGet, // Replace Pax.api.get with our mock
      },
      lib: {
        ...originalPax.Pax.lib,
        PaxEncryptedPacket: vi.fn().mockImplementation(buffer => ({
          buffer,
          // Ensure this mock instance is suitable for what writeToCharacteristic expects
        })),
      },
    },
  };
});


// --- Test Suite ---
describe('usePaxBluetoothServices Hook', () => {
  beforeEach(() => {
    // Reset all mocks and mock states before each test
    mockUseBluetoothConnect.mockReset().mockResolvedValue(undefined);
    mockUseBluetoothDisconnect.mockReset();
    mockUseBluetoothAddCharacteristicListener.mockReset().mockResolvedValue(undefined);
    mockUseBluetoothReadFromCharacteristic.mockReset();
    mockUseBluetoothWriteToCharacteristic.mockReset().mockResolvedValue(undefined);
    
    // Reset the mock for Pax.api.get (accessed via the imported Pax object)
    (Pax.api.get as vi.Mock).mockClear().mockReturnValue({ message: { type: 'testMessage' } as unknown as Pax.lib.messages.MessageAbs });
    (Pax.lib.PaxEncryptedPacket as vi.Mock).mockClear();


    // Reset controllable states for useBluetooth mock
    mockBluetoothConnected = false;
    mockBluetoothIsListenerAdded = false;

    // Reset the useBluetooth mock itself to re-apply the (potentially changed) states
    (useBluetooth as vi.Mock).mockImplementation(() => ({
      connected: mockBluetoothConnected,
      isListenerAdded: mockBluetoothIsListenerAdded,
      connect: mockUseBluetoothConnect,
      disconnect: mockUseBluetoothDisconnect,
      addCharacteristicListener: mockUseBluetoothAddCharacteristicListener,
      readFromCharacteristic: mockUseBluetoothReadFromCharacteristic,
      writeToCharacteristic: mockUseBluetoothWriteToCharacteristic,
    }));
  });

  const renderTestHook = () => renderHook(() => usePaxBluetoothServices(mockPaxSerial));

  describe('1. Connection and Disconnection', () => {
    test('initial connected state is false (from mocked useBluetooth)', () => {
      mockBluetoothConnected = false; // Ensure this is set before render for initial state
      (useBluetooth as vi.Mock).mockImplementationOnce(() => ({ // Ensure initial render gets this
        connected: false, isListenerAdded: false, connect: mockUseBluetoothConnect, disconnect: mockUseBluetoothDisconnect,
        addCharacteristicListener: mockUseBluetoothAddCharacteristicListener, readFromCharacteristic: mockUseBluetoothReadFromCharacteristic,
        writeToCharacteristic: mockUseBluetoothWriteToCharacteristic,
      }));
      const { result } = renderTestHook();
      expect(result.current.connected).toBe(false);
    });

    test('connect calls useBluetooth.connect', async () => {
      const { result } = renderTestHook();
      await act(async () => {
        await result.current.connect();
      });
      expect(mockUseBluetoothConnect).toHaveBeenCalledTimes(1);
    });

    test('disconnect calls useBluetooth.disconnect', () => {
      const { result } = renderTestHook();
      act(() => {
        result.current.disconnect();
      });
      expect(mockUseBluetoothDisconnect).toHaveBeenCalledTimes(1);
    });

    test('connected status reflects useBluetooth.connected', () => {
      mockBluetoothConnected = true; // Set the desired state for the mock
      // Re-initialize useBluetooth mock for this specific test case if needed after global beforeEach
       (useBluetooth as vi.Mock).mockImplementationOnce(() => ({
        connected: true, isListenerAdded: false, connect: mockUseBluetoothConnect, disconnect: mockUseBluetoothDisconnect,
        addCharacteristicListener: mockUseBluetoothAddCharacteristicListener, readFromCharacteristic: mockUseBluetoothReadFromCharacteristic,
        writeToCharacteristic: mockUseBluetoothWriteToCharacteristic,
      }));
      const { result } = renderTestHook();
      expect(result.current.connected).toBe(true);
    });
  });

  describe('2. eventListener.startListening', () => {
    const mockCallback = vi.fn();

    test('successfully adds listener if connected and not already added', async () => {
      mockBluetoothConnected = true;
      mockBluetoothIsListenerAdded = false;
      const { result } = renderTestHook();

      await act(async () => {
        await result.current.eventListener.startListening(mockCallback);
      });

      expect(mockUseBluetoothAddCharacteristicListener).toHaveBeenCalledWith(
        PaxBluetoothCharacteristics.Notifications,
        mockCallback,
      );
    });

    test('rejects if not connected', async () => {
      mockBluetoothConnected = false;
      const { result } = renderTestHook();
      
      await expect(
        result.current.eventListener.startListening(mockCallback)
      ).rejects.toEqual('Not connected');
      expect(mockUseBluetoothAddCharacteristicListener).not.toHaveBeenCalled();
    });

    test('rejects if listener already added', async () => {
      mockBluetoothConnected = true;
      mockBluetoothIsListenerAdded = true;
      const { result } = renderTestHook();

      await expect(
        result.current.eventListener.startListening(mockCallback)
      ).rejects.toEqual('Listener already added');
      expect(mockUseBluetoothAddCharacteristicListener).not.toHaveBeenCalled();
    });
  });

  describe('3. readFromMainService', () => {
    test('successfully reads and decodes message', async () => {
      mockBluetoothConnected = true;
      const mockBuffer = new ArrayBuffer(8);
      const mockDataView = new DataView(mockBuffer);
      mockUseBluetoothReadFromCharacteristic.mockResolvedValue(mockDataView);
      const { result } = renderTestHook();

      let message: Pax.lib.messages.MessageAbs | undefined;
      await act(async () => {
        message = await result.current.readFromMainService();
      });

      expect(mockUseBluetoothReadFromCharacteristic).toHaveBeenCalledWith(
        PaxBluetoothServices.MainService,
        PaxBluetoothCharacteristics.Read,
      );
      expect(Pax.lib.PaxEncryptedPacket as vi.Mock).toHaveBeenCalledWith(mockBuffer);
      expect(Pax.api.get).toHaveBeenCalledWith( // Use Pax.api.get directly as it's now the mock
        expect.objectContaining({ buffer: mockBuffer }), 
        mockPaxSerial
      );
      // Ensure mockDecodedMessage is correctly defined for this assertion if it's scoped within the mock factory
      expect(message).toEqual({ type: 'testMessage' }); // Or use a fresh object for assertion
    });

    test('handles error from readFromCharacteristic', async () => {
      mockBluetoothConnected = true;
      const readError = new Error('Read failed');
      mockUseBluetoothReadFromCharacteristic.mockRejectedValue(readError);
      const { result } = renderTestHook();

      await expect(result.current.readFromMainService()).rejects.toThrow('Read failed');
    });
  });

  describe('4. writeToMainService (Queueing Behavior)', () => {
    let resolveWriteCallbacks: Array<() => void>;
    let rejectWriteCallbacks: Array<(reason?: any) => void>;

    beforeEach(() => {
      mockBluetoothConnected = true; 
      resolveWriteCallbacks = [];
      rejectWriteCallbacks = [];
      mockUseBluetoothWriteToCharacteristic.mockImplementation(() => 
        new Promise((resolve, reject) => {
          resolveWriteCallbacks.push(resolve);
          rejectWriteCallbacks.push(reject);
        })
      );
    });

    test('writes a single packet successfully', async () => {
      const { result } = renderTestHook();
      const packet = new Pax.lib.PaxEncryptedPacket(new ArrayBuffer(1));
      
      // Fire and forget the write call, as its promise might resolve too early for this test's needs.
      // We control the actual BT write via resolveWriteCallbacks.
      act(() => { 
        result.current.writeToMainService(packet);
      });

      await waitFor(() => expect(mockUseBluetoothWriteToCharacteristic).toHaveBeenCalledTimes(1));
      expect(mockUseBluetoothWriteToCharacteristic).toHaveBeenCalledWith(
        PaxBluetoothServices.MainService,
        PaxBluetoothCharacteristics.Write,
        packet,
      );
      
      expect(resolveWriteCallbacks.length).toBe(1);
      // Resolve the actual Bluetooth write operation
      await act(async () => {
        resolveWriteCallbacks[0]();
        await new Promise(process.nextTick); // Ensure microtasks like promise resolutions complete
      });
      // Add assertions here if the hook's state changes after successful write completion
    });

    test('queues multiple packets and writes them sequentially', async () => {
      const { result } = renderTestHook();
      const packet1 = new Pax.lib.PaxEncryptedPacket(new ArrayBuffer(1));
      const packet2 = new Pax.lib.PaxEncryptedPacket(new ArrayBuffer(2));

      // Enqueue both packets
      act(() => { result.current.writeToMainService(packet1); });
      act(() => { result.current.writeToMainService(packet2); });
      
      // First packet should be written
      await waitFor(() => {
        expect(mockUseBluetoothWriteToCharacteristic).toHaveBeenCalledWith(
          PaxBluetoothServices.MainService, PaxBluetoothCharacteristics.Write, packet1
        );
      });
      expect(mockUseBluetoothWriteToCharacteristic).toHaveBeenCalledTimes(1);
      
      expect(resolveWriteCallbacks.length).toBe(1); // Only P1's promise resolver should exist now
      await act(async () => {
        resolveWriteCallbacks[0](); // Resolve P1's actual BT write
        await new Promise(process.nextTick); 
      });

      // Second packet should be written
      await waitFor(() => {
        expect(mockUseBluetoothWriteToCharacteristic).toHaveBeenCalledWith(
          PaxBluetoothServices.MainService, PaxBluetoothCharacteristics.Write, packet2
        );
      });
      expect(mockUseBluetoothWriteToCharacteristic).toHaveBeenCalledTimes(2);
      
      expect(resolveWriteCallbacks.length).toBe(2); // P2's promise resolver should exist now
      await act(async () => {
        resolveWriteCallbacks[1](); // Resolve P2's actual BT write
        await new Promise(process.nextTick);
      });
    });

    test('handles write failure and attempts next packet in queue', async () => {
      const { result } = renderTestHook();
      const packet1 = new Pax.lib.PaxEncryptedPacket(new ArrayBuffer(1)); 
      const packet2 = new Pax.lib.PaxEncryptedPacket(new ArrayBuffer(2)); 

      act(() => { result.current.writeToMainService(packet1); });
      act(() => { result.current.writeToMainService(packet2); });
      
      await waitFor(() => {
        expect(mockUseBluetoothWriteToCharacteristic).toHaveBeenCalledWith(
            PaxBluetoothServices.MainService, PaxBluetoothCharacteristics.Write, packet1
        );
      });
      expect(mockUseBluetoothWriteToCharacteristic).toHaveBeenCalledTimes(1);
      
      expect(rejectWriteCallbacks.length).toBe(1);
      expect(resolveWriteCallbacks.length).toBe(1); // P1's resolve was also pushed
      await act(async () => {
        rejectWriteCallbacks[0](new Error('Write failed')); // Reject P1's actual BT write
        await new Promise(process.nextTick);
      });

      await waitFor(() => {
        expect(mockUseBluetoothWriteToCharacteristic).toHaveBeenCalledWith(
            PaxBluetoothServices.MainService, PaxBluetoothCharacteristics.Write, packet2
        );
      });
      expect(mockUseBluetoothWriteToCharacteristic).toHaveBeenCalledTimes(2);
      
      expect(resolveWriteCallbacks.length).toBe(2); 
      await act(async () => {
        resolveWriteCallbacks[1](); // Resolve P2's actual BT write
        await new Promise(process.nextTick);
      });
    });
  });
});
