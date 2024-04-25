import { usePaxContext } from '@/state/hooks';
import {
  Battery,
  BatteryFull,
  BatteryLow,
  BatteryMedium,
  Unplug,
} from 'lucide-react';

import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';

export function BatteryIndicator() {
  const { state } = usePaxContext();
  const tooltipContent = state.batteryPercentage
    ? `${state.batteryPercentage}%`
    : 'Disconnected';

  const getIcon = () => {
    if (!state.batteryPercentage) {
      return <Unplug />;
    }
    if (state.batteryPercentage < 25) {
      return <Battery />;
    }
    if (state.batteryPercentage < 50) {
      return <BatteryLow />;
    }
    if (state.batteryPercentage < 75) {
      return <BatteryMedium />;
    }
    if (state.batteryPercentage >= 75) {
      return <BatteryFull />;
    }
  };

  return (
    <Tooltip>
      <TooltipTrigger>{getIcon()}</TooltipTrigger>
      <TooltipContent>{tooltipContent}</TooltipContent>
    </Tooltip>
  );
}
