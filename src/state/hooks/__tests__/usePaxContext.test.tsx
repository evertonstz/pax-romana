import { renderHook } from '@testing-library/react';
import React, { ReactNode } from 'react'; // Import React for JSX
import { PaxContext, PaxContextProps } from '../../PaxProvider'; // Actual Context
import { BuiltPaxActions, buildActions } from '../../paxState/actions'; // Actual buildActions for mocking
import { PaxState } from '../../paxState/types'; // For sample state type
import { usePaxContext } from '../usePaxContext'; // The hook to test

// --- Mock buildActions ---
// This mock returns a predefined set of spy functions for each action creator.
const mockSetActualTemperature = vi.fn();
const mockSetHeaterSetPointTemperature = vi.fn();
const mockSetHeatingState = vi.fn();
const mockSetColorTheme = vi.fn();
const mockSetBatteryPercentage = vi.fn();
const mockSetBrightness = vi.fn();
const mockSetHaptics = vi.fn();
const mockResetPaxState = vi.fn();

const mockBuiltActions: BuiltPaxActions = {
  setActualTemperature: mockSetActualTemperature,
  setHeaterSetPointTemperature: mockSetHeaterSetPointTemperature,
  setHeatingState: mockSetHeatingState,
  setColorTheme: mockSetColorTheme,
  setBatteryPercentage: mockSetBatteryPercentage,
  setBrightness: mockSetBrightness,
  setHaptics: mockSetHaptics,
  resetPaxState: mockResetPaxState,
};

vi.mock('../../paxState/actions', () => ({
  // We only need to mock buildActions for this test.
  // Types like PaxActions are available due to static analysis, not this runtime mock.
  buildActions: vi.fn(() => mockBuiltActions),
}));

// --- Test Suite ---
describe('usePaxContext Hook', () => {
  // Sample state for testing
  const sampleState: PaxState = {
    actualTemperature: 50,
    heaterSetpointTemperature: 100,
    heatingState: 'HEATING' as any, // Cast if Pax.lib.HeatingStates is a specific enum/type
    colorTheme: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
    batteryPercentage: 80,
    brightness: 7,
    haptics: 3,
  };

  // Mock dispatch function
  const mockDispatch = vi.fn();

  // Clean up mocks before each test
  beforeEach(() => {
    (buildActions as vi.Mock).mockClear(); // Clear the mock for buildActions
    mockDispatch.mockClear(); // Clear the mock dispatch

    // Clear all individual action creator mocks
    mockSetActualTemperature.mockClear();
    mockSetHeaterSetPointTemperature.mockClear();
    mockSetHeatingState.mockClear();
    mockSetColorTheme.mockClear();
    mockSetBatteryPercentage.mockClear();
    mockSetBrightness.mockClear();
    mockSetHaptics.mockClear();
    mockResetPaxState.mockClear();
  });

  describe('When used within a PaxProvider', () => {
    // Helper function to create a wrapper component with PaxProvider
    const createWrapper = (contextValue: PaxContextProps) =>
      ({ children }: { children: ReactNode }) => (
        <PaxContext.Provider value={contextValue}>{children}</PaxContext.Provider>
      );

    test('1. Returns the correct state and dispatches actions through context', () => {
      const contextValue: PaxContextProps = { state: sampleState, dispatch: mockDispatch };
      const wrapper = createWrapper(contextValue);

      // Render the hook with the wrapper
      const { result } = renderHook(() => usePaxContext(), { wrapper });

      // Verify state
      expect(result.current.state).toEqual(sampleState);
      
      // Verify buildActions was called with the context's dispatch function
      expect(buildActions).toHaveBeenCalledWith(mockDispatch);

      // --- Test an action call ---
      const testTemp = 120;
      result.current.actions.setActualTemperature(testTemp);
      // Check if the specific mock action creator (from mockBuiltActions) was called
      expect(mockSetActualTemperature).toHaveBeenCalledWith(testTemp);
      expect(mockSetActualTemperature).toHaveBeenCalledTimes(1);

      // --- Test another action call (e.g., resetPaxState) ---
      result.current.actions.resetPaxState();
      expect(mockResetPaxState).toHaveBeenCalledTimes(1);
      
      // --- Test another action call with a different payload type ---
      const testHeatingState = 'COOLING' as any; // Cast if type is complex
      result.current.actions.setHeatingState(testHeatingState);
      expect(mockSetHeatingState).toHaveBeenCalledWith(testHeatingState);
      expect(mockSetHeatingState).toHaveBeenCalledTimes(1);
    });
  });

  describe('When used outside a PaxProvider', () => {
    test('2. Throws an error', () => {
      // Suppress console.error output from React/Testing Library for this expected error
      // as renderHook will log it when the hook throws.
      const originalConsoleError = console.error;
      console.error = vi.fn();

      // Expect the hook to throw an error when rendered without a provider
      expect(() => renderHook(() => usePaxContext())).toThrowError(
        'useAppContext must be used within an AppProvider' // Message from usePaxContext
      );
      
      // Restore console.error
      console.error = originalConsoleError;
    });
  });
});
