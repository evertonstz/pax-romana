import CircularProgressBar from './CircularProgressBar';

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
  const buildDefaultProgress = () => {
    return <CircularProgressBar percentage={0} label="N/A" />;
  };

  if (!connected) {
    return buildDefaultProgress();
  }

  if (heaterSetPointTemperature === 0 && actualTemperature === 0) {
    return buildDefaultProgress();
  }

  return (
    <CircularProgressBar
      percentage={(actualTemperature / heaterSetPointTemperature) * 100}
      label={`${Math.round(actualTemperature)}°${unit}`}
    />
  );
};

export default TemperatureProgress;
