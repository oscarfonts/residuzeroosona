import createTheme from '@mui/material/styles/createTheme';

const theme = mode => createTheme({
  palette: {
    mode: mode ? mode : 'light',
    primary: {
      main: '#039a3f',
      contrastText: '#fff',
    },
    secondary: {
      main: '#73cad3',
    },
    text: {
      primary: '#000000',
      secondary: '#746F81',
    }
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        '*::-webkit-scrollbar': {
          width: '0.2em'
        },
        '*::-webkit-scrollbar-track': {
          WebkitBoxShadow: 'inset 0 0 2px rgba(0,0,0,0.00)'
        },
        '*::-webkit-scrollbar-thumb': {
          backgroundColor: 'rgba(0,0,0,.1)',
          outline: '0px solid slategrey'
        }
      }
    }
  }
});

export default theme;
