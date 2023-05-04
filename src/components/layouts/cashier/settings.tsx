import { useContext } from "react";
import { ThemeContext } from "@/components/themeContext";
import React from 'react'



export default function Settings() {
  const { theme, setTheme } = useContext(ThemeContext);

  const toggleTheme = () => {
    // const newTheme = theme === "light" ? "dark" : "light";
    // setTheme(newTheme);
  };

  return (
    <div>
        <div>Setup color picker to change the theme of the application </div>
      <button onClick={toggleTheme}>Toggle Theme</button>
      {/* <h1>Current Theme: {theme}</h1> */}
    </div>
  );
}
