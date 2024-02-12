import { useLocalStorage } from '@uidotdev/usehooks';
import React, {
  ReactNode,
  createContext,
  useCallback,
  useEffect,
  useState,
} from 'react';

import { ThemeState } from './themeState/types';

const LOCAL_STORAGE_THEME_NAME = 'appTheme';

export const initialState: ThemeState = {
  color: 'light',
  mode: 'auto',
};

export interface ThemeContextProps {
  state: ThemeState;
  setter: React.Dispatch<React.SetStateAction<ThemeState>>;
}

export const ThemeContext = createContext<ThemeContextProps | undefined>(
  undefined,
);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [localState, localStateSetter] = useLocalStorage<ThemeState>(
    LOCAL_STORAGE_THEME_NAME,
    initialState,
  );

  const [state, setter] = useState<ThemeState>(localState);

  useEffect(() => {
    if (state !== localState) {
      localStateSetter(state);
    }
  }, [localState, localStateSetter, state]);

  const listener = useCallback(
    (e: MediaQueryListEvent) => {
      setter(prev => ({
        ...prev,
        color: e.matches ? 'dark' : 'light',
      }));
    },
    [setter],
  );

  React.useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    if (state.mode === 'auto') {
      setter(prev => ({
        ...prev,
        color: media.matches ? 'dark' : 'light',
      }));

      media.addEventListener('change', listener);
    } else {
      media.removeEventListener('change', listener);
    }

    // Cleanup function
    return () => {
      media.removeEventListener('change', listener);
    };
  }, [listener, state.mode]);

  return (
    <ThemeContext.Provider value={{ state, setter }}>
      {children}
    </ThemeContext.Provider>
  );
};
