import { ThemeColor } from './types';

export interface ThemeActions {
  type: 'SET_THEME';
  payload: ThemeColor;
}

export interface BuiltThemeActions {
  setPageTheme: (theme: ThemeColor) => void;
}

export const setPageTheme = (
  dispatch: React.Dispatch<ThemeActions>,
  theme: ThemeColor,
) => {
  dispatch({ type: 'SET_THEME', payload: theme });
};

export const buildActions = (
  dispatch: React.Dispatch<ThemeActions>,
): BuiltThemeActions => {
  return {
    setPageTheme: (theme: ThemeColor) => setPageTheme(dispatch, theme),
  };
};
