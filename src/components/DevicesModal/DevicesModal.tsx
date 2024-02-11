import { useDevicesLocalStorage } from '@/hooks';
import { useThemeContext } from '@/state/hooks';
import { useWindowSize } from '@uidotdev/usehooks';
import { Col, Drawer, Modal, Row } from 'antd';

import AddDeviceFooter from '../AddDeviceFooter';
import { PaxPairing } from '../Graphics';
import DeviceCard from './DeviceCard';

const DevicesModal = () => {
  const {
    state: { isDeviceModalOpen },
    actions: { openDevicesModal },
  } = useThemeContext();
  const { width } = useWindowSize();
  const isSmallScreen = !width ? false : width < 550;
  const deviceStore = useDevicesLocalStorage();

  const renderCards = () => {
    return deviceStore.store.map(serial => {
      return (
        <Col key={serial.serial} xs={24} sm={12}>
          <DeviceCard serial={serial}></DeviceCard>
        </Col>
      );
    });
  };

  const renderContent = () => {
    return (
      <Row
        gutter={[16, 16]}
        justify="center"
        align="middle"
        style={{ minHeight: '155px' }}
      >
        {deviceStore.store.length === 0 ? <PaxPairing /> : renderCards()}
      </Row>
    );
  };

  const renderFooter = () => {
    return (
      <Row justify="center">
        <AddDeviceFooter />
      </Row>
    );
  };

  if (isSmallScreen) {
    return (
      <Drawer
        title={'Your Pax Romana devices'}
        height={'100vh'}
        open={isDeviceModalOpen}
        onClose={() => openDevicesModal(false)}
        placement="bottom"
        footer={renderFooter()}
      >
        {renderContent()}
      </Drawer>
    );
  }

  return (
    <Modal
      open={isDeviceModalOpen}
      footer={renderFooter()}
      title={'Your Pax Romana devices'}
      onCancel={() => openDevicesModal(false)}
    >
      {renderContent()}
    </Modal>
  );
};

export { DevicesModal };
