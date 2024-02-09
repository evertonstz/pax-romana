import { Typography } from 'antd';

import { Pax } from '../../pax';

interface HeaterStatusProps {
  heaterStatus?: Pax.lib.HeatingStates;
}

const HeaterStatus = ({ heaterStatus }: HeaterStatusProps) => {
  const buildTextProps = (HeaterStatus: Pax.lib.HeatingStates | undefined) => {
    if (heaterStatus === undefined) {
      return { statusText: 'N/A' };
    }
    switch (HeaterStatus) {
      case Pax.lib.HeatingStates.HEATING:
        return { statusText: 'Heating' };
      case Pax.lib.HeatingStates.READY:
        return { statusText: 'Ready' };
      case Pax.lib.HeatingStates.COOLING:
        return { statusText: 'Cooling' };
      case Pax.lib.HeatingStates.STANDBY:
        return { statusText: 'Standby' };
      case Pax.lib.HeatingStates.OVEN_OFF:
        return { statusText: 'Oven Off' };
      case Pax.lib.HeatingStates.TEMP_SET_MODE:
        return { statusText: 'Selecting Temperature' };
      default:
        return { statusText: 'N/A' };
    }
  };

  const textProps = buildTextProps(heaterStatus);
  return <Typography.Text>{textProps.statusText}</Typography.Text>;
};

export default HeaterStatus;
