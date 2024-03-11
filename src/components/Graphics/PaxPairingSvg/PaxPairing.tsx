import PulsatingLight from './PulsatingLight';
import Pax3DeviceSvg from './Svg/Pax3DeviceSvg';

const PaxPairing = () => {
  const svgFillColor = '#666666';
  const lightColor = '#00FFFF';

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
        showShadow
        style={{
          width: '50%',
        }}
      />
    </div>
  );
};

export default PaxPairing;
