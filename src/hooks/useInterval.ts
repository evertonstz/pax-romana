import { useEffect, useRef } from 'react';

interface UseIntervalProps {
  callback?: () => void;
  delay: number;
  disabled?: boolean;
}

export const useInterval = ({
  callback,
  delay,
  disabled = false,
}: UseIntervalProps): void => {
  const savedCallback = useRef<() => void>();
  const intervalId = useRef<NodeJS.Timeout | null>(null);

  // Remember the latest callback if it changes.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    const tick = () => {
      if (savedCallback.current) {
        savedCallback.current();
      }
    };

    if (disabled) {
      // Clear the interval if disabled is true
      if (intervalId.current !== null) {
        clearInterval(intervalId.current);
        intervalId.current = null;
      }
    } else {
      // Set up or update the interval if disabled is false
      if (intervalId.current !== null) {
        clearInterval(intervalId.current);
      }
      intervalId.current = setInterval(tick, delay);
      return () => {
        if (intervalId.current !== null) {
          clearInterval(intervalId.current);
        }
      };
    }
  }, [delay, disabled]);
};
