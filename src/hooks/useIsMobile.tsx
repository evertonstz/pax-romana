import { useWindowSize } from '@uidotdev/usehooks';

/**
 * Custom hook to check if the current screen width is smaller than a specified breakpoint.
 *
 * @param {number} breakpoint - The breakpoint value to compare the screen width against.
 * @return {boolean} Returns true if the screen width is smaller than the specified breakpoint,
 * false otherwise.
 */
const useIsMobile = (breakpoint = 768) => {
  const { width } = useWindowSize();
  const isSmallScreen = !width ? false : width < breakpoint;
  return isSmallScreen;
};
export default useIsMobile;
