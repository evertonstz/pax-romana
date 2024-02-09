import { useContext } from 'react';

import { AppContext } from '../AppProvider';
import { BuiltPaxActions, buildActions } from '../paxState/actions';
import { PaxState } from '../paxState/types';

interface PaxContextHookType {
  state: PaxState;
  actions: BuiltPaxActions;
}

const useAppContext = (): PaxContextHookType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return { state: context.state, actions: buildActions(context.dispatch) };
};

export default useAppContext;
