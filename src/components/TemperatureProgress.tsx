import { CircularProgressBar } from './ui/progress-bar';

interface TemperatureProgressProps {
  connected: boolean;
  heaterSetPointTemperature: number;
  actualTemperature: number;
  unit: 'C' | 'F';
  minTemperature?: number;
  maxTemperature?: number;
}

const TemperatureProgress = ({
  connected,
  heaterSetPointTemperature,
  actualTemperature,
  unit,
  minTemperature = 175,
  maxTemperature = 215,
}: TemperatureProgressProps) => {
  const buildDefaultProgress = () => {
    return <CircularProgressBar percentage={0} label="N/A" />;
  };

  const m = (1 - 0.01) / (maxTemperature - minTemperature);
  const percentage = m * (actualTemperature - minTemperature) + 0.01;

  if (!connected) {
    return buildDefaultProgress();
  }

  if (heaterSetPointTemperature === 0 && actualTemperature === 0) {
    return buildDefaultProgress();
  }

  return (
    <CircularProgressBar
      percentage={percentage}
      label={`${Math.round(actualTemperature)}°${unit}`}
    />
  );
};

export default TemperatureProgress;
