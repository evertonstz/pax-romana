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
];

const ThemeButton = () => {
  const {
    state: { themeColor },
    actions: { setPageTheme },
  } = useThemeContext();
  return (
    <>
      <Dropdown
        menu={{
          items,
          selectable: true,
          onClick: ({ key }) => setPageTheme(key as ThemeColor),
          selectedKeys: [themeColor],
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

export default ThemeButton;
