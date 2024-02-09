import { useContext } from 'react';

import { PaxContext } from '../PaxProvider';
import { BuiltPaxActions, buildActions } from '../paxState/actions';
import { PaxState } from '../paxState/types';

interface PaxContextHookType {
  state: PaxState;
  actions: BuiltPaxActions;
}

export const usePaxContext = (): PaxContextHookType => {
  const context = useContext(PaxContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return { state: context.state, actions: buildActions(context.dispatch) };
};
