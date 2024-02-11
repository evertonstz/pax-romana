import { useThemeContext } from '@/state/hooks';
import { theme } from 'antd';

import Pax3DeviceSvg from './Pax3DeviceSvg';
import PulsatingLight from './PulsatingLight';

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
        style={{
          width: '30%',
        }}
      />
    </div>
  );
};

export default PaxPairing;
