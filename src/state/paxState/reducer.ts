import { PaxActions } from './actions';
import { PaxState } from './types';

const reducer = (state: PaxState, action: PaxActions): PaxState => {
  switch (action.type) {
    case 'SET_ACTUAL_TEMPERATURE':
      return { ...state, actualTemperature: action.payload };
    case 'SET_HEATER_SETPOINT_TEMPERATURE':
      return { ...state, heaterSetPointTemperature: action.payload };
    case 'SET_HEATING_STATE':
      return { ...state, heatingSate: action.payload };
    default:
      return state;
  }
};

export default reducer;
