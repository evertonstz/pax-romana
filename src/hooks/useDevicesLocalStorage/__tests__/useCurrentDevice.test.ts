// src/hooks/useDevicesLocalStorage/__tests__/useCurrentDevice.test.ts

import { act, renderHook } from '@testing-library/react';
import useCurrentDevice from '../useCurrentDevice';
import { useLocalStorage } from '@uidotdev/usehooks';

// Assuming Pax.lib.PaxSerial is string-like for tests.
type MockPaxSerial = string;

let MOCKED_LOCAL_STORAGE_VALUE: MockPaxSerial | undefined = undefined;

const MOCK_SET_VALUE_FN = vi.fn(
  (
    valueOrUpdater:
      | MockPaxSerial
      | undefined
      | ((prevState?: MockPaxSerial) => MockPaxSerial | undefined),
  ) => {
    if (typeof valueOrUpdater === 'function') {
      MOCKED_LOCAL_STORAGE_VALUE = valueOrUpdater(MOCKED_LOCAL_STORAGE_VALUE);
    } else {
      MOCKED_LOCAL_STORAGE_VALUE = valueOrUpdater;
    }
  },
);

vi.mock('@uidotdev/usehooks', () => ({
  useLocalStorage: vi.fn((_key: string, initialHookValue?: any) => {
    const valueToReturn =
      MOCKED_LOCAL_STORAGE_VALUE !== undefined
        ? MOCKED_LOCAL_STORAGE_VALUE
        : initialHookValue;
    return [valueToReturn, MOCK_SET_VALUE_FN];
  }),
}));

const resetAndPrimeLocalStorageMock = (initialSerial?: MockPaxSerial) => {
  MOCKED_LOCAL_STORAGE_VALUE = initialSerial;
  MOCK_SET_VALUE_FN.mockClear();
  (useLocalStorage as ReturnType<typeof vi.fn>).mockClear();
};

const CURRENT_DEVICE_STORE_NAME = 'currentDevice';

describe('useCurrentDevice Hook', () => {
  beforeEach(() => {
    resetAndPrimeLocalStorageMock(undefined);
  });

  it('should initialize with currentDevice as undefined if local storage is empty', () => {
    const { result } = renderHook(() => useCurrentDevice());
    expect(result.current.currentDevice).toBeUndefined();
    expect(useLocalStorage).toHaveBeenCalledWith(
      CURRENT_DEVICE_STORE_NAME,
      undefined,
    );
  });

  it('should save the device serial and update currentDevice', () => {
    const testSerial: MockPaxSerial = 'test-serial-123';
    const { result, rerender } = renderHook(() => useCurrentDevice());

    expect(result.current.currentDevice).toBeUndefined();

    act(() => {
      result.current.saveCurrentDevice(testSerial);
    });
    
    rerender(); 

    expect(result.current.currentDevice).toBe(testSerial);
    expect(MOCK_SET_VALUE_FN).toHaveBeenCalledTimes(1);
    expect(MOCK_SET_VALUE_FN).toHaveBeenCalledWith(testSerial);
    expect(MOCKED_LOCAL_STORAGE_VALUE).toBe(testSerial);
  });

  it('should retrieve a saved device serial from local storage on init', () => {
    const existingSerial: MockPaxSerial = 'existing-serial-456';
    resetAndPrimeLocalStorageMock(existingSerial);

    const { result } = renderHook(() => useCurrentDevice());

    expect(result.current.currentDevice).toBe(existingSerial);
    expect(useLocalStorage).toHaveBeenCalledWith(
      CURRENT_DEVICE_STORE_NAME,
      undefined,
    );
    expect(MOCK_SET_VALUE_FN).not.toHaveBeenCalled();
  });

  it('should update currentDevice correctly when saveCurrentDevice is called multiple times', () => {
    const { result, rerender } = renderHook(() => useCurrentDevice());
    const serial1: MockPaxSerial = 'serial-A';
    const serial2: MockPaxSerial = 'serial-B';

    act(() => {
      result.current.saveCurrentDevice(serial1);
    });
    rerender(); 
    expect(result.current.currentDevice).toBe(serial1);
    expect(MOCK_SET_VALUE_FN).toHaveBeenCalledWith(serial1);
    expect(MOCKED_LOCAL_STORAGE_VALUE).toBe(serial1);

    act(() => {
      result.current.saveCurrentDevice(serial2);
    });
    rerender(); 
    expect(result.current.currentDevice).toBe(serial2);
    expect(MOCK_SET_VALUE_FN).toHaveBeenCalledWith(serial2);
    expect(MOCK_SET_VALUE_FN).toHaveBeenCalledTimes(2);
    expect(MOCKED_LOCAL_STORAGE_VALUE).toBe(serial2);
  });

  it('should allow clearing the current device by saving undefined', () => {
    const initialSerial: MockPaxSerial = 'serial-to-clear';
    resetAndPrimeLocalStorageMock(initialSerial);

    const { result, rerender } = renderHook(() => useCurrentDevice());
    expect(result.current.currentDevice).toBe(initialSerial);

    act(() => {
      result.current.saveCurrentDevice(undefined);
    });
    rerender(); 
    expect(result.current.currentDevice).toBeUndefined();
    expect(MOCK_SET_VALUE_FN).toHaveBeenCalledTimes(1);
    expect(MOCK_SET_VALUE_FN).toHaveBeenCalledWith(undefined);
    expect(MOCKED_LOCAL_STORAGE_VALUE).toBeUndefined();
  });
});
