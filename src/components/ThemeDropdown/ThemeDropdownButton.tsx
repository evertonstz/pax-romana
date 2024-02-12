import { useThemeContext } from '@/state/hooks';
import { ThemeColor } from '@/types';
import { MoonFilled } from '@ant-design/icons';
import { Button, Dropdown, MenuProps, Tooltip } from 'antd';

const items: MenuProps['items'] = [
  {
    key: 'light',
    label: 'Light',
  },
  {
    key: 'dark',
    label: 'Dark',
  },
  {
    key: 'auto',
    label: 'System',
  },
];

const ThemeDropdownButton = () => {
  const {
    state: { mode },
    actions: { setThemeMode },
  } = useThemeContext();
  return (
    <>
      <Dropdown
        menu={{
          items,
          selectable: true,
          onClick: ({ key }) => setThemeMode(key as ThemeColor),
          selectedKeys: [mode],
        }}
        placement="bottomLeft"
        trigger={['click']}
      >
        <a onClick={e => e.preventDefault()}>
          <Tooltip title="Settings">
            <Button type="default" shape="circle" icon={<MoonFilled />} />
          </Tooltip>
        </a>
      </Dropdown>
    </>
  );
};

export default ThemeDropdownButton;
