"use client"
import { createContext, useEffect, useState } from "react";
import "./globals.css";
import "./custom.css";
import NextTopLoader from "nextjs-toploader";

export const ThemeContext = createContext({});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

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
    <html lang="en">
      <body>
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

        <ThemeContext.Provider
          value={{ tabsStyle, viewStyle, change, setChange }}
        >
          {/* <Component {...pageProps} /> */}
        {children}
        </ThemeContext.Provider>
      </body>
    </html>
  );
}
