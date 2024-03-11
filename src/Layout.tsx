import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

export const PageLayout = ({ children }: Props) => {
  return (
    <div
      // eslint-disable-next-line react/no-unknown-property
      vaul-drawer-wrapper=""
      className="flex h-screen w-screen items-center justify-center bg-neutral-100 
      dark:bg-black"
    >
      {children}
    </div>
  );
};
