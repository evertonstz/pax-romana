import { Flex, Row } from 'antd';

import AddDeviceFooter from '../AddDeviceFooter';
import { PaxPairing } from '../Graphics';

export const NoSelectedDevice = () => {
  return (
    <Flex
      style={{ height: '70%' }}
      justify="center"
      align="center"
      gap="middle"
      vertical
    >
      <Row>
        <PaxPairing />
      </Row>
      <Row>
        <AddDeviceFooter />
      </Row>
    </Flex>
  );
};
