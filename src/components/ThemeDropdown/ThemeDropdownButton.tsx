import { useThemeContext } from '@/state/hooks';
import { FormatPainterFilled } from '@ant-design/icons';
import { Button, Dropdown, MenuProps, Tooltip } from 'antd';

const ThemeDropdownButton = () => {
  const { theme, setTheme } = useThemeContext();

  const items: MenuProps['items'] = [
    {
      key: 'light',
      label: 'Light',
      onClick: () => {
        setTheme('light');
      },
    },
    {
      key: 'dark',
      label: 'Dark',
      onClick: () => {
        setTheme('dark');
      },
    },
    {
      key: 'auto',
      label: 'System',
      onClick: () => {
        setTheme('system');
      },
    },
  ];

  const handleSelectMode = () => {
    if (theme === 'system') {
      return 'system';
    }
    if (theme === 'light') {
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
