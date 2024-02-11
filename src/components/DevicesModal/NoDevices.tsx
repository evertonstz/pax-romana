/// <reference types="vite-plugin-svgr/client" />
import PaxIcon from '@/assets/svg/pax-device.svg?react';

import PulsatingLight from './PulsatingLight';

const NoDevices = () => {
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
          bottom: 60,
        }}
      >
        <PulsatingLight radius={'5px'} />
      </div>
      <PaxIcon style={{ opacity: 0.3 }} />
    </div>
  );
};

export default NoDevices;
