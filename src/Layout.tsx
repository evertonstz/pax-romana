import { ReactNode } from 'react';

import Navbar from './components/Navbar';

interface Props {
  children: ReactNode;
}

export const PageLayout = ({ children }: Props) => {
  return (
    <div className="flex h-screen w-screen flex-col">
      <Navbar />
      <div
        // eslint-disable-next-line react/no-unknown-property
        vaul-drawer-wrapper=""
        className="flex w-screen grow items-center justify-center bg-neutral-100 
      dark:bg-black"
      >
        {children}
      </div>
    </div>
  );
};
