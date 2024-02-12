import { Modal } from '@/components';
import { useDevicesLocalStorage } from '@/hooks';
import { WarningFilled } from '@ant-design/icons';
import { Col, Row } from 'antd';

import AddDeviceFooter from '../AddDeviceFooter';
import DeviceCard from './DeviceCard';

export interface DevicesModalProps {
  open: boolean;
  onClose: () => void;
}

const DevicesModal = ({ open, onClose }: DevicesModalProps) => {
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

  return (
    <Modal
      title={'Your Pax Romana devices'}
      open={open}
      onClose={onClose}
      footer={renderFooter()}
    >
      {renderContent()}
    </Modal>
  );
};

export { DevicesModal };
