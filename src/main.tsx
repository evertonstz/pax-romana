import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App.tsx';
import './index.css';
import { PaxProvider, ThemeProvider } from './state';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <PaxProvider>
        <App />
      </PaxProvider>
    </ThemeProvider>
  </React.StrictMode>,
);
