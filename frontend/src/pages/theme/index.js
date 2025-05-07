import { createTheme } from '@mui/material/styles';

// Color Scheme:
// Primary color: #2c3e50 (dark blue-gray)
// Secondary color: #3498db (bright blue)
// Accent color: #1abc9c (teal)
// Warning color: #e74c3c (red)
// Light color: #ecf0f1 (off-white)
// Dark color: #2c3e50 (same as primary)

const theme = createTheme({
  palette: {
    primary: {
      main: '#1abc9c', // Using accent teal as primary action color
      light: '#48dbbd',
      dark: '#16a085',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#3498db', // Bright blue
      light: '#5dade2',
      dark: '#2980b9',
      contrastText: '#ffffff',
    },
    error: {
      main: '#e74c3c', // Red
      light: '#eb6b5e',
      dark: '#c0392b',
      contrastText: '#ffffff',
    },
    warning: {
      main: '#f39c12', // Amber
      light: '#f5b041',
      dark: '#d68910',
      contrastText: '#ffffff',
    },
    info: {
      main: '#3498db', // Same as secondary
      light: '#5dade2',
      dark: '#2980b9',
      contrastText: '#ffffff',
    },
    success: {
      main: '#2ecc71', // Green
      light: '#58d68d',
      dark: '#27ae60',
      contrastText: '#ffffff',
    },
    text: {
      primary: '#2c3e50', // Dark blue-gray
      secondary: '#7f8c8d', // Medium gray
      disabled: '#bdc3c7', // Light gray
    },
    background: {
      default: '#f5f5f5', // Light gray background
      paper: '#ffffff', // White
    },
    divider: 'rgba(0, 0, 0, 0.1)',
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
      lineHeight: 1.2,
      color: '#2c3e50',
    },
    h2: {
      fontWeight: 700,
      fontSize: '2rem',
      lineHeight: 1.2,
      color: '#2c3e50',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
      lineHeight: 1.2,
      color: '#2c3e50',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
      lineHeight: 1.2,
      color: '#2c3e50',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
      lineHeight: 1.2,
      color: '#2c3e50',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1rem',
      lineHeight: 1.2,
      color: '#2c3e50',
    },
    subtitle1: {
      fontWeight: 500,
      fontSize: '1rem',
      lineHeight: 1.5,
      color: '#34495e',
    },
    subtitle2: {
      fontWeight: 500,
      fontSize: '0.875rem',
      lineHeight: 1.57,
      color: '#7f8c8d',
    },
    body1: {
      fontWeight: 400,
      fontSize: '1rem',
      lineHeight: 1.5,
      color: '#2c3e50',
    },
    body2: {
      fontWeight: 400,
      fontSize: '0.875rem',
      lineHeight: 1.43,
      color: '#7f8c8d',
    },
    button: {
      fontWeight: 500,
      fontSize: '0.875rem',
      lineHeight: 1.75,
      textTransform: 'none',
      letterSpacing: '0.02em',
    },
    caption: {
      fontWeight: 400,
      fontSize: '0.75rem',
      lineHeight: 1.66,
      color: '#95a5a6',
    },
    overline: {
      fontWeight: 400,
      fontSize: '0.75rem',
      lineHeight: 2.66,
      textTransform: 'uppercase',
      letterSpacing: '0.08em',
      color: '#95a5a6',
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          textTransform: 'none',
          fontWeight: 500,
        },
        containedPrimary: {
          boxShadow: '0 4px 10px rgba(26, 188, 156, 0.3)',
          '&:hover': {
            boxShadow: '0 6px 15px rgba(26, 188, 156, 0.4)',
          },
        },
        outlinedPrimary: {
          borderColor: '#1abc9c',
          '&:hover': {
            backgroundColor: 'rgba(26, 188, 156, 0.04)',
          },
        },
        textPrimary: {
          '&:hover': {
            backgroundColor: 'rgba(26, 188, 156, 0.04)',
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: 'rgba(26, 188, 156, 0.04)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.08)',
        },
        elevation1: {
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.08)',
        },
        elevation2: {
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.08)',
          borderRadius: 8,
          overflow: 'hidden',
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: '24px',
          '&:last-child': {
            paddingBottom: '24px',
          },
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          '&.Mui-selected': {
            backgroundColor: 'rgba(26, 188, 156, 0.1)',
            '&:hover': {
              backgroundColor: 'rgba(26, 188, 156, 0.15)',
            },
          },
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.03)',
          },
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          color: '#7f8c8d',
          minWidth: 40,
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          color: '#ffffff',
          backgroundColor: '#3498db',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 4,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#3498db',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#1abc9c',
            },
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 12,
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#2c3e50',
        },
      },
    },
  },
});

export default theme;