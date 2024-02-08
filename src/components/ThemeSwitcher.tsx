import { MoonFilled, SunFilled } from '@ant-design/icons';
import { useLocalStorage } from '@uidotdev/usehooks';
import { Switch, Tooltip } from 'antd';
import { useEffect } from 'react';

import useAppContext from '../state/hooks/useAppContext';
import { setPageTheme } from '../state/paxState/actions';
import { Theme } from '../state/paxState/types';

const LOCAL_STORAGE_THEME_NAME = 'appTheme';

const ThemeSwitcher = () => {
  const { state, dispatch } = useAppContext();
  const [localPageTheme, saveLocalPageTheme] = useLocalStorage<Theme>(
    LOCAL_STORAGE_THEME_NAME,
    'light',
  );

  useEffect(() => {
    if (state.pageTheme !== localPageTheme) {
      setPageTheme(dispatch, localPageTheme);
    }
  }, [dispatch, localPageTheme, state.pageTheme]);

  const handleSwitchOnChange = (checked: boolean): void => {
    const setTheme = (theme: Theme) => {
      saveLocalPageTheme(theme);
      setPageTheme(dispatch, theme);
    };
    if (checked) {
      setTheme('light');
      return;
    }
    setTheme('dark');
  };

  const toolTipText = `Set ${state.pageTheme === 'light' ? 'dark' : 'light'} theme`;

  return (
    <Tooltip title={toolTipText}>
      <Switch
        checkedChildren={<SunFilled />}
        unCheckedChildren={<MoonFilled />}
        onChange={handleSwitchOnChange}
        value={state.pageTheme === 'light' ? true : false}
      />
    </Tooltip>
  );
};

export default ThemeSwitcher;
