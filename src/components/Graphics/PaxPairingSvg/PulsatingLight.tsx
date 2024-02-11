import React, { useEffect, useState } from 'react';

interface PulsatingLightProps {
  radius?: string;
  color: string;
}

const PulsatingLight = ({ radius, color }: PulsatingLightProps) => {
  const [isBloomed, setIsBloomed] = useState(false);
  useEffect(() => {
    const interval = setInterval(() => {
      setIsBloomed(prevState => !prevState);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const animationStyle: React.CSSProperties = {
    width: radius ? radius : '100px',
    height: radius ? radius : '100px',
    borderRadius: '50%',
    backgroundColor: color,
    boxShadow: isBloomed ? `0 0 50px 10px ${color}` : 'none',
    transition: 'box-shadow 1s ease-in-out',
  };

  const buildCircle = (x: string, y: string) => {
    return (
      <div
        style={{
          ...animationStyle,
          position: 'absolute',
          left: x,
          top: y,
          transform: 'translate(-50%, -50%)',
        }}
      ></div>
    );
  };

  return (
    <div
      style={{
        position: 'relative',
        width: '50px',
        height: '50px',
      }}
    >
      {buildCircle('60%', '50%')}
      {buildCircle('40%', '50%')}
      {buildCircle('50%', '60%')}
      {buildCircle('50%', '40%')}
    </div>
  );
};

export default PulsatingLight;
