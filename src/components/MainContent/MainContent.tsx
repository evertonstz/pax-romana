import { useDevicesLocalStorage } from '@/hooks';
import { Pax } from '@/pax';

import DevicesModal from '../DevicesModal';
import { NoSelectedDevice } from './NoSelectedDevice';
import { SelectedDevice } from './SelectedDevice';

const MainContent = () => {
  const deviceStore = useDevicesLocalStorage();

  const renderDevicesContent = (
    currentDevice: Pax.lib.PaxSerial | undefined,
  ) => {
    return !currentDevice ? (
      <NoSelectedDevice />
    ) : (
      <SelectedDevice currentDevice={currentDevice} />
    );
  };

  return (
    <>
      <DevicesModal />
      {renderDevicesContent(deviceStore.currentDevice)}
    </>
  );
};

export default MainContent;
