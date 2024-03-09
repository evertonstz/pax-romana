import PulsatingLight from './PulsatingLight';
import Pax3DeviceSvg from './Svg/Pax3DeviceSvg';

const PaxPairing = () => {
  const color = 'light';

  const svgFillColor = '#87CEEB';
  const lightColor = color === 'light' ? '#87CEEB' : '#00FFFF';

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
        showShadow={color === 'light' ? true : false}
        style={{
          width: '50%',
        }}
      />
    </div>
  );
};

export default PaxPairing;
