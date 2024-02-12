import { ThemeActions } from './actions';
import { ThemeState } from './types';

export const initialState: ThemeState = {
  color: 'light',
  mode: 'auto',
};

const reducer = (state: ThemeState, action: ThemeActions): ThemeState => {
  switch (action.type) {
    case 'SET_THEME_COLOR':
      return { ...state, color: action.payload };
    case 'SET_THEME_MODE':
      return { ...state, mode: action.payload };
    default:
      return state;
  }
};

export default reducer;
