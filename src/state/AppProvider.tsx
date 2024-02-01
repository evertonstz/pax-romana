// AppProvider.tsx
import React, { Dispatch, ReactNode, createContext, useReducer } from 'react';

import { Action } from './paxState/actions';
import reducer from './paxState/reducer';
import { PaxState } from './paxState/types';

export interface AppContextProps {
  state: PaxState;
  dispatch: Dispatch<Action>;
}

const initialPaxState: PaxState = {
  actualTemperature: 0,
  deviceName: undefined,
  pageTheme: 'light',
  heaterSetPointTemperature: 0,
};

export const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(reducer, initialPaxState);
  // gets theme from localstorage if available

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};
