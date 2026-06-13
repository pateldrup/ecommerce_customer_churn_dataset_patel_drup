import React, { useMemo, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

export const ThemeContext = ({ children }) => {
  const currentTheme = useSelector((state) => state.ui.theme);

  // Sync Tailwind class on load
  useEffect(() => {
    if (currentTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [currentTheme]);

  const theme = useMemo(() => {
    return createTheme({
      palette: {
        mode: currentTheme,
        primary: {
          main: '#6366f1', // Indigo 500
          light: '#818cf8',
          dark: '#4f46e5',
        },
        secondary: {
          main: '#10b981', // Emerald 500
        },
        background: {
          default: currentTheme === 'dark' ? '#090d16' : '#f8fafc',
          paper: currentTheme === 'dark' ? '#0f172a' : '#ffffff',
        },
        text: {
          primary: currentTheme === 'dark' ? '#f8fafc' : '#0f172a',
          secondary: currentTheme === 'dark' ? '#94a3b8' : '#475569',
        },
        divider: currentTheme === 'dark' ? '#334155' : '#e2e8f0',
      },
      typography: {
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
        button: {
          textTransform: 'none',
          borderRadius: '12px',
        },
      },
      shape: {
        borderRadius: 12,
      },
      components: {
        MuiButton: {
          styleOverrides: {
            root: {
              borderRadius: '12px',
              fontWeight: 600,
              padding: '8px 16px',
            },
          },
        },
        MuiDialog: {
          styleOverrides: {
            paper: {
              backgroundImage: 'none',
              borderRadius: '16px',
              border: currentTheme === 'dark' ? '1px solid rgba(51, 65, 85, 0.5)' : '1px solid rgba(226, 232, 240, 0.8)',
            },
          },
        },
        MuiInputBase: {
          styleOverrides: {
            root: {
              borderRadius: '12px',
            },
          },
        },
      },
    });
  }, [currentTheme]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};

export default ThemeContext;
