import { ReactNode } from 'react';

interface Props {
  children?: ReactNode;
  header?: ReactNode;
}

const ResizableSquare = ({ children, header }: Props) => {
  return (
    <div
      className="flex h-full w-full flex-col bg-white dark:border-neutral-800 
      dark:bg-neutral-950 md:max-h-[600px] md:w-[768px] md:rounded-3xl md:border 
      md:border-neutral-200"
    >
      {header && <div>{header}</div>}
      <div className="flex grow">{children}</div>
    </div>
  );
};

export default ResizableSquare;
