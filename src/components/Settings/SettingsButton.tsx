import { Button } from 'antd';
import { useState } from 'react';

import SettingsModal from './SettingsModal';

const SettingsButton = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <SettingsModal open={open} onClose={() => setOpen(false)} />
      <Button type="primary" onClick={() => setOpen(true)}>
        Settings
      </Button>
    </>
  );
};

export default SettingsButton;
