import { PaxProvider, ThemeProvider } from '@/state';
import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App.tsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <PaxProvider>
        <App />
      </PaxProvider>
    </ThemeProvider>
  </React.StrictMode>,
);
