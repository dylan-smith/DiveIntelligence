'use client';

import { createTheme } from '@mui/material/styles';
import { indigo, purple, red } from '@mui/material/colors';

const theme = createTheme({
  palette: {
    primary: {
      main: indigo[500],
    },
    secondary: {
      main: purple['A200'],
    },
    error: {
      main: red[500],
    },
    warning: {
      main: '#FFC107',
    },
  },
  typography: {
    fontFamily: 'Roboto, "Helvetica Neue", sans-serif',
  },
});

export default theme;
