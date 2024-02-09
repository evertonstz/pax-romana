import { MoonFilled, SunFilled } from '@ant-design/icons';
import { Switch, Tooltip } from 'antd';

import useThemeContext from '../state/hooks/useThemeContext';

const ThemeSwitcher = () => {
  const { state, actions } = useThemeContext();

  const toolTipText = `Set ${state.themeColor === 'light' ? 'dark' : 'light'} theme`;

  return (
    <Tooltip title={toolTipText}>
      <Switch
        checkedChildren={<MoonFilled />}
        unCheckedChildren={<SunFilled />}
        onChange={checked =>
          checked ? actions.setPageTheme('light') : actions.setPageTheme('dark')
        }
        value={state.themeColor === 'light' ? true : false}
      />
    </Tooltip>
  );
};

export default ThemeSwitcher;
