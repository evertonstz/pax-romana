import { useDevicesLocalStorage } from '@/hooks';
import { Pax } from '@/pax';
import { Col, Row } from 'antd';
import { useState } from 'react';

import { ThemeDropdownButton } from '..';
import DevicesModal from '../DevicesModal';
import { NoSelectedDevice } from './NoSelectedDevice';
import ResizableSquare from './ResizableSquare';
import { SelectedDevice } from './SelectedDevice';

const MainContent = () => {
  const [isDeviceModalOpen, openDevicesModal] = useState(false);
  const deviceStore = useDevicesLocalStorage();

  const renderDevicesContent = (
    currentDevice: Pax.lib.PaxSerial | undefined,
  ) => {
    return !currentDevice ? (
      <NoSelectedDevice />
    ) : (
      <SelectedDevice
        currentDevice={currentDevice}
        openDevicesModal={() => openDevicesModal(true)}
      />
    );
  };

  const renderSettingsButton = () => {
    return (
      <Row justify="end" style={{ margin: '10px' }}>
        <Col>
          <ThemeDropdownButton />
        </Col>
      </Row>
    );
  };

  return (
    <>
      <DevicesModal
        open={isDeviceModalOpen}
        onClose={() => openDevicesModal(false)}
      />
      <ResizableSquare header={renderSettingsButton()}>
        {renderDevicesContent(deviceStore.currentDevice)}
      </ResizableSquare>
    </>
  );
};

export default MainContent;
