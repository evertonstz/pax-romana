export type ThemeColor = 'light' | 'dark';

export interface ThemeState {
  themeColor: ThemeColor;
  isDeviceModalOpen: boolean;
}
