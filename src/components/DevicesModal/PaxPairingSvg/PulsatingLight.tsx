import React, { useEffect, useState } from 'react';

interface PulsatingLightProps {
  radius?: string;
}

const PulsatingLight = ({ radius }: PulsatingLightProps) => {
  const [isBloomed, setIsBloomed] = useState(false);
  const color = '#00bcd4';
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

  return (
    <div style={{ position: 'relative' }}>
      <div style={{ ...animationStyle, position: 'absolute', top: -5 }}></div>
      <div style={{ ...animationStyle, position: 'absolute', top: 5 }}></div>
      <div style={{ ...animationStyle, position: 'absolute', left: 5 }}></div>
      <div style={{ ...animationStyle, position: 'absolute', left: -5 }}></div>
    </div>
  );
};

export default PulsatingLight;
