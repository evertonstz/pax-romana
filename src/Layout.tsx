import { theme } from 'antd';
import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

export const PageLayout = ({ children }: Props) => {
  const { token } = theme.useToken();
  return (
    // <Layout
    //   style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}
    // >
    //   <Content
    //     style={{
    //       flex: '1',
    //       display: 'flex',
    //       justifyContent: 'center',
    //       alignItems: 'center',
    //     }}
    //   >
    //     {children}
    //   </Content>
    //   <Footer style={{ textAlign: 'center', flexShrink: 0 }}>
    //     Ant Design ©{new Date().getFullYear()} Created by Ant UED
    //   </Footer>
    // </Layout>
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: token.colorBgLayout,
      }}
    >
      {children}
    </div>
  );
};
