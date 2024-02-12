import { useThemeContext } from '@/state/hooks';
import { FormatPainterFilled } from '@ant-design/icons';
import { Button, Dropdown, MenuProps, Tooltip } from 'antd';

const ThemeDropdownButton = () => {
  const {
    state: { mode, color },
    actions: { setThemeMode, setThemeColor },
  } = useThemeContext();

  const items: MenuProps['items'] = [
    {
      key: 'light',
      label: 'Light',
      onClick: () => {
        setThemeMode('manual');
        setThemeColor('light');
      },
    },
    {
      key: 'dark',
      label: 'Dark',
      onClick: () => {
        setThemeMode('manual');
        setThemeColor('dark');
      },
    },
    {
      key: 'auto',
      label: 'System',
      onClick: () => {
        setThemeMode('auto');
      },
    },
  ];

  const handleSelectMode = () => {
    if (mode === 'auto') {
      return 'auto';
    }
    if (color === 'light') {
      return 'light';
    }
    return 'dark';
  };

  return (
    <>
      <Dropdown
        menu={{
          items,
          selectable: true,
          selectedKeys: [handleSelectMode()],
        }}
        placement="bottomLeft"
        trigger={['click']}
      >
        <a onClick={e => e.preventDefault()}>
          <Tooltip title="Settings">
            <Button
              type="default"
              shape="circle"
              icon={<FormatPainterFilled />}
            />
          </Tooltip>
        </a>
      </Dropdown>
    </>
  );
};

export default ThemeDropdownButton;
