import { Modal } from 'antd';

import ThemeSwitcher from './ThemeSwitcher';

export interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
}

export const SettingsModal = ({ open, onClose }: SettingsModalProps) => {
  return (
    <Modal title="Settings" open={open} onCancel={onClose} footer={null}>
      <ThemeSwitcher />{' '}
    </Modal>
  );
};
