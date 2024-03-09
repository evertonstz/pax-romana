interface CircularProgressBarProps {
  percentage: number;
  label: string;
}

const CircularProgressBar = ({
  percentage,
  label,
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
          className="fill-transparent stroke-neutral-200 dark:stroke-neutral-800"
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
            className="fill-transparent stroke-black transition-[stroke-dasharray]
              dark:stroke-white"
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
      <div
        className="absolute inset-x-0 bottom-0 flex justify-center text-neutral-900
          dark:text-neutral-50"
      >
        <span className="text-lg font-bold">{`${label}`}</span>
      </div>
    </div>
  );
};

export default CircularProgressBar;
