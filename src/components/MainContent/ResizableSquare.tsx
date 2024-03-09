import { ReactNode } from 'react';

interface Props {
  children?: ReactNode;
  header?: ReactNode;
}

const ResizableSquare = ({ children, header }: Props) => {
  return (
    <div
      className="h-full w-full bg-white md:h-[768px] md:w-[768px] md:rounded-3xl 
    md:border dark:border-neutral-800 dark:bg-neutral-900"
    >
      <div>{header}</div>
      {children}
    </div>
  );
};

export default ResizableSquare;
