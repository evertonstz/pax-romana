import { useWindowSize } from '@uidotdev/usehooks';
import { theme } from 'antd';
import { ReactNode, useEffect, useState } from 'react';

interface Props {
  children?: ReactNode;
  header?: ReactNode;
}

const ResizableSquare = ({ children, header }: Props) => {
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

  const headerStyles = {
    fontSize: '1.5em',
    fontWeight: 'bold',
    marginBottom: '1em',
  };

  return (
    <div style={squareStyles}>
      <div style={headerStyles}>{header}</div>
      {children}
    </div>
  );
};

export default ResizableSquare;
