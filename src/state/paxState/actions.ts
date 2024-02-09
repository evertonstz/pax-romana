import { Pax } from '../../pax';

export type PaxActions =
  | { type: 'SET_ACTUAL_TEMPERATURE'; payload: number }
  | { type: 'SET_HEATER_SETPOINT_TEMPERATURE'; payload: number }
  | { type: 'SET_HEATING_STATE'; payload: Pax.lib.HeatingStates };

export interface BuiltPaxActions {
  setActualTemperature: (temperature: number) => void;
  setHeaterSetPointTemperature: (temperature: number) => void;
  setHeatingState: (heatingSate: Pax.lib.HeatingStates) => void;
}

export const setActualTemperature = (
  dispatch: React.Dispatch<PaxActions>,
  temperature: number,
) => {
  dispatch({ type: 'SET_ACTUAL_TEMPERATURE', payload: temperature });
};

export const setHeaterSetPointTemperature = (
  dispatch: React.Dispatch<PaxActions>,
  temperature: number,
) => {
  dispatch({ type: 'SET_HEATER_SETPOINT_TEMPERATURE', payload: temperature });
};

export const setHeatingState = (
  dispatch: React.Dispatch<PaxActions>,
  heatingSate: Pax.lib.HeatingStates,
) => {
  dispatch({ type: 'SET_HEATING_STATE', payload: heatingSate });
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
  };
};
