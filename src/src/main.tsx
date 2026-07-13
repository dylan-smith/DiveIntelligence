import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { App } from './app/App';
import { ErrorBoundary } from './app/ErrorBoundary';
import { initAppInsights } from './app/application-insights';
import { theme } from './app/theme';
import './app/global.css';

fetch('/assets/config.json')
  .then(response => response.json())
  .then((config: { instrumentationKey: string }) => {
    initAppInsights(config.instrumentationKey);

    createRoot(document.getElementById('root')!).render(
      <StrictMode>
        <ErrorBoundary>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </ThemeProvider>
        </ErrorBoundary>
      </StrictMode>
    );
  })
  .catch(err => console.error(err));
