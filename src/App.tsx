import { useThemeContext } from '@/state/hooks';
import { ThemeColor } from '@/state/themeState/types';
import { ConfigProvider, theme } from 'antd';

import { PageLayout } from './Layout';
import MainContent from './components/MainContent';

const getTheme = (color: ThemeColor) => {
  if (color === 'light') return theme.defaultAlgorithm;
  return theme.darkAlgorithm;
};

function App() {
  const { state: themeState } = useThemeContext();

  return (
    <ConfigProvider theme={{ algorithm: getTheme(themeState.themeColor) }}>
      <PageLayout>
        <MainContent />
      </PageLayout>
    </ConfigProvider>
  );
}

export default App;
