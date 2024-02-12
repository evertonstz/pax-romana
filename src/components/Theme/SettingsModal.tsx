import { Modal } from 'antd';

import ThemeSwitcher from './ThemeSwitcher';

export interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
}
const SettingsModal = ({ open, onClose }: SettingsModalProps) => {
  return (
    <Modal title="Settings" open={open} onCancel={onClose} footer={null}>
      <ThemeSwitcher />
    </Modal>
  );
};

export default SettingsModal;
