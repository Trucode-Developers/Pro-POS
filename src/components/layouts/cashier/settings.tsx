import { useContext, useEffect, useState } from "react";
import { ThemeContext } from "@/components/themeContext";
import React from "react";
import Link from "next/link";

export default function Settings() {
  const [primary, setPrimary] = useState("#3a55df");
  const [secondary, setSecondary] = useState("#000000");
  const [tertiary, setTertiary] = useState("#000000");
  const [textColor, setTextColor] = useState("#000000");
  const [fontSize, setFontSize] = useState("12");

  useEffect(() => {
    const storedPrimary = localStorage.getItem("primary");
    const storedSecondary = localStorage.getItem("secondary");
    const storedTertiary = localStorage.getItem("tertiary");
    const storedTextColor = localStorage.getItem("textColor");
    const storedFontSize = localStorage.getItem("fontSize");

    if (storedPrimary) setPrimary(storedPrimary);
    if (storedSecondary) setSecondary(storedSecondary);
    if (storedTertiary) setTertiary(storedTertiary);
    if (storedTextColor) setTextColor(storedTextColor);
    if (storedFontSize) setFontSize(storedFontSize);
  }, []);

  const handleColorChange = (colorName: string, newValue: string) => {
    switch (colorName) {
      case "primary":
        setPrimary(newValue);
        localStorage.setItem("primary", newValue);
        break;
      case "secondary":
        setSecondary(newValue);
        localStorage.setItem("secondary", newValue);
        break;
      case "tertiary":
        setTertiary(newValue);
        localStorage.setItem("tertiary", newValue);
        break;
      case "textColor":
        setTextColor(newValue);
        localStorage.setItem("textColor", newValue);
        break;
      case "fontSize":
        const parsedValue = parseInt(newValue, 10);
        if (!isNaN(parsedValue) && parsedValue >= 12 && parsedValue <= 60) {
          const stringValue = parsedValue.toString();
          setFontSize(stringValue);
          localStorage.setItem("fontSize", stringValue);
        }
        break;
      default:
        break;
    }
  };

  const divStyle = {
    backgroundColor: primary,
    color: textColor,
    fontSize: `${fontSize}px`,
  };

  const themCardStyle = {
    backgroundColor: primary,
    color: textColor,
    fontSize: `${fontSize}px`,
  };

  //populating the views

  return (
    <div style={divStyle} className="h-full p-5">
      <div className="flex flex-wrap gap-4">
        <div className="themCardStyle">
          <label className="mr-2">Primary Color:</label>
          <input
            type="color"
            className="border border-gray-300 "
            value={primary}
            onChange={(e) => handleColorChange("primary", e.target.value)}
          />
        </div>
        <div className="themCardStyle">
          <label className="mr-2">Secondary Color:</label>
          <input
            type="color"
            value={secondary}
            onChange={(e) => handleColorChange("secondary", e.target.value)}
          />
        </div>

        <div className="themCardStyle">
          <label className="mr-2">Tertiary Color:</label>
          <input
            type="color"
            value={tertiary}
            onChange={(e) => handleColorChange("tertiary", e.target.value)}
          />
        </div>

        <div className="themCardStyle">
          <label className="mr-2">Text Color:</label>
          <input
            type="color"
            value={textColor}
            onChange={(e) => handleColorChange("textColor", e.target.value)}
          />
        </div>

        <div className="themCardStyle">
          <label className="mr-2">Font Size:</label>
          <input
            type="number"
            className="border border-gray-300 rounded text-blue-500"
            value={fontSize}
            onChange={(e) => handleColorChange("fontSize", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
