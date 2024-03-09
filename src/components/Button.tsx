import { ReactNode } from 'react';

interface Props {
  type?: 'primary' | 'secondary' | 'text';
  onClick: () => void;
  children?: ReactNode;
  className?: string;
  disabled?: boolean;
}
const Button = ({
  onClick,
  type = 'primary',
  children,
  className,
  disabled,
}: Props) => {
  if (type === 'text') {
    return (
      <button
        disabled={disabled}
        onClick={onClick}
        type="button"
        className={`${className} bg-transparent text-center text-sm font-medium text-neutral-900
        hover:underline dark:text-neutral-50`}
      >
        {children}
      </button>
    );
  }
  let commonClassName = `bg-black text-neutral-50 hover:bg-neutral-700 active:bg-neutral-600
    active:ring-neutral-200 dark:bg-neutral-50 dark:text-black dark:hover:bg-neutral-200
    dark:active:bg-neutral-300 dark:active:ring-neutral-500 dark:disabled:bg-neutral-300
    dark:disabled:text-neutral-500 dark:disabled:ring-0`;
  if (type === 'secondary') {
    commonClassName = `bg-neutral-200 text-neutral-800 hover:bg-neutral-300 active:ring-neutral-200
      dark:bg-neutral-600 dark:text-white dark:hover:bg-neutral-700
      dark:active:bg-neutral-700 dark:active:ring-neutral-800 dark:disabled:bg-neutral-800
      dark:disabled:text-neutral-500 dark:disabled:ring-0`;
  }
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      type="button"
      className={`${className} me-2 rounded-md px-4 py-1.5 text-center text-sm font-medium
      transition-[background-color] active:outline-none active:ring-4 disabled:cursor-not-allowed
      ${commonClassName}`}
    >
      {children}
    </button>
  );
};

export default Button;
