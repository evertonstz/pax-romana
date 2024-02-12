import { ToolFilled } from '@ant-design/icons';
import { Button, Tooltip } from 'antd';
import { useState } from 'react';

import SettingsModal from './SettingsModal';

const SettingsButton = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <SettingsModal open={open} onClose={() => setOpen(false)} />
      <Tooltip title="Settings">
        <Button
          type="primary"
          shape="circle"
          icon={<ToolFilled />}
          onClick={() => setOpen(true)}
        />
      </Tooltip>
    </>
  );
};

export default SettingsButton;
