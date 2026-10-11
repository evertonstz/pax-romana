// @vitest-environment jsdom
import { act, cleanup, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  BluetoothNotSupportedException,
  BluetoothSecurityException,
} from '../exceptions';
import useBluetooth from '../useBluetooth';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

function mockBluetooth(bluetooth: Partial<Bluetooth> | undefined) {
  vi.stubGlobal('navigator', { bluetooth });
}

describe('Bluetooth connection prerequisites', () => {
  it('reports an insecure origin before attempting to open the chooser', async () => {
    vi.stubGlobal('isSecureContext', false);
    const requestDevice = vi.fn();
    mockBluetooth({ requestDevice });
    const { result } = renderHook(() => useBluetooth('PAX', 'service', []));

    await act(async () => {
      await expect(result.current.connect()).rejects.toBeInstanceOf(
        BluetoothSecurityException,
      );
    });
    expect(requestDevice).not.toHaveBeenCalled();
  });

  it('reports a missing API without turning it into an unknown exception', async () => {
    vi.stubGlobal('isSecureContext', true);
    mockBluetooth(undefined);
    const { result } = renderHook(() => useBluetooth('PAX', 'service', []));

    await act(async () => {
      await expect(result.current.connect()).rejects.toBeInstanceOf(
        BluetoothNotSupportedException,
      );
      await expect(result.current.connect()).rejects.toThrow(
        'chrome://flags/#enable-experimental-web-platform-features',
      );
    });
    expect(result.current.connected).toBe(false);
  });

  it('opens the chooser synchronously from connect when the API is available', async () => {
    vi.stubGlobal('isSecureContext', true);
    const requestDevice = vi.fn().mockResolvedValue({ gatt: undefined });
    mockBluetooth({ requestDevice });
    const { result } = renderHook(() =>
      useBluetooth('PAX', 'service', ['optional-service']),
    );

    await act(async () => {
      const connection = result.current.connect();
      expect(requestDevice).toHaveBeenCalledWith({
        filters: [{ namePrefix: 'PAX' }],
        optionalServices: ['optional-service'],
      });
      await connection;
    });
  });
});
