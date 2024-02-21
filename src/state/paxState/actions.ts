import { Pax } from '@/pax';

export type PaxActions =
  | { type: 'SET_ACTUAL_TEMPERATURE'; payload: number }
  | { type: 'SET_HEATER_SETPOINT_TEMPERATURE'; payload: number }
  | { type: 'SET_HEATING_STATE'; payload: Pax.lib.HeatingStates }
  | { type: 'RESET_PAX_STATE' };

export interface BuiltPaxActions {
  setActualTemperature: (temperature: number) => void;
  setHeaterSetPointTemperature: (temperature: number) => void;
  setHeatingState: (heatingSate: Pax.lib.HeatingStates) => void;
  resetPaxState: () => void;
}

const setActualTemperature = (
  dispatch: React.Dispatch<PaxActions>,
  temperature: number,
) => {
  dispatch({ type: 'SET_ACTUAL_TEMPERATURE', payload: temperature });
};

const setHeaterSetPointTemperature = (
  dispatch: React.Dispatch<PaxActions>,
  temperature: number,
) => {
  dispatch({ type: 'SET_HEATER_SETPOINT_TEMPERATURE', payload: temperature });
};

const setHeatingState = (
  dispatch: React.Dispatch<PaxActions>,
  heatingSate: Pax.lib.HeatingStates,
) => {
  dispatch({ type: 'SET_HEATING_STATE', payload: heatingSate });
};

const resetPaxState = (dispatch: React.Dispatch<PaxActions>) => {
  dispatch({ type: 'RESET_PAX_STATE' });
};

export const buildActions = (
  dispatch: React.Dispatch<PaxActions>,
): BuiltPaxActions => {
  return {
    setActualTemperature: (temperature: number) =>
      setActualTemperature(dispatch, temperature),
    setHeaterSetPointTemperature: (temperature: number) =>
      setHeaterSetPointTemperature(dispatch, temperature),
    setHeatingState: (heatingSate: Pax.lib.HeatingStates) =>
      setHeatingState(dispatch, heatingSate),
    resetPaxState: () => resetPaxState(dispatch),
  };
};
