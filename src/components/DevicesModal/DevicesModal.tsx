import { useDevicesLocalStorage } from '@/hooks';
import { WarningFilled } from '@ant-design/icons';
import { useWindowSize } from '@uidotdev/usehooks';
import { Col, Drawer, Modal, Row } from 'antd';

import AddDeviceFooter from '../AddDeviceFooter';
import DeviceCard from './DeviceCard';

export interface DevicesModalProps {
  open: boolean;
  onClose: () => void;
}

const DevicesModal = ({ open, onClose }: DevicesModalProps) => {
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
        {deviceStore.store.length === 0 ? (
          <WarningFilled style={{ fontSize: '64px', opacity: 0.3 }} />
        ) : (
          renderCards()
        )}
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
        open={open}
        onClose={onClose}
        placement="bottom"
        footer={renderFooter()}
      >
        {renderContent()}
      </Drawer>
    );
  }

  return (
    <Modal
      open={open}
      footer={renderFooter()}
      title={'Your Pax Romana devices'}
      onCancel={onClose}
    >
      {renderContent()}
    </Modal>
  );
};

export { DevicesModal };
