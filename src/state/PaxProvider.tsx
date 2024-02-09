// AppProvider.tsx
import React, { Dispatch, ReactNode, createContext, useReducer } from 'react';

import { PaxActions } from './paxState/actions';
import reducer, { initialPaxState } from './paxState/reducer';
import { PaxState } from './paxState/types';

export interface PaxContextProps {
  state: PaxState;
  dispatch: Dispatch<PaxActions>;
}

export const PaxContext = createContext<PaxContextProps | undefined>(undefined);

export const PaxProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(reducer, initialPaxState);

  return (
    <PaxContext.Provider value={{ state, dispatch }}>
      {children}
    </PaxContext.Provider>
  );
};
