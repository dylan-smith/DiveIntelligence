import { createTheme } from '@mui/material/styles';
import { indigo, purple, red, amber } from '@mui/material/colors';

// Mirrors the Angular Material M2 theme from the old styles.scss:
// indigo primary, purple A200 accent, red warn, amber warn-icon color.
export const theme = createTheme({
  palette: {
    primary: {
      main: indigo[500],
    },
    secondary: {
      main: purple.A200,
    },
    error: {
      main: red[500],
    },
    warning: {
      main: amber[500],
    },
  },
  typography: {
    fontFamily: 'Roboto, "Helvetica Neue", sans-serif',
    // Angular Material buttons keep the authored casing
    button: {
      textTransform: 'none',
    },
  },
});
