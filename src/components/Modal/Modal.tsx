import { useWindowSize } from '@uidotdev/usehooks';

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '../ui/drawer';

export interface ModalProps {
  title?: string;
  open?: boolean;
  onOpenChange?: () => void;
  footer?: React.ReactNode;
  children?: React.ReactNode;
}

const Modal = ({ title, open, onOpenChange, footer, children }: ModalProps) => {
  const { width } = useWindowSize();
  const isSmallScreen = !width ? false : width < 768;

  if (isSmallScreen) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange} shouldScaleBackground>
        <DrawerContent>
          <DrawerHeader className="text-center">
            <DrawerTitle>{title}</DrawerTitle>
          </DrawerHeader>
          <div className="px-4">{children}</div>
          <DrawerFooter className="pt-4">{footer}</DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-center">{title}</DialogTitle>
        </DialogHeader>
        {children}
        <DialogFooter>{footer}</DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
