'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  actualTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY = 'train-booking-theme';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('system');
  const [actualTheme, setActualTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    // Load saved theme or default to system
    const savedTheme = (localStorage.getItem(STORAGE_KEY) as Theme) || 'system';
    setTheme(savedTheme);
    
      const applyTheme = (newTheme: Theme) => {
      const root = document.documentElement;
      
      if (newTheme === 'system') {
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        setActualTheme(systemTheme);
        root.classList.toggle('dark', systemTheme === 'dark');
      } else {
        setActualTheme(newTheme);
        root.classList.toggle('dark', newTheme === 'dark');
      }
    };

    applyTheme(savedTheme);

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') {
        applyTheme('system');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  const handleSetTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem(STORAGE_KEY, newTheme);

    const root = document.documentElement;
    
    if (newTheme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      setActualTheme(systemTheme);
      root.classList.toggle('dark', systemTheme === 'dark');
    } else {
      setActualTheme(newTheme);
      root.classList.toggle('dark', newTheme === 'dark');
    }
  };

  const toggleTheme = () => {
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      handleSetTheme(systemTheme === 'dark' ? 'light' : 'dark');
    } else {
      handleSetTheme(theme === 'dark' ? 'light' : 'dark');
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, actualTheme, setTheme: handleSetTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}