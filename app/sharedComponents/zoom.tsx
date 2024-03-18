import React, { useContext } from "react";
import { VscZoomIn, VscZoomOut } from "react-icons/vsc";
import { ThemeContext } from "../context"; 
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function Zoom({ className }: any) {
    
  const theme: any = useContext(ThemeContext);
  
  const handleZoomIn = () => {
    if(theme.fontSize <=50){
        theme.setFontSize(theme.fontSize + 1);
    }
  };
  const handleZoomOut = () => {
    if(theme.fontSize >=10){
        theme.setFontSize(theme.fontSize - 1);
    }
  };

  return (
    <div className={`uppercase px-2 ${className}`}>
      <div
        className="cursor-pointer hover:text-yellow-500"
        onClick={handleZoomOut}
      >
        <VscZoomOut />
      </div>
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
