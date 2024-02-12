import { useLocalStorage } from '@uidotdev/usehooks';
import React, { ReactNode, createContext } from 'react';

import { initialState } from './themeState/reducer';
import { ThemeState } from './themeState/types';

const LOCAL_STORAGE_THEME_NAME = 'appTheme';

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
  const [state, setter] = useLocalStorage<ThemeState>(
    LOCAL_STORAGE_THEME_NAME,
    initialState,
  );

  // const [state, dispatch] = useReducer(reducer);

  // useEffect(() => {
  //   if (state.themeColor !== localThemeColor) {
  //     saveLocalThemeColor(state.themeColor);
  //   }
  // }, [localThemeColor, saveLocalThemeColor, state.themeColor]);

  return (
    <ThemeContext.Provider value={{ state, setter }}>
      {children}
    </ThemeContext.Provider>
  );
};
