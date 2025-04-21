import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2563eb', // blue-600
      light: '#3b82f6', // blue-500
      dark: '#1d4ed8', // blue-700
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#6b7280', // gray-500
      light: '#9ca3af', // gray-400
      dark: '#4b5563', // gray-600
      contrastText: '#ffffff',
    },
    error: {
      main: '#ef4444', // red-500
    },
    background: {
      default: '#f9fafb', // gray-50
      paper: '#ffffff',
    },
    text: {
      primary: '#1f2937', // gray-800
      secondary: '#4b5563', // gray-600
    },
  },
  typography: {
    fontFamily: 'var(--font-geist-sans)',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 700,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 500,
    },
    h6: {
      fontWeight: 500,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '0.375rem', // rounded-md
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
        containedPrimary: {
          backgroundColor: '#2563eb', // blue-600
          '&:hover': {
            backgroundColor: '#1d4ed8', // blue-700
          },
        },
        outlinedPrimary: {
          borderColor: '#3b82f6', // blue-500
          color: '#2563eb', // blue-600
          '&:hover': {
            backgroundColor: '#eff6ff', // blue-50
            borderColor: '#2563eb', // blue-600
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '0.5rem', // rounded-lg
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', // shadow-sm
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '0.5rem', // rounded-lg
        },
      },
    },
  },
});

export default theme; 
