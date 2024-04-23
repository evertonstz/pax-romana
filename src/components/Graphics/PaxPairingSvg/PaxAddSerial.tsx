import ParallaxComponent from './ParallaxComponent';
import Pax3DeviceSvg from './Svg/Pax3DeviceSvg';
import './shakingAnimation.css';

interface Props {
  parallax?: boolean;
  serial?: { serial?: string; device: string };
}

const PaxAddSerial = (props: Props) => {
  const svgFillColor = '#666666';

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

  return renderWithParallax(
    7,
    <div className="relative flex h-72 items-center justify-center">
      <div className="absolute top-14"></div>
      <Pax3DeviceSvg fillColor={svgFillColor} showShadow />
      <div className="absolute bottom-20">
        <h1 className="text-md text-center font-bold opacity-60">
          {props.serial?.device}
        </h1>
      </div>
      <div className="absolute bottom-16">
        <h1 className="text-center text-[0.6rem]">{props.serial?.serial}</h1>
      </div>
    </div>,
    props.parallax,
  );
};

export default PaxAddSerial;
