import { useThemeContext } from '@/state/hooks';
import { ConfigProvider, theme } from 'antd';
import { useCallback } from 'react';

import { PageLayout } from './Layout';
import MainContent from './components/MainContent';
import { ThemeColor } from './types';

function App() {
  const {
    state: { color },
  } = useThemeContext();

  const getTheme = useCallback((color: ThemeColor) => {
    if (color === 'light') return theme.defaultAlgorithm;
  }, []);

  // useEffect(() => {
  //   if (!didInit) {
  //     didInit = true;
  //     // adds event listener for system theme
  //     window
  //       .matchMedia('(prefers-color-scheme: dark)')
  //       .addEventListener('change', (e) => {
  //         console.log('changed!!', e.matches);
  //       });
  //   }
  // }, []);

  return (
    <ConfigProvider theme={{ algorithm: getTheme(color) }}>
      <PageLayout>
        <MainContent />
      </PageLayout>
    </ConfigProvider>
  );
}

export default App;
