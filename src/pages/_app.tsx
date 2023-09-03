import "@/styles/globals.css";
import "@/styles/custom.css";
import type { AppProps } from "next/app";
import { createContext, useEffect, useState } from "react";
import React from "react";
// import { ThemeContext } from "@/components/themeContext";

export const ThemeContext = createContext({});

export default function App({ Component, pageProps }: AppProps) {
  // const [primary, setPrimary] = useState("#3a55df");
  // const [secondary, setSecondary] = useState("#000000");
  // const [secondaryColor, setSecondaryColor] = useState("#000000");
  // const [tertiary, setTertiary] = useState("#000000");
  // const [textColor, setTextColor] = useState("#000000");
  // const [fontSize, setFontSize] = useState("12");
  const [change, setChange] = useState(1);

  const [primary, setPrimary] = useState("#1c1c1c");
  const [secondary, setSecondary] = useState("#424242");
  const [secondaryColor, setSecondaryColor] = useState("#ffffff");
  const [tertiary, setTertiary] = useState("#000000");
  const [textColor, setTextColor] = useState("#ffffff");
  const [fontSize, setFontSize] = useState("12");

  useEffect(() => {
    const storedPrimary = localStorage.getItem("primary");
    const storedSecondary = localStorage.getItem("secondary");
    const storedSecondaryColor = localStorage.getItem("secondaryColor");
    const storedTertiary = localStorage.getItem("tertiary");
    const storedTextColor = localStorage.getItem("textColor");
    const storedFontSize = localStorage.getItem("fontSize");

    if (storedPrimary) setPrimary(storedPrimary);
    if (storedSecondary) setSecondary(storedSecondary);
    if (storedSecondaryColor) setSecondaryColor(storedSecondaryColor);
    if (storedTertiary) setTertiary(storedTertiary);
    if (storedTextColor) setTextColor(storedTextColor);
    if (storedFontSize) setFontSize(storedFontSize);
  }, [change]);

  const viewStyle = {
    backgroundColor: secondary,
    color: secondaryColor,
    fontSize: `${fontSize}px`,
  };
  const tabsStyle = {
    backgroundColor: primary,
    color: textColor,
    fontSize: `${fontSize}px`,
    borderLeft: `1px dotted lightgray`,
    // borderTop: `1px dotted lightgray`,
  };

  return (
    <ThemeContext.Provider value={{ tabsStyle, viewStyle, change, setChange }}>
      <Component {...pageProps} />
    </ThemeContext.Provider>
  );
}
