'use client';

import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { DivePlannerProvider } from './contexts/DivePlannerContext';
import theme from './theme';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <DivePlannerProvider>
        {children}
      </DivePlannerProvider>
    </ThemeProvider>
  );
}
