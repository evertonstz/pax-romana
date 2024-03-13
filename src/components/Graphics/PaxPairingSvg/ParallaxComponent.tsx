import React, { useEffect, useState } from 'react';

interface ParallaxComponentProps {
  children: React.ReactNode;
  multiplier?: number;
}

interface MouseCoordnates {
  x: {
    current: number;
    max: number;
    min: number;
    perc: number;
  };
  y: {
    current: number;
    max: number;
    min: number;
    perc: number;
  };
}

const mouseCoordnatesInitialValue: MouseCoordnates = {
  x: {
    current: 0,
    max: 0,
    min: 0,
    perc: 0,
  },
  y: {
    current: 0,
    max: 0,
    min: 0,
    perc: 0,
  },
};

/**
 * Calculate the y-coordinate in a two-dimensional coordinate system based on the given
 * x-coordinate and a percentage between initial and final x-coordinates.
 *
 * @param {Object} coordinates - An object containing initial and final x and y coordinates
 * @param {number} coordinates.x.initial - The initial x-coordinate
 * @param {number} coordinates.x.final - The final x-coordinate
 * @param {number} coordinates.y.initial - The initial y-coordinate
 * @param {number} coordinates.y.final - The final y-coordinate
 * @param {number} currentPercentage - The percentage between initial and final x-coordinates
 * @return {number} The calculated y-coordinate
 */
const centerCoordinateSystem = (
  coordinates: {
    x: { initial: number; final: number };
    y: { initial: number; final: number };
  },
  currentPercentage: number,
) => {
  const m =
    (coordinates.y.final - coordinates.y.initial) /
    (coordinates.x.final - coordinates.x.initial);
  const y =
    m * (currentPercentage - coordinates.x.initial) + coordinates.y.initial;
  return y;
};

/**
 * Translate the current percentage to center coordinate system.
 *
 * @param {number} currentPercentage - the current percentage value to be translated
 * @return {number} the calculated value in the center coordinate system
 */
const translate = (currentPercentage: number) => {
  if (currentPercentage > 0.5) {
    // 0.51 to 1
    const calculated = centerCoordinateSystem(
      {
        x: {
          initial: 0.51,
          final: 1,
        },
        y: {
          initial: 0,
          final: 1,
        },
      },
      currentPercentage,
    );

    return calculated;
  } else {
    // 0 to 0.5
    const calculated = centerCoordinateSystem(
      {
        x: {
          initial: 0,
          final: 0.5,
        },
        y: {
          initial: -1,
          final: 0,
        },
      },
      currentPercentage,
    );
    return calculated;
  }
};

const ParallaxComponent = (props: ParallaxComponentProps) => {
  const { children, multiplier = 10 } = props;
  const [mouseCoord, setMouseCoord] = useState<MouseCoordnates>(
    mouseCoordnatesInitialValue,
  );

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMouseCoord({
        x: {
          current: event.clientX,
          max: window.innerWidth - 1,
          min: 0,
          perc: event.clientX / window.innerWidth,
        },
        y: {
          current: event.clientY,
          max: window.innerHeight - 1,
          min: 0,
          perc: event.clientY / window.innerHeight,
        },
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const parallaxStyle: React.CSSProperties = {
    transform: `translate(${-translate(mouseCoord.x.perc) * multiplier}px, 
    ${-translate(mouseCoord.y.perc) * multiplier}px)`,
  };

  return (
    <div className="h-full w-full" style={parallaxStyle}>
      {children}
    </div>
  );
};

export default ParallaxComponent;
