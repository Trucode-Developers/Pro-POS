"use client";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { VscGear } from "react-icons/vsc";
import Settings from "./settings";
import { ThemeContext } from "../context";
import { useContext } from "react";

export function SettingsModal() {
  const getTheme: any = useContext(ThemeContext);
  return (
    <Sheet>
      <SheetTrigger asChild>
        <VscGear className="text-xl" />
      </SheetTrigger>
      <SheetContent
        side="left"
        style={getTheme.tabsStyle}
        className="overflow-auto border-none"
      >
        <SheetHeader>
          <h2 className="text-lg md:text-xl lg:text-2xl">Settings</h2>
          <p>Make changes to your settings here</p>
        </SheetHeader>
        <div>
          <Settings />
        </div>
      </SheetContent>
    </Sheet>
  );
}
