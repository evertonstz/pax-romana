import { Pax } from '@/pax';

export interface PaxState {
  actualTemperature: number;
  heaterSetPointTemperature: number;
  heatingSate?: Pax.lib.HeatingStates;
  colorTheme?: Pax.lib.ColorTheme;
  batteryPercentage?: number;
  brightness?: number;
  haptics?: number;
}
