import { ConfigProvider, theme } from 'antd';

import { PageLayout } from './Layout';
import MainContent from './components/MainContent';
import { ThemeColor } from './types';

const getTheme = (color: ThemeColor) => {
  if (color === 'light') return theme.defaultAlgorithm;
  return theme.darkAlgorithm;
};

function App() {
  return (
    <ConfigProvider theme={{ algorithm: getTheme('dark') }}>
      <PageLayout>
        <MainContent />
      </PageLayout>
    </ConfigProvider>
  );
}

export default App;
