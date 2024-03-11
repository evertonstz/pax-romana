import AddDeviceFooter from '../AddDeviceFooter';
import { PaxPairing } from '../Graphics';

export const NoSelectedDevice = () => {
  return (
    <div className="mx-auto flex flex-col gap-6 self-center">
      <PaxPairing />
      <AddDeviceFooter />
    </div>
  );
};
