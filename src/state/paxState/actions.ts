export type PaxActions =
  | { type: 'INCREMENT' }
  | { type: 'SET_ACTUAL_TEMPERATURE'; payload: number }
  | { type: 'SET_HEATER_SETPOINT_TEMPERATURE'; payload: number };

export interface BuiltPaxActions {
  setActualTemperature: (temperature: number) => void;
  setHeaterSetPointTemperature: (temperature: number) => void;
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

export const buildActions = (
  dispatch: React.Dispatch<PaxActions>,
): BuiltPaxActions => {
  return {
    setActualTemperature: (temperature: number) =>
      setActualTemperature(dispatch, temperature),
    setHeaterSetPointTemperature: (temperature: number) =>
      setHeaterSetPointTemperature(dispatch, temperature),
  };
};
