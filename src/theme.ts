import { createTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors';
import { esES } from '@mui/material/locale';

// A custom theme for this app
const theme = createTheme({
  palette: {
    primary: {
      main: '#402c70',//'#556cd6',
      light: '#666ab3',
      contrastText: '#fff',

    },
    secondary: {
      main: '#666ab3',//'#19857b',
      contrastText: '#2c2d30',
    },
    error: {
      main: red.A400,
    },
  },
}, esES);

export default theme;
