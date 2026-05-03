'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface ThemeContextType {
  isLuxury: boolean;
  toggleLuxury: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isLuxury, setIsLuxury] = useState(false);

  useEffect(() => {
    if (isLuxury) {
      document.documentElement.classList.add('luxury-mode');
    } else {
      document.documentElement.classList.remove('luxury-mode');
    }
  }, [isLuxury]);

  const toggleLuxury = () => setIsLuxury(prev => !prev);

  return (
    <ThemeContext.Provider value={{ isLuxury, toggleLuxury }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
