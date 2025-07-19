
"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type Theme = "theme-cafe-literario" | "theme-jardin-secreto" | "dark";

const defaultTheme: Theme = "theme-cafe-literario";

interface ThemeProviderProps {
  children: ReactNode;
}

interface ThemeProviderState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeProviderContext = createContext<ThemeProviderState | undefined>(undefined);

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      try {
        return (localStorage.getItem("lienzo-theme") as Theme) || defaultTheme;
      } catch (e) {
        console.error("Failed to read theme from localStorage", e);
        return defaultTheme;
      }
    }
    return defaultTheme;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    
    root.classList.remove("theme-cafe-literario", "theme-jardin-secreto", "dark");
    
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.add(theme);
    }
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    try {
      localStorage.setItem("lienzo-theme", newTheme);
      setThemeState(newTheme);
    } catch (e) {
      console.error("Failed to save theme to localStorage", e);
    }
  };

  const value = {
    theme,
    setTheme,
  };

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = (): ThemeProviderState => {
  const context = useContext(ThemeProviderContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
