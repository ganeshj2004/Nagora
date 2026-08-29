import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    background: {
      default: '#FFFFFF',
      paper: '#FFFFFF',
      subtle: '#F8FAFC',
      navyDark: '#0A1128',
      cardHover: '#FAF5FF',
    },
    primary: {
      main: '#0A1128', // Deep Navy
      light: '#1E293B',
      dark: '#030712',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#7C3AED', // Royal Purple
      light: '#A78BFA',
      dark: '#581C87',
      contrastText: '#FFFFFF',
    },
    accent: {
      main: '#D4AF37', // Metallic Gold
      light: '#F59E0B',
      dark: '#B8860B',
    },
    text: {
      primary: '#0A1128', // Deep Navy
      secondary: '#475569', // Charcoal Gray
      muted: '#94A3B8',
    },
    divider: '#E2E8F0',
  },
  typography: {
    fontFamily: '"Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    h1: {
      fontWeight: 800,
      fontSize: 'clamp(2.5rem, 5vw, 4rem)',
      lineHeight: 1.1,
      letterSpacing: '-0.02em',
      color: '#0A1128',
    },
    h2: {
      fontWeight: 800,
      fontSize: 'clamp(2rem, 4vw, 3rem)',
      lineHeight: 1.15,
      letterSpacing: '-0.015em',
      color: '#0A1128',
    },
    h3: {
      fontWeight: 700,
      fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
      lineHeight: 1.2,
      letterSpacing: '-0.01em',
      color: '#0A1128',
    },
    h4: {
      fontWeight: 700,
      fontSize: '1.5rem',
      lineHeight: 1.3,
      color: '#0A1128',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
      lineHeight: 1.4,
    },
    h6: {
      fontWeight: 600,
      fontSize: '1rem',
      lineHeight: 1.4,
    },
    subtitle1: {
      fontSize: '1.125rem',
      lineHeight: 1.6,
      color: '#475569',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.7,
      color: '#334155',
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
      color: '#64748B',
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
      letterSpacing: '0.01em',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 50,
          padding: '12px 28px',
          fontSize: '0.95rem',
          boxShadow: 'none',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            boxShadow: '0 10px 25px -5px rgba(124, 58, 237, 0.25)',
            transform: 'translateY(-2px)',
          },
        },
        containedPrimary: {
          backgroundColor: '#0A1128',
          color: '#FFFFFF',
          '&:hover': {
            backgroundColor: '#1E293B',
          },
        },
        containedSecondary: {
          backgroundColor: '#7C3AED',
          color: '#FFFFFF',
          '&:hover': {
            backgroundColor: '#6B21A8',
          },
        },
        outlinedPrimary: {
          borderColor: '#0A1128',
          color: '#0A1128',
          borderWidth: '1.5px',
          '&:hover': {
            borderColor: '#7C3AED',
            backgroundColor: 'rgba(124, 58, 237, 0.04)',
            borderWidth: '1.5px',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
          border: '1px solid #F1F5F9',
          transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          borderRadius: 8,
        },
      },
    },
  },
});

export default theme;
