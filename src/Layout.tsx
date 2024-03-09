import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

export const PageLayout = ({ children }: Props) => {
  return (
    <div
      className="flex h-screen w-screen items-center justify-center bg-neutral-100 
      dark:bg-neutral-950"
    >
      {children}
    </div>
  );
};
