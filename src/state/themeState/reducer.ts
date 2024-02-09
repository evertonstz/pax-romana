import { ThemeActions } from './actions';
import { ThemeState } from './types';

const reducer = (state: ThemeState, action: ThemeActions): ThemeState => {
  switch (action.type) {
    case 'SET_THEME':
      return { ...state, themeColor: action.payload };
    default:
      return state;
  }
};

export default reducer;
