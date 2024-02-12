import { ThemeColor, ThemeMode } from '@/types';

import { ThemeState } from './types';

export type ThemeActions =
  | {
      type: 'SET_THEME_COLOR';
      payload: ThemeColor;
    }
  | {
      type: 'SET_THEME_MODE';
      payload: ThemeMode;
    };
export interface BuiltThemeActions {
  setThemeColor: (theme: ThemeColor) => void;
  setThemeMode: (mode: ThemeMode) => void;
}

const setThemeColor = (
  setter: React.Dispatch<React.SetStateAction<ThemeState>>,
  color: ThemeColor,
) => {
  setter(prev => ({ ...prev, color }));
};

const setThemeMode = (
  setter: React.Dispatch<React.SetStateAction<ThemeState>>,
  mode: ThemeMode,
) => {
  setter(prev => ({ ...prev, mode }));
};

export const buildActions = (
  setter: React.Dispatch<React.SetStateAction<ThemeState>>,
): BuiltThemeActions => {
  return {
    setThemeColor: (theme: ThemeColor) => setThemeColor(setter, theme),
    setThemeMode: (mode: ThemeMode) => setThemeMode(setter, mode),
  };
};
