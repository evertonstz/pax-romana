import { Action } from './actions';
import { PaxState } from './types';

const reducer = (state: PaxState, action: Action): PaxState => {
  switch (action.type) {
    case 'SET_ACTUAL_TEMPERATURE':
      return { ...state, actualTemperature: action.payload };
    case 'SET_DEVICE_NAME':
      return { ...state, deviceName: action.payload };
    case 'SET_THEME':
      return { ...state, pageTheme: action.payload };
    case 'SET_HEATER_SETPOINT_TEMPERATURE':
      return { ...state, heaterSetPointTemperature: action.payload };
    default:
      return state;
  }
};

export default reducer;
