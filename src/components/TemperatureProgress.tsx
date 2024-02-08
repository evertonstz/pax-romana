import { Progress } from 'antd';

interface TemperatureProgressProps {
  connected: boolean;
  heaterSetPointTemperature: number;
  actualTemperature: number;
  unit: 'C' | 'F';
}

const TemperatureProgress = ({
  connected,
  heaterSetPointTemperature,
  actualTemperature,
  unit,
}: TemperatureProgressProps) => {
  const strokeWidth = 10;
  const buildDefaultProgress = () => {
    return (
      <Progress
        type="dashboard"
        percent={0}
        format={() => 'N/A'}
        strokeWidth={strokeWidth}
      />
    );
  };

  if (!connected) {
    return buildDefaultProgress();
  }

  if (heaterSetPointTemperature === 0 && actualTemperature === 0) {
    return buildDefaultProgress();
  }

  return (
    <Progress
      type="dashboard"
      percent={(actualTemperature / heaterSetPointTemperature) * 100}
      format={() => `${Math.round(actualTemperature)}°${unit}`}
      strokeLinecap="round"
      strokeWidth={strokeWidth}
    />
  );
};

export default TemperatureProgress;
