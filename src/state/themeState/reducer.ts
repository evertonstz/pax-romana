import { ThemeActions } from './actions';
import { ThemeState } from './types';

export const initialState: ThemeState = {
  themeColor: 'light',
  isDeviceModalOpen: false,
};

const reducer = (state: ThemeState, action: ThemeActions): ThemeState => {
  switch (action.type) {
    case 'SET_THEME':
      return { ...state, themeColor: action.payload };
    case 'OPEN_DEVICES_MODAL':
      return { ...state, isDeviceModalOpen: action.payload };
    default:
      return state;
  }
};

export default reducer;
