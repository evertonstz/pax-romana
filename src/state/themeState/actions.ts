import { ThemeColor } from './types';

export type ThemeActions =
  | { type: 'SET_THEME'; payload: ThemeColor }
  | { type: 'OPEN_DEVICES_MODAL'; payload: boolean };

export interface BuiltThemeActions {
  setPageTheme: (theme: ThemeColor) => void;
  openDevicesModal: (open: boolean) => void;
}

const setPageTheme = (
  dispatch: React.Dispatch<ThemeActions>,
  theme: ThemeColor,
) => {
  dispatch({ type: 'SET_THEME', payload: theme });
};

const openDevicesModal = (
  dispatch: React.Dispatch<ThemeActions>,
  open: boolean,
) => {
  dispatch({ type: 'OPEN_DEVICES_MODAL', payload: open });
};

export const buildActions = (
  dispatch: React.Dispatch<ThemeActions>,
): BuiltThemeActions => {
  return {
    setPageTheme: (theme: ThemeColor) => setPageTheme(dispatch, theme),
    openDevicesModal: (open: boolean) => openDevicesModal(dispatch, open),
  };
};
