interface Pax3DeviceSvgProps {
  fillColor: string;
  style?: React.CSSProperties;
  showShadow?: boolean;
}

const Pax3DeviceSvg = (props: Pax3DeviceSvgProps) => {
  const { fillColor, style, showShadow } = props;
  return (
    <svg
      id="pax3device"
      viewBox="0 0 339 675"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block', width: '100%', height: '100%', ...style }}
    >
      <rect width="100%" height="100%" />
      <path
        d="M95.1133 16.9593C102.177 13.0309 110 8.68021 110 1.75692C155.31 -0.579584 180.697 
        -0.591687 226 1.75692C226 7.39649 233.379 11.8805 240.275 16.0708C244.603 18.7006 248.741 
        21.2147 250.744 23.8262C252.829 24.6358 253.974 25.5267 254 26.4999C254.282 37.4505 254.049 
        479.347 254.006 560.731C254.002 568.53 254 573.019 254 573.5C254 579 83 582 82.9996 
        573.5C82.9992 565 82.9996 26.4999 82.9996 26.4999C82.9996 25.8208 83.5948 25.1801 84.715 
        24.578C86.3506 21.8326 90.5753 19.4831 95.1133 16.9593Z"
        fill={fillColor}
      />
      <path
        d="M110 1.75692C110 14.3785 84 18.4499 84 27H252C252 18.8571 226 12.3427 226 
        1.75692C180.697 -0.591687 155.31 -0.579584 110 1.75692Z"
        fill={fillColor}
      />
      <path
        d="M339 567C339 626.647 263.112 675 169.5 675C75.8877 675 0 626.647 0 567C0 507.353 
        75.8877 459 169.5 459C263.112 459 339 507.353 339 567Z"
        fill="url(#paint0_radial_106_24)"
        fillOpacity="0.5"
      />
      {showShadow && (
        <defs>
          <radialGradient
            id="paint0_radial_106_24"
            cx="0"
            cy="0"
            r="1"
            gradientUnits="userSpaceOnUse"
            gradientTransform="translate(169 561) rotate(90) scale(73.5 150.658)"
          >
            <stop offset="0%" stopColor={fillColor} stopOpacity="1" />
            <stop offset="100%" stopColor={fillColor} stopOpacity="0" />
          </radialGradient>
        </defs>
      )}
    </svg>
  );
};

export default Pax3DeviceSvg;
