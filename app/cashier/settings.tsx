// "use client"
import { useContext, useEffect, useState } from "react";
import React from "react";
import { ThemeContext } from "../context";
import { VscColorMode, VscCircleLarge } from "react-icons/vsc";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

export default function Settings() {
  const getTheme: any = useContext(ThemeContext);
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
  }, []);

  const handleColorChange = (colorName: string, newValue: string) => {
    switch (colorName) {
      case "primary":
        setPrimary(newValue);
        localStorage.setItem("primary", newValue);
        reloadTheme();
        break;
      case "secondary":
        setSecondary(newValue);
        localStorage.setItem("secondary", newValue);
        reloadTheme();
        break;
      case "secondaryColor":
        setSecondaryColor(newValue);
        localStorage.setItem("secondaryColor", newValue);
        reloadTheme();
        break;
      case "tertiary":
        setTertiary(newValue);
        localStorage.setItem("tertiary", newValue);
        reloadTheme();
        break;
      case "textColor":
        setTextColor(newValue);
        localStorage.setItem("textColor", newValue);
        reloadTheme();
        break;
      case "fontSize":
        const parsedValue = parseInt(newValue, 10);
        if (!isNaN(parsedValue) && parsedValue >= 12 && parsedValue <= 60) {
          const stringValue = parsedValue.toString();
          setFontSize(stringValue);
          localStorage.setItem("fontSize", stringValue);
        }
        reloadTheme();
        break;
      default:
        break;
    }
  };
  function reloadTheme() {
    getTheme.setChange(getTheme.change + 1);
  }

  //toggle light and dark mode
  function darkThemeLightTheme(mode: string) {
    if (mode == "dark") {
      localStorage.setItem("primary", "#1c1c1c");
      localStorage.setItem("secondary", "#424242");
      localStorage.setItem("secondaryColor", "#ffffff");
      localStorage.setItem("textColor", "#ffffff");
      //set state to reflect on the current input
      setPrimary("#1c1c1c");
      setSecondary("#424242");
      setSecondaryColor("#ffffff");
      setTextColor("#ffffff");
      reloadTheme();
    } else {
      localStorage.setItem("primary", "	#ebebeb");
      localStorage.setItem("secondary", "	#ffffff");
      localStorage.setItem("secondaryColor", "#000000");
      localStorage.setItem("textColor", "#000000");
      setPrimary("#ebebeb");
      setSecondary("#ffffff");
      setSecondaryColor("#000000");
      setTextColor("#000000");
      reloadTheme();
    }
    // reloadTheme();
  }

  return (
    <div style={getTheme.tabsStyle} className="h-full py-5">
      <div className="px-2 overflow-x-hidden ">
        <label className="mr-2">Font Size:</label>
        <Slider
          startPoint={12}
          min={12}
          max={50}
          className="p-5 bg-gray-400"
          value={parseInt(fontSize)}
          defaultValue={12}
          onChange={(e) => {
            handleColorChange("fontSize", e.toString());
          }}
        />
      </div>
      <div className="flex justify-between flex-wrap font-bold pb-4 hover:[&>*]:text-blue-500">
        <div
          className="flex items-center gap-2"
          onClick={(e) => darkThemeLightTheme("light")}
        >
          <label>Light mode</label>
          <VscCircleLarge className="text-2xl md:text-3xl" />
        </div>
        <div
          className="flex items-center gap-2"
          onClick={(e) => darkThemeLightTheme("dark")}
        >
          <label>Dark mode</label>
          <VscColorMode className="text-2xl md:text-3xl" />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 flex-wrap gap-4 [&>*]:w-full truncate">
        <div className="themCardStyle ">
          <label className="mr-2">Tabs bg:</label>
          <input
            type="color"
            className="border border-gray-300 "
            value={primary}
            onChange={(e) => handleColorChange("primary", e.target.value)}
          />
        </div>
        <div className="themCardStyle">
          <label className="mr-2">Tabs text:</label>
          <input
            type="color"
            value={textColor}
            onChange={(e) => handleColorChange("textColor", e.target.value)}
          />
        </div>
        <div className="themCardStyle">
          <label className="mr-2">View bg:</label>
          <input
            type="color"
            value={secondary}
            onChange={(e) => handleColorChange("secondary", e.target.value)}
          />
        </div>

        <div className="themCardStyle">
          <label className="mr-2">View text:</label>
          <input
            type="color"
            value={secondaryColor}
            onChange={(e) =>
              handleColorChange("secondaryColor", e.target.value)
            }
          />
        </div>

        <div className="themCardStyle">
          <label className="mr-2">Button Color:</label>
          <input
            type="color"
            value={tertiary}
            onChange={(e) => handleColorChange("tertiary", e.target.value)}
          />
        </div>

        {/* <div className="themCardStyle">
          <label className="mr-2">Font Size:</label>
          <input
            type="number"
            className="text-blue-500 border border-gray-300 rounded"
            value={fontSize}
            onChange={(e) => handleColorChange("fontSize", e.target.value)}
          />
        </div> */}
      </div>
    </div>
  );
}
