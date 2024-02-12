import { Flex, Row } from 'antd';

import AddDeviceFooter from '../AddDeviceFooter';
import { PaxPairing } from '../Graphics';
import ThemeSwitcher from '../SettingsModal/ThemeSwitcher';
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
          <PaxPairing />
        </Row>
        <Row>
          <AddDeviceFooter />
        </Row>
      </Flex>
    </ResizableSquare>
  );
};
