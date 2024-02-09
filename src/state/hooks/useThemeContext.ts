import { useContext } from 'react';

import { ThemeContext } from '..';
import { BuiltThemeActions, buildActions } from '../themeState/actions';
import { ThemeState } from '../themeState/types';

interface ThemeContextHookType {
  state: ThemeState;
  actions: BuiltThemeActions;
}

export const useThemeContext = (): ThemeContextHookType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within an ThemeProvider');
  }
  return { state: context.state, actions: buildActions(context.dispatch) };
};
