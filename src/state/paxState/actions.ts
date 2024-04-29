import { Pax } from '@/pax';

export type PaxActions =
  | { type: 'SET_ACTUAL_TEMPERATURE'; payload: number }
  | { type: 'SET_HEATER_SETPOINT_TEMPERATURE'; payload: number }
  | { type: 'SET_HEATING_STATE'; payload: Pax.lib.HeatingStates }
  | { type: 'SET_COLOR_THEME'; payload: Pax.lib.ColorTheme }
  | { type: 'SET_BATTERY_PERCENTAGE'; payload: number }
  | { type: 'SET_BRIGHTNESS'; payload: number }
  | { type: 'RESET_PAX_STATE' };

export interface BuiltPaxActions {
  setActualTemperature: (temperature: number) => void;
  setHeaterSetPointTemperature: (temperature: number) => void;
  setHeatingState: (heatingSate: Pax.lib.HeatingStates) => void;
  setColorTheme: (theme: Pax.lib.ColorTheme) => void;
  setBatteryPercentage: (percentage: number) => void;
  setBrightness: (brightness: number) => void;
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

const setColorTheme = (
  dispatch: React.Dispatch<PaxActions>,
  theme: Pax.lib.ColorTheme,
) => {
  dispatch({ type: 'SET_COLOR_THEME', payload: theme });
};

const setBatteryPercentage = (
  dispatch: React.Dispatch<PaxActions>,
  percentage: number,
) => {
  dispatch({ type: 'SET_BATTERY_PERCENTAGE', payload: percentage });
};

const setBrightness = (
  dispatch: React.Dispatch<PaxActions>,
  brightness: number,
) => {
  dispatch({ type: 'SET_BRIGHTNESS', payload: brightness });
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
    setColorTheme: (theme: Pax.lib.ColorTheme) =>
      setColorTheme(dispatch, theme),
    setBatteryPercentage: (percentage: number) =>
      setBatteryPercentage(dispatch, percentage),
    resetPaxState: () => resetPaxState(dispatch),
    setBrightness: (brightness: number) => setBrightness(dispatch, brightness),
  };
};
