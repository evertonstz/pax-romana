import { useContext } from 'react';

import { AppContext, AppContextProps } from '../AppProvider';

const useAppContext = (): AppContextProps => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

export default useAppContext;
