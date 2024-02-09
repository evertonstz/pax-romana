// AppProvider.tsx
import React, { Dispatch, ReactNode, createContext, useReducer } from 'react';

import { PaxActions } from './paxState/actions';
import reducer from './paxState/reducer';
import { PaxState } from './paxState/types';

export interface AppContextProps {
  state: PaxState;
  dispatch: Dispatch<PaxActions>;
}

const initialPaxState: PaxState = {
  actualTemperature: 0,
  heaterSetPointTemperature: 0,
};

export const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(reducer, initialPaxState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};
