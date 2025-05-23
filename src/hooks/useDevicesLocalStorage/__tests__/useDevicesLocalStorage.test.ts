import { act, renderHook } from '@testing-library/react';
import { useLocalStorage } from '@uidotdev/usehooks';
import useCurrentDevice from '../useCurrentDevice';
import { useDevicesLocalStorage } from '../useDevicesLocalStorage'; // Named export

// Define a mock type for Pax.lib.PaxSerial based on its usage in the hook
type MockPaxSerial = { device: string; serial: string };

// --- Mocks for Dependencies ---

// Mock for useLocalStorage
let MOCKED_STORE_VALUE: MockPaxSerial[] = [];
const MOCK_SAVE_STORE_FN = vi.fn((newStore: MockPaxSerial[]) => {
  MOCKED_STORE_VALUE = newStore;
});

// Mock for useCurrentDevice
let MOCKED_CURRENT_DEVICE: MockPaxSerial | undefined = undefined;
const MOCK_SAVE_CURRENT_DEVICE_FN = vi.fn((device?: MockPaxSerial) => {
  MOCKED_CURRENT_DEVICE = device;
});

vi.mock('@uidotdev/usehooks', () => ({
  useLocalStorage: vi.fn((_key: string, initialValue: any) => {
    // Return the current mocked store value if key matches, else initialValue
    // This mock needs to be flexible if other useLocalStorage calls were in the component tree
    if (_key === 'devicesSerials') {
       // Ensure initialValue (empty array from hook) is used if MOCKED_STORE_VALUE is not yet primed for a test scenario
      const valueToReturn = MOCKED_STORE_VALUE && MOCKED_STORE_VALUE.length > 0 ? MOCKED_STORE_VALUE : initialValue;
      return [valueToReturn, MOCK_SAVE_STORE_FN];
    }
    return [initialValue, vi.fn()]; // Default fallback for other keys
  }),
}));

vi.mock('../useCurrentDevice', () => ({
  __esModule: true, // Mark as ES Module
  default: vi.fn(() => ({
    currentDevice: MOCKED_CURRENT_DEVICE,
    saveCurrentDevice: MOCK_SAVE_CURRENT_DEVICE_FN,
  })),
}));

// Helper to reset and prime mocks before each test
const resetMocks = (
  initialStore: MockPaxSerial[] = [],
  initialCurrentDevice?: MockPaxSerial,
) => {
  MOCKED_STORE_VALUE = [...initialStore]; // Use spread to avoid modifying initial array from tests
  MOCKED_CURRENT_DEVICE = initialCurrentDevice;

  MOCK_SAVE_STORE_FN.mockClear();
  MOCK_SAVE_CURRENT_DEVICE_FN.mockClear();

  // Reset the main mock functions to reflect new primed values
  (useLocalStorage as ReturnType<typeof vi.fn>).mockImplementation(
    (_key: string, initialHookValue: any) => {
      if (_key === 'devicesSerials') {
        // When the hook calls useLocalStorage, it should get the current MOCKED_STORE_VALUE
        // or the initialHookValue if MOCKED_STORE_VALUE is specifically set to be empty for a test.
        // The hook itself passes `[]` as initialHookValue.
        return [MOCKED_STORE_VALUE, MOCK_SAVE_STORE_FN];
      }
      return [initialHookValue, vi.fn()];
    },
  );
  
  (useCurrentDevice as ReturnType<typeof vi.fn>).mockImplementation(() => ({
    currentDevice: MOCKED_CURRENT_DEVICE,
    saveCurrentDevice: MOCK_SAVE_CURRENT_DEVICE_FN,
  }));
};


// --- Test Suite ---
describe('useDevicesLocalStorage Hook', () => {
  beforeEach(() => {
    // Reset mocks to a clean state before each test
    resetMocks([], undefined);
  });

  // Helper for creating device objects
  const createDevice = (id: string): MockPaxSerial => ({ device: `device-${id}`, serial: `serial-${id}` });

  const dev1 = createDevice('1');
  const dev2 = createDevice('2');
  const dev3 = createDevice('3');

  test('1. Initial state: store is empty array, currentDevice is undefined', () => {
    const { result } = renderHook(() => useDevicesLocalStorage());

    expect(result.current.store).toEqual([]);
    expect(result.current.currentDevice).toBeUndefined();
    // Check if underlying hooks were called (optional, but good for sanity)
    expect(useLocalStorage).toHaveBeenCalledWith('devicesSerials', []);
    expect(useCurrentDevice).toHaveBeenCalled();
  });

  describe('2. appendStore tests', () => {
    test('Appends a new device; it becomes currentDevice if none is set', () => {
      const { result, rerender } = renderHook(() => useDevicesLocalStorage());
      
      act(() => {
        result.current.appendStore(dev1);
      });
      rerender(); // Rerender to reflect state changes from mocks

      expect(result.current.store).toEqual([dev1]);
      expect(MOCK_SAVE_STORE_FN).toHaveBeenCalledWith([dev1]);
      expect(result.current.currentDevice).toEqual(dev1); // Updated via mock
      expect(MOCK_SAVE_CURRENT_DEVICE_FN).toHaveBeenCalledWith(dev1);
    });

    test('Appends a second device; currentDevice does not change if already set', () => {
      // Prime mocks: dev1 is in store and is currentDevice
      resetMocks([dev1], dev1);
      const { result, rerender } = renderHook(() => useDevicesLocalStorage());

      act(() => {
        result.current.appendStore(dev2);
      });
      rerender();

      expect(result.current.store).toEqual([dev1, dev2]);
      expect(MOCK_SAVE_STORE_FN).toHaveBeenCalledWith([dev1, dev2]);
      // currentDevice should remain dev1
      expect(result.current.currentDevice).toEqual(dev1);
      // saveCurrentDevice should NOT have been called again for dev2
      expect(MOCK_SAVE_CURRENT_DEVICE_FN).not.toHaveBeenCalled();
    });

    test('Does not append a duplicate device', () => {
      resetMocks([dev1], dev1); // dev1 already in store and current
      const { result, rerender } = renderHook(() => useDevicesLocalStorage());

      act(() => {
        result.current.appendStore(dev1); // Attempt to add dev1 again
      });
      rerender();

      expect(result.current.store).toEqual([dev1]); // Store remains unchanged
      expect(MOCK_SAVE_STORE_FN).not.toHaveBeenCalled(); // saveStore not called
      expect(MOCK_SAVE_CURRENT_DEVICE_FN).not.toHaveBeenCalled(); // saveCurrentDevice not called
    });
  });

  describe('3. popFromStore tests', () => {
    test('Pops a device that is NOT currentDevice; currentDevice remains', () => {
      resetMocks([dev1, dev2, dev3], dev1); // dev1 is current
      const { result, rerender } = renderHook(() => useDevicesLocalStorage());

      act(() => {
        result.current.popFromStore(dev2);
      });
      rerender();

      expect(result.current.store).toEqual([dev1, dev3]);
      expect(MOCK_SAVE_STORE_FN).toHaveBeenCalledWith([dev1, dev3]);
      expect(result.current.currentDevice).toEqual(dev1); // currentDevice unchanged
      expect(MOCK_SAVE_CURRENT_DEVICE_FN).not.toHaveBeenCalled();
    });

    test('Pops currentDevice; next device in store becomes currentDevice (due to useEffect)', () => {
      // This test will heavily rely on the useEffect behavior.
      // The mock for useCurrentDevice needs to reflect the change triggered by useEffect.
      // Initial: store=[dev1, dev2], current=dev1
      resetMocks([dev1, dev2], dev1);
      const { result, rerender } = renderHook(() => useDevicesLocalStorage());

      // When popFromStore(dev1) is called:
      // 1. store becomes [dev2]. MOCK_SAVE_STORE_FN([dev2]) is called.
      // 2. MOCKED_STORE_VALUE becomes [dev2].
      // 3. useEffect runs: currentDevice (dev1) is not in store ([dev2]). So, saveCurrentDevice(undefined) is called.
      //    MOCKED_CURRENT_DEVICE becomes undefined.
      // 4. useEffect runs again (or in the same pass, depending on timing): store.length is 1 ([dev2]), currentDevice is undefined.
      //    So, saveCurrentDevice(store[0]) which is dev2, is called.
      //    MOCKED_CURRENT_DEVICE becomes dev2.

      act(() => {
        result.current.popFromStore(dev1);
      });
      // We need multiple rerenders or a way to wait for useEffects to settle if they chain.
      // For simplicity with mocks, we call rerender and assume the mock state is updated by then.
      rerender(); // Rerender 1: After pop. useEffect runs. currentDevice=dev1, store=[dev2]. saveCurrentDevice(undefined) is called. MOCKED_CURRENT_DEVICE becomes undefined.
      
      // The hook's internal currentDevice (from its own state/closure) will update on the next render cycle.
      rerender(); // Rerender 2: Hook re-renders. useCurrentDevice() (mock) now returns currentDevice=undefined. useEffect runs again. store=[dev2], currentDevice=undefined. saveCurrentDevice(dev2) is called. MOCKED_CURRENT_DEVICE becomes dev2.
      
      // The hook's internal currentDevice will update on the next render cycle to reflect dev2.
      rerender(); // Rerender 3: Hook re-renders. useCurrentDevice() (mock) returns currentDevice=dev2. result.current is updated.

      expect(result.current.store).toEqual([dev2]);
      expect(MOCK_SAVE_STORE_FN).toHaveBeenCalledWith([dev2]);
      
      // Verify useEffect behavior:
      // 1. Cleared because dev1 was popped (and was current)
      // 2. Set to dev2 because it's the only one left
      expect(MOCK_SAVE_CURRENT_DEVICE_FN).toHaveBeenCalledWith(undefined); // First effect call
      expect(MOCK_SAVE_CURRENT_DEVICE_FN).toHaveBeenCalledWith(dev2);    // Second effect call
      expect(MOCK_SAVE_CURRENT_DEVICE_FN).toHaveBeenCalledTimes(2); // Total calls
      expect(result.current.currentDevice).toEqual(dev2); // Final state from mock
    });

    test('Pops the only device (which is currentDevice); currentDevice becomes undefined', () => {
      resetMocks([dev1], dev1);
      const { result, rerender } = renderHook(() => useDevicesLocalStorage());

      act(() => {
        result.current.popFromStore(dev1); // store becomes [], currentDevice from hook's perspective is still dev1
      });
      rerender(); // Rerender 1: useEffect sees currentDevice=dev1, store=[]. Calls saveCurrentDevice(undefined). MOCKED_CURRENT_DEVICE becomes undefined.
      
      // The hook's internal currentDevice will update on the next render.
      rerender(); // Rerender 2: To get the updated currentDevice (now undefined) into result.current

      expect(result.current.store).toEqual([]);
      expect(MOCK_SAVE_STORE_FN).toHaveBeenCalledWith([]);
      // useEffect: currentDevice (dev1) not in store ([]). saveCurrentDevice(undefined).
      // store.length is 0, so second part of useEffect doesn't set a new currentDevice.
      expect(MOCK_SAVE_CURRENT_DEVICE_FN).toHaveBeenCalledWith(undefined);
      expect(MOCK_SAVE_CURRENT_DEVICE_FN).toHaveBeenCalledTimes(1);
      expect(result.current.currentDevice).toBeUndefined(); // Should now be undefined
    });
  });

  describe('4. inStore tests', () => {
    beforeEach(() => {
        resetMocks([dev1], undefined); // dev1 is in store
    });

    test('Returns true if device is in store', () => {
      const { result } = renderHook(() => useDevicesLocalStorage());
      expect(result.current.inStore(dev1)).toBe(true);
    });

    test('Returns false if device is not in store', () => {
      const { result } = renderHook(() => useDevicesLocalStorage());
      expect(result.current.inStore(dev2)).toBe(false);
    });
  });

  describe('5. useEffect logic tests', () => {
    test('currentDevice defined but not in store -> currentDevice is cleared', () => {
      // Setup: store is empty, but currentDevice is 'orphanDevice'
      resetMocks([], dev1); // dev1 is mocked as current, but store is []
      
      const { result, rerender } = renderHook(() => useDevicesLocalStorage());
      // Initial render, useEffect runs.
      // currentDevice (dev1) is not in store ([]). So, saveCurrentDevice(undefined) is called.
      rerender(); // Ensure useEffect has run

      expect(result.current.currentDevice).toBeUndefined();
      expect(MOCK_SAVE_CURRENT_DEVICE_FN).toHaveBeenCalledWith(undefined);
      expect(MOCK_SAVE_CURRENT_DEVICE_FN).toHaveBeenCalledTimes(1);
    });

    test('store has one device, currentDevice undefined -> currentDevice is set', () => {
      // Setup: store has dev1, currentDevice is undefined
      resetMocks([dev1], undefined);
      const { result, rerender } = renderHook(() => useDevicesLocalStorage());
      // Initial render, useEffect runs.
      // store.length is 1 (dev1), currentDevice is undefined. So, saveCurrentDevice(dev1) is called.
      rerender();

      expect(result.current.currentDevice).toEqual(dev1);
      expect(MOCK_SAVE_CURRENT_DEVICE_FN).toHaveBeenCalledWith(dev1);
      expect(MOCK_SAVE_CURRENT_DEVICE_FN).toHaveBeenCalledTimes(1);
    });
    
    test('store has multiple devices, currentDevice undefined -> currentDevice is set to the first device', () => {
      // The hook's useEffect for setting currentDevice only triggers if store.length === 1.
      // So, if currentDevice is undefined and store has multiple items, it should NOT set currentDevice.
      // Let's verify this interpretation.
      // The relevant useEffect: `if (store.length === 1 && !currentDevice)`
      resetMocks([dev1, dev2], undefined);
      const { result, rerender } = renderHook(() => useDevicesLocalStorage());
      rerender();

      expect(result.current.currentDevice).toBeUndefined(); // Should remain undefined
      expect(MOCK_SAVE_CURRENT_DEVICE_FN).not.toHaveBeenCalled(); // Should not be called
    });
  });
});
