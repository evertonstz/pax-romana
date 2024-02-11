import { useDevicesLocalStorage } from '@/hooks';
import { Pax } from '@/pax';
import { CheckCircleTwoTone } from '@ant-design/icons';
import { Avatar, Button, Card, Popconfirm } from 'antd';
import Meta from 'antd/es/card/Meta';

interface DeviceCardProps {
  serial: Pax.lib.PaxSerial;
}

const DeviceCard = ({ serial }: DeviceCardProps) => {
  const { popFromStore, saveCurrentDevice, currentDevice } =
    useDevicesLocalStorage();

  const buildDeleteButton = () => {
    return (
      <Popconfirm
        title={`Delete ${serial.device} ${serial.serial}?`}
        description="Are you sure to delete this device?"
        onConfirm={() => popFromStore(serial)}
        okText="Yes"
        cancelText="No"
      >
        <Button danger style={{ width: '80px' }}>
          Delete
        </Button>
      </Popconfirm>
    );
  };

  const buildSelectButton = () => {
    const buttomDisabled = selectButtonDisabled();
    return (
      <Button
        onClick={() => saveCurrentDevice(serial)}
        disabled={buttomDisabled}
        style={{ width: '80px' }}
      >
        {buttomDisabled ? <CheckCircleTwoTone /> : 'Select'}
      </Button>
    );
  };

  const selectButtonDisabled = () => {
    return (
      currentDevice !== undefined &&
      currentDevice.device === serial.device &&
      currentDevice.serial === serial.serial
    );
  };

  return (
    <Card
      actions={[buildSelectButton(), buildDeleteButton()]}
      style={{ minHeight: '155px' }}
    >
      <Meta
        avatar={
          // TODO add Pax picture
          <Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=1" />
        }
        title={serial.device}
        description={serial.serial}
      />
    </Card>
  );
};

export default DeviceCard;
