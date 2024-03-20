// "use client"
import React from "react";
// import { ThemeContext } from "../context";
import { VscColorMode, VscCircleLarge } from "react-icons/vsc";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { getTabStyle, getSalesStyle, useThemeStore } from "@/lib/store";

export default function Settings() {
  const { darkMode, lightMode } = useThemeStore.getState();

  const setDarkMode = () => {
    darkMode();
  };

  const setLightMode = () => {
    lightMode();
  };

  // useThemeStore.setState({ tabsBgColor: "#1c1c1c" });

  return (
    <div style={getTabStyle()} className="h-full py-5 ">
      {/* <div className="px-2 overflow-x-hidden ">
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
      </div> */}
      <div className="flex justify-between flex-wrap font-bold pb-4 hover:[&>*]:scale-115">
        <div className="flex items-center gap-2" onClick={setLightMode}>
          <label>Light mode</label>
          <VscCircleLarge className="text-2xl md:text-3xl" />
        </div>
        <div className="flex items-center gap-2" onClick={setDarkMode}>
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
            value={useThemeStore((state) => state.tabsBgColor)}
            onChange={(e) =>
              useThemeStore.setState({ tabsBgColor: e.target.value })
            }
          />
        </div>
        <div className="themCardStyle">
          <label className="mr-2">Tabs text:</label>
          <input
            type="color"
            value={useThemeStore((state) => state.tabsColor)}
            onChange={(e) =>
              useThemeStore.setState({ tabsColor: e.target.value })
            }
          />
        </div>
        <div className="themCardStyle">
          <label className="mr-2">Sales bg:</label>
          <input
            type="color"
            value={useThemeStore((state) => state.salesBgColor)}
            onChange={(e) =>
              useThemeStore.setState({ salesBgColor: e.target.value })
            }
          />
        </div>

        <div className="themCardStyle">
          <label className="mr-2">View text:</label>
          <input
            type="color"
            value={useThemeStore((state) => state.salesColor)}
            onChange={(e) =>
              useThemeStore.setState({ salesColor: e.target.value })
            }
          />
        </div>

        {/* <div className="themCardStyle">
          <label className="mr-2">Button Color:</label>
          <input
            type="color"
            value={tertiary}
            onChange={(e) => handleColorChange("tertiary", e.target.value)}
          />
        </div> */}

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
