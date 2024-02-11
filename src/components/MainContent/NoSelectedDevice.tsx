import { Flex, Row } from 'antd';

import AddDeviceFooter from '../DevicesModal/AddDeviceFooter';
import PaxPairingSvg from '../DevicesModal/PaxPairingSvg';
import ThemeSwitcher from '../ThemeSwitcher';
import ResizableSquare from './ResizableSquare';

export const NoSelectedDevice = () => {
  return (
    <ResizableSquare>
      <ThemeSwitcher />
      <Flex
        style={{ height: '70%' }}
        justify="center"
        align="center"
        gap="middle"
        vertical
      >
        <Row>
          <PaxPairingSvg />
        </Row>
        <Row>
          <AddDeviceFooter />
        </Row>
      </Flex>
    </ResizableSquare>
  );
};
