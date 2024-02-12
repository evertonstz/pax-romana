import { useWindowSize } from '@uidotdev/usehooks';
import { Modal as AntdModal, Drawer } from 'antd';

export interface ModalProps {
  title?: string;
  open?: boolean;
  onClose?: () => void;
  footer?: React.ReactNode;
  children?: React.ReactNode;
}

const Modal = ({ title, open, onClose, footer, children }: ModalProps) => {
  const { width } = useWindowSize();
  const isSmallScreen = !width ? false : width < 550;

  if (isSmallScreen) {
    return (
      <Drawer
        title={title}
        open={open}
        height={'100vh'}
        onClose={onClose}
        placement="bottom"
        footer={footer}
      >
        {children}
      </Drawer>
    );
  }

  return (
    <AntdModal title={title} open={open} onCancel={onClose} footer={footer}>
      {children}
    </AntdModal>
  );
};

export default Modal;
