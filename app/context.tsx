"use client"
import { createContext, ReactNode, useEffect, useState } from "react";
import "./globals.css";
import "./custom.css";
import NextTopLoader from "nextjs-toploader";
import { invoke } from "@tauri-apps/api/tauri";

export const ThemeContext = createContext({});

export default function ContextProvider({ children }: { children: ReactNode }) {
  const [change, setChange] = useState(1);

  const [primary, setPrimary] = useState("#1c1c1c");
  const [secondary, setSecondary] = useState("#424242");
  const [secondaryColor, setSecondaryColor] = useState("#ffffff");
  const [tertiary, setTertiary] = useState("#000000");
  const [textColor, setTextColor] = useState("#ffffff");
  const [fontSize, setFontSize] = useState("12");
  const [activeDB, setActiveDB] = useState("postgres");

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

  // Active DB
  const activeDb = async () => {
    try {
      const response = await invoke("current_active_db");
      if (typeof response === "string") {
        setActiveDB(response);
      } else {
        console.error("Response is not a string:", response);
      }
    } catch (error) {
      console.error("Error occurred while fetching active DB:", error);
    }
  };

  // useEffect to call activeDb
  useEffect(() => {
    activeDb();
  }, []);

  return (
    <div
      className={` border-8 ${
        activeDB === "postgres" ? "border-green-500" : "border-red-500"
      }`}
    >
      <ThemeContext.Provider
        value={{ tabsStyle, viewStyle, change, setChange, activeDB }}
      >
        <NextTopLoader
          color="#DEB200"
          initialPosition={0.08}
          crawlSpeed={200}
          height={5}
          crawl={true}
          showSpinner={true}
          easing="ease"
          speed={200}
          shadow="0 0 10px #2299DD,0 0 5px #2299DD"
        />
        {children}
      </ThemeContext.Provider>
    </div>
  );
}
