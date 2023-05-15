import Link from "next/link";
import React, { useState, useEffect } from "react";

const App = () => {
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
        setFontSize(newValue);
        localStorage.setItem("fontSize", newValue);
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

  return (
    <div>
      <label>Primary Color:</label>
      <input
        type="color"
        value={primary}
        onChange={(e) => handleColorChange("primary", e.target.value)}
      />

      <label>Secondary Color:</label>
      <input
        type="color"
        value={secondary}
        onChange={(e) => handleColorChange("secondary", e.target.value)}
      />

      <label>Tertiary Color:</label>
      <input
        type="color"
        value={tertiary}
        onChange={(e) => handleColorChange("tertiary", e.target.value)}
      />

      <label>Text Color:</label>
      <input
        type="color"
        value={textColor}
        onChange={(e) => handleColorChange("textColor", e.target.value)}
      />
      <label>Font Size:</label>
      <input
        type="number"
        value={fontSize}
        onChange={(e) => handleColorChange("fontSize", e.target.value)}
      />
      <div
        className={`flex justify-center items-center h-[50vh] w-full flex-col gap-2`}
        style={divStyle}
      >
        {primary}
        {/* Rest of your code */}
        <p>This is the body</p>
        <Link href="/">Back home</Link>
      </div>
    </div>
  );
};

export default App;
