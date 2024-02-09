import { Pax } from '../../pax';

export interface PaxState {
  actualTemperature: number;
  heaterSetPointTemperature: number;
  heatingSate: Pax.lib.HeatingStates;
}
