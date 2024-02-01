export type Theme = 'light' | 'dark';

export interface PaxState {
  deviceName?: string;
  actualTemperature: number;
  pageTheme: Theme;
  heaterSetPointTemperature: number;
}
