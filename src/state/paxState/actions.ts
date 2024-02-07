import { Theme } from './types';

export type Action =
  | { type: 'INCREMENT' }
  | { type: 'SET_DEVICE_NAME'; payload: string }
  | { type: 'SET_ACTUAL_TEMPERATURE'; payload: number }
  | { type: 'SET_HEATER_SETPOINT_TEMPERATURE'; payload: number }
  | { type: 'SET_THEME'; payload: Theme };

export const setPageTheme = (
  dispatch: React.Dispatch<Action>,
  theme: Theme,
) => {
  dispatch({ type: 'SET_THEME', payload: theme });
};

export const setActualTemperature = (
  dispatch: React.Dispatch<Action>,
  temperature: number,
) => {
  dispatch({ type: 'SET_ACTUAL_TEMPERATURE', payload: temperature });
};

export const setHeaterSetPointTemperature = (
  dispatch: React.Dispatch<Action>,
  temperature: number,
) => {
  dispatch({ type: 'SET_HEATER_SETPOINT_TEMPERATURE', payload: temperature });
};
