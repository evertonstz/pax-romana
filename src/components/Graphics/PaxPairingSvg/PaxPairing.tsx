import { useThemeContext } from '@/state/hooks';
import { theme } from 'antd';

import PulsatingLight from './PulsatingLight';
import Pax3DeviceSvg from './Svg/Pax3DeviceSvg';

const PaxPairing = () => {
  const {
    state: { themeColor },
  } = useThemeContext();
  const { token } = theme.useToken();

  const svgFillColor = token.colorIcon;
  const lightColor = themeColor === 'light' ? '#fff' : '#000';

  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 60,
        }}
      >
        <PulsatingLight radius={'5px'} color={lightColor} />
      </div>
      <Pax3DeviceSvg
        fillColor={svgFillColor}
        showShadow={themeColor === 'light' ? true : false}
        style={{
          width: '50%',
        }}
      />
    </div>
  );
};

export default PaxPairing;
