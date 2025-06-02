import React from 'react';
import ReactDOM from 'react-dom';
import './index.css'; // You can create a basic index.css or remove if using MUI baseline
import App from './App';
import { ThemeProvider, CssBaseline } from '@mui/material';
import lightTheme from './theme';

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={lightTheme}>
      <CssBaseline /> {/* MUI's normalization stylesheet */}
      <App />
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
