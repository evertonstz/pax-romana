import DevicesModal from '../DevicesModal';
import ResizableSquare from './ResizableSquare';
import { SUPPORTED_DEVICES } from './constants';

export const NoSelectedDevice = () => {
  return (
    <>
      <DevicesModal
        open={true}
        devices={SUPPORTED_DEVICES}
        defaultDevice={SUPPORTED_DEVICES[0]}
      ></DevicesModal>
      <ResizableSquare>{null}</ResizableSquare>
    </>
  );
};
