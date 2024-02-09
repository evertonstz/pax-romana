import { useLocalStorage } from '@uidotdev/usehooks';
import React, {
  Dispatch,
  ReactNode,
  createContext,
  useEffect,
  useReducer,
} from 'react';

import { ThemeActions } from './themeState/actions';
import reducer from './themeState/reducer';
import { ThemeColor, ThemeState } from './themeState/types';

const LOCAL_STORAGE_THEME_NAME = 'appTheme';

export interface ThemeContextProps {
  state: ThemeState;
  dispatch: Dispatch<ThemeActions>;
}

export const ThemeContext = createContext<ThemeContextProps | undefined>(
  undefined,
);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [localThemeColor, saveLocalThemeColor] = useLocalStorage<ThemeColor>(
    LOCAL_STORAGE_THEME_NAME,
    'light',
  );
  const [state, dispatch] = useReducer(reducer, {
    themeColor: localThemeColor,
  });

  useEffect(() => {
    if (state.themeColor !== localThemeColor) {
      saveLocalThemeColor(state.themeColor);
    }
  }, [localThemeColor, saveLocalThemeColor, state.themeColor]);

  return (
    <ThemeContext.Provider value={{ state, dispatch }}>
      {children}
    </ThemeContext.Provider>
  );
};
