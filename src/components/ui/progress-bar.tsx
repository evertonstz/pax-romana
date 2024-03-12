import { cn } from '@/lib/utils';
import { type VariantProps, cva } from 'class-variance-authority';
import { ClassValue } from 'clsx';

const progressVariants = cva('fill-transparent', {
  variants: {
    background: {
      default: 'stroke-neutral-200 dark:stroke-neutral-800',
      ghost: '',
    },
  },
  defaultVariants: {
    background: 'default',
  },
});
interface CircularProgressBarProps
  extends VariantProps<typeof progressVariants> {
  percentage: number;
  label: string;
  classNames?: {
    background?: ClassValue;
    foreground?: ClassValue;
    label?: ClassValue;
  };
}

const CircularProgressBar = ({
  percentage,
  label,
  background,
  classNames,
}: CircularProgressBarProps) => {
  const parametrizedPercentage = Math.min(1, Math.max(0, percentage));
  const radius = 90;
  const strokeWidth = 15;
  const normalizedRadius = radius - strokeWidth * 2;
  const perimeter = normalizedRadius * 2 * Math.PI;

  return (
    <div
      className="relative inset-x-0 top-0 flex items-center justify-center"
      style={{ width: radius * 2, height: radius + strokeWidth / 2 }}
    >
      <svg height={radius + strokeWidth / 2} width={radius * 2}>
        <circle
          className={cn(
            progressVariants({ background }),
            classNames?.background,
          )}
          strokeWidth={strokeWidth}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          strokeLinecap="round"
          strokeDasharray={`${perimeter / 2}, ${perimeter / 2}`}
          transform={`rotate(-180 ${radius} ${radius})`}
        />
        {parametrizedPercentage !== 0 && (
          <circle
            className={cn(
              'fill-transparent stroke-black transition-[stroke-dasharray] dark:stroke-white',
              classNames?.foreground,
            )}
            strokeWidth={strokeWidth}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            strokeLinecap="round"
            strokeDasharray={`${parametrizedPercentage * (perimeter / 2)}, ${perimeter}`}
            transform={`rotate(-180 ${radius} ${radius})`}
          />
        )}
      </svg>
      {label && (
        <div
          className={cn(
            `absolute inset-x-0 bottom-0 flex justify-center text-lg font-bold text-neutral-900
            dark:text-neutral-50`,
            classNames?.label,
          )}
        >
          <span>{`${label}`}</span>
        </div>
      )}
    </div>
  );
};

export { CircularProgressBar };
