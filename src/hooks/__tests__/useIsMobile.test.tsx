import { renderHook } from '@testing-library/react';
import { useWindowSize } from '@uidotdev/usehooks';
import useIsMobile from '../useIsMobile';

// Mock the useWindowSize hook from @uidotdev/usehooks
vi.mock('@uidotdev/usehooks', () => ({
  useWindowSize: vi.fn(),
}));

// Helper function to easily set the mocked window width
const setMockWidth = (width?: number) => {
  (useWindowSize as ReturnType<typeof vi.fn>).mockReturnValue({ width, height: 768 }); // height is arbitrary
};

describe('useIsMobile Hook', () => {
  // Reset the mock before each test to ensure isolation, though not strictly necessary here
  // as setMockWidth is called in each test.
  beforeEach(() => {
    (useWindowSize as ReturnType<typeof vi.fn>).mockClear();
  });

  describe('Default Breakpoint (768px)', () => {
    const defaultBreakpoint = 768;

    test('1. Returns true if screen width is less than default breakpoint', () => {
      setMockWidth(defaultBreakpoint - 100); // e.g., 668px
      const { result } = renderHook(() => useIsMobile());
      expect(result.current).toBe(true);
      expect(useWindowSize).toHaveBeenCalledTimes(1);
    });

    test('2. Returns false if screen width is greater than default breakpoint', () => {
      setMockWidth(defaultBreakpoint + 100); // e.g., 868px
      const { result } = renderHook(() => useIsMobile());
      expect(result.current).toBe(false);
    });

    test('3. Returns false if screen width is equal to default breakpoint', () => {
      setMockWidth(defaultBreakpoint); // 768px
      const { result } = renderHook(() => useIsMobile());
      expect(result.current).toBe(false);
    });
  });

  describe('Custom Breakpoint', () => {
    const customBreakpoint = 1024;

    test('4a. Returns true if screen width is less than custom breakpoint', () => {
      setMockWidth(customBreakpoint - 100); // e.g., 924px
      const { result } = renderHook(() => useIsMobile(customBreakpoint));
      expect(result.current).toBe(true);
    });

    test('4b. Returns false if screen width is greater than custom breakpoint', () => {
      setMockWidth(customBreakpoint + 100); // e.g., 1124px
      const { result } = renderHook(() => useIsMobile(customBreakpoint));
      expect(result.current).toBe(false);
    });

    test('4c. Returns false if screen width is equal to custom breakpoint', () => {
      setMockWidth(customBreakpoint); // 1024px
      const { result } = renderHook(() => useIsMobile(customBreakpoint));
      expect(result.current).toBe(false);
    });
  });

  describe('Undefined Width', () => {
    test('5. Returns false if screen width from useWindowSize is undefined', () => {
      setMockWidth(undefined);
      const { result } = renderHook(() => useIsMobile());
      expect(result.current).toBe(false);
    });

    test('Returns false if screen width from useWindowSize is undefined with custom breakpoint', () => {
      setMockWidth(undefined);
      const { result } = renderHook(() => useIsMobile(1000));
      expect(result.current).toBe(false);
    });
  });
});
