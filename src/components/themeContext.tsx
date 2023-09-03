import { createContext, useState, useContext } from "react";

interface ThemeContextType {
  theme: {
    primary: string;
    secondary: string;
    text: string;
    tertiary: string;
  };
  setTheme: (theme: any) => void;
}

const initialThemeContext: ThemeContextType = {
  theme: {
    primary: "#1a1a1a",
    secondary: "#1a1a1a",
    text: "#1a1a1a",
    tertiary: "#1a1a1a",
  },
  setTheme: () => {},
};

export const ThemeContext = createContext(initialThemeContext);
