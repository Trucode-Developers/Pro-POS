import React, { useContext } from "react";
import { VscZoomIn, VscZoomOut } from "react-icons/vsc";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useThemeStore } from "@/lib/store";

export default function Zoom({ className }: any) {
  const { darkMode, lightMode } = useThemeStore.getState();

  // const theme: any = useContext(ThemeContext);
  const font = useThemeStore((state) => state.fontSize);

  const handleZoomIn = () => {
    if (font < 50) {
      useThemeStore.setState({ fontSize: font + 1 });
    }
  };
  const handleZoomOut = () => {
    if (font > 10) {
      useThemeStore.setState({ fontSize: font - 1 });
    }
  };

  const setDarkMode = () => {
    darkMode();
  };

  const setLightMode = () => {
    lightMode();
  };

  return (
    <div
      className={`uppercase px-2 ${className}`}
      style={{ fontSize: `${font}px` }}
    >
      <div
        className="cursor-pointer hover:text-yellow-500"
        onClick={handleZoomOut}
      >
        <VscZoomOut />
      </div>
      <div>{font}</div>
      <div
        className="cursor-pointer hover:text-yellow-500"
        onClick={handleZoomIn}
      >
        <VscZoomIn />
      </div>

      {/* <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild onClick={handleZoomIn}>
           <Button variant="outline">Hover</Button> 
       
          </TooltipTrigger>
          <TooltipContent>
            <p>Zoom In</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider> */}
    </div>
  );
}
