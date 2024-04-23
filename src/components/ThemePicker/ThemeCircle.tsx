import { cn } from '@/lib/utils';

export interface IThemeCircleProps {
  size?: 'xm' | 'sm' | 'md' | 'lg' | 'xl';
  selected?: boolean;
  className?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
}

export function ThemeCircle(props: IThemeCircleProps) {
  const { size = 'md' } = props;

  const sizeStyle: Record<string, string> = {
    sm: 'h-10 w-10',
    md: 'h-12 w-12',
    lg: 'h-14 w-14',
    xl: 'h-16 w-16',
  };
  const selectedSizeStyle: Record<string, string> = {
    sm: 'h-10 w-10 border-2',
    md: 'h-12 w-12 border-2',
    lg: 'h-14 w-14 border-4',
    xl: 'h-16 w-16 border-4',
  };
  const baseStyle = `hover:cursor-pointer rounded-full dark:border-neutral-300 border-neutral-800`;
  //   const selected = props.selected ?
  return (
    <div
      style={props.style}
      className={cn(
        baseStyle,
        props.selected ? selectedSizeStyle[size] : sizeStyle[size],
        props.className,
      )}
      onClick={props.onClick}
    ></div>
  );
}
