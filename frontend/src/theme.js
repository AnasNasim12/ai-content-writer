import { createTheme } from '@mui/material/styles';

// Define a light theme
const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2', // A standard blue
    },
    secondary: {
      main: '#dc004e', // A standard pink/red
    },
    background: {
      default: '#f4f6f8', // A light grey for the page background
      paper: '#ffffff',   // White for Paper components
    },
    text: {
      primary: '#333333', // Corrected typo: primar to primary
      secondary: '#555555',
    }
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 500,
    },
    h6: {
      fontWeight: 500,
    }
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#1976d2', // Ensure AppBar uses primary color
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8, // Slightly more rounded buttons
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          padding: '16px', // Default padding for Paper components
          borderRadius: 8, // Rounded corners for Paper
        }
      }
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          '&:before': {
            display: 'none', // Remove the default top border on Accordion
          },
          '&$expanded': {
            margin: 'auto', // Control margin when expanded
          },
        },
      },
    },
    MuiAccordionSummary: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid rgba(0, 0, 0, .125)',
          marginBottom: -1,
          minHeight: 56,
          '&$expanded': {
            minHeight: 56,
          },
        },
        content: {
          '&$expanded': {
            margin: '12px 0',
          },
        },
      },
    },
    MuiAccordionDetails: {
      styleOverrides: {
        root: {
          padding: '16px', // Consistent padding
        },
      },
    },
  },
});

export default lightTheme;
