import { useWindowSize } from '@uidotdev/usehooks';
import { theme } from 'antd';
import { ReactNode, useEffect, useState } from 'react';

type Props = {
  children: ReactNode;
};

const ResizableSquare = ({ children }: Props) => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const { token } = theme.useToken();
  const { width, height } = useWindowSize();

  useEffect(() => {
    if (width !== null && height !== null) {
      setIsFullScreen(width < 700);
    }
  }, [width, height]);

  const squareStyles = {
    width: isFullScreen ? '100%' : '600px',
    height: isFullScreen ? '100%' : '600px',
    backgroundColor: token.colorBgContainer,
    border: isFullScreen ? '' : `2px solid ${token.colorBorder}`,
    borderRadius: isFullScreen ? '0%' : token.borderRadiusLG,
    boxShadow: isFullScreen ? '' : token.boxShadow,
  };

  return <div style={squareStyles}>{children}</div>;
};

export default ResizableSquare;
