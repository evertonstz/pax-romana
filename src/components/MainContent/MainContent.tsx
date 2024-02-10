import { useDevicesLocalStorage } from '../../hooks';
import { NoSelectedDevice } from './NoSelectedDevice';
import { SelectedDevice } from './SelectedDevice';

const MainContent = () => {
  const deviceStore = useDevicesLocalStorage();

  if (!deviceStore.currentDevice) {
    return <NoSelectedDevice />;
  }

  return <SelectedDevice currentDevice={deviceStore.currentDevice} />;
};

export default MainContent;
