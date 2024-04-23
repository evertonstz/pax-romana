import ParallaxComponent from './ParallaxComponent';
import PulsatingLight from './PulsatingLight';
import Pax3DeviceSvg from './Svg/Pax3DeviceSvg';
import './shakingAnimation.css';

interface Props {
  parallax?: boolean;
  pulsatingLightSpeed?: 'slow' | 'normal' | 'fast';
  pairingAnimation?: boolean;
}

const PaxPairing = (props: Props) => {
  const { pairingAnimation = false } = props;
  const svgFillColor = '#666666';
  const lightColor = '#00FFFF';

  const renderWithParallax = (
    multiplier: number,
    children: React.ReactNode,
    parallax?: boolean,
  ) => {
    if (!parallax) {
      return children;
    }

    return (
      <ParallaxComponent multiplier={multiplier}>{children}</ParallaxComponent>
    );
  };

  return (
    <div
      className="relative flex h-72 items-center justify-center"
      style={
        pairingAnimation
          ? {
              animation: 'shake ease-in-out 1s alternate 2',
              transformOrigin: 'bottom',
            }
          : {}
      }
    >
      <div className="absolute top-14"></div>
      {renderWithParallax(
        7,
        <Pax3DeviceSvg fillColor={svgFillColor} showShadow />,
        props.parallax,
      )}
      <div className="absolute top-12">
        {renderWithParallax(
          10,
          <PulsatingLight
            radius={'5px'}
            color={lightColor}
            speed={props.pulsatingLightSpeed}
          />,
          props.parallax,
        )}
      </div>
    </div>
  );
};

export default PaxPairing;
