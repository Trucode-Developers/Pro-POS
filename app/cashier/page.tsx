"use client";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useEffect, useState } from "react";
import {
  VscAccount,
  VscLayoutPanelOff,
  VscLayoutPanel,
  VscLayoutSidebarRightOff,
  VscLayoutSidebarRight,
} from "react-icons/vsc";
import Sale from "./sale";
import { SettingsModal } from "./settingsSheet";
import Payments from "./payments";
import Queue from "./queue";
import { HiPaperClip, HiRss, HiSignal, HiSignalSlash } from "react-icons/hi2";
import { HiOutlineLink } from "react-icons/hi";
import Zoom from "../../src/components/zoom";
import { getTabStyle, getSalesStyle, useThemeStore } from "@/lib/store";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Page() {
    const activeDB = useThemeStore((state) => state.activeDb);
  // const getTheme: any = useContext(ThemeContext);
  // const salesStyle = getTabStyle();
  //theme
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDarkTheme(mediaQuery.matches);

    const handleChange = (event: any) => setIsDarkTheme(event.matches);
    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  const backgroundColor = isDarkTheme ? "#1a1a1a" : "white";
  const textColor = isDarkTheme ? "white" : "#1a1a1a";

  //closing and opening the left side
  const [isRightOpen, setIsRightOpen] = useState(true);
  const [isPanelOpen, setIsPanelOpen] = useState(true);

  const [isPaymentLeftAligned, setIsPaymentLeftAligned] = useState(true);
  //a function to close the left side
  const closeAndOpenRight = () => {
    if (isRightOpen) {
      setIsRightOpen(false);
    } else {
      setIsRightOpen(true);
    }
  };
  //a function to open and close the panel
  const closeAndOpenPanel = () => {
    if (isPanelOpen) {
      setIsPanelOpen(false);
    } else {
      setIsPanelOpen(true);
    }
  };

  return (
    <div className="h-full">
      <div
        className="flex items-center justify-between px-4 py-2 "
        style={{ backgroundColor, color: textColor }}
      >
        <div className="flex items-center justify-center gap-4">
          <SettingsModal />
          <Zoom className="flex items-center justify-center gap-4 text-xl" />
          <div className="hidden lg:block">Quality service for you !</div>
        </div>
        <div className="flex gap-4 [&>*]:cursor-pointer justify-center items-center">
          {isPanelOpen ? (
            <VscLayoutPanel onClick={closeAndOpenPanel} />
          ) : (
            <VscLayoutPanelOff onClick={closeAndOpenPanel} />
          )}
          {isRightOpen ? (
            <VscLayoutSidebarRight onClick={closeAndOpenRight} />
          ) : (
            <VscLayoutSidebarRightOff onClick={closeAndOpenRight} />
          )}
          <HiSignal
            className={` text-xl animate-pulse ${
              activeDB == "postgres" ? "text-green-500" : "text-red-500"
            }`}
          />
          {/* <HiSignalSlash /> */}
          <HiOutlineLink
            className={` text-md ${
              activeDB == "postgres" ? "text-green-500" : "text-red-500"
            }`}
          />
          <VscAccount />
        </div>
      </div>
      <div className={`h-[calc(100vh-56px)] `}>
        <ResizablePanelGroup direction="horizontal" className="bg-yellow-500">
          <ResizablePanel defaultSize={75} minSize={30}>
            <ResizablePanelGroup direction="vertical">
              <ResizablePanel defaultSize={75} style={getSalesStyle()}>
                <Sale />
                {/* {getTabStyle().backgroundColor} */}
              </ResizablePanel>
              <ResizableHandle withHandle />
              {isPanelOpen && (
                <ResizablePanel
                  defaultSize={25}
                  minSize={10}
                  maxSize={75}
                  collapsible={true}
                  style={getTabStyle()}
                >
                  {isPaymentLeftAligned ? (
                    <Queue
                      setIsPaymentLeftAligned={setIsPaymentLeftAligned}
                      isPaymentLeftAligned={isPaymentLeftAligned}
                    />
                  ) : (
                    <Payments
                      setIsPaymentLeftAligned={setIsPaymentLeftAligned}
                      isPaymentLeftAligned={isPaymentLeftAligned}
                    />
                  )}
                </ResizablePanel>
              )}
            </ResizablePanelGroup>
          </ResizablePanel>

          {isRightOpen && (
            <>
              <ResizableHandle withHandle />
              <ResizablePanel
                defaultSize={25}
                minSize={10}
                maxSize={50}
                collapsible={true}
                style={getTabStyle()}
              >
                {isPaymentLeftAligned ? (
                  <Payments
                    setIsPaymentLeftAligned={setIsPaymentLeftAligned}
                    isPaymentLeftAligned={isPaymentLeftAligned}
                  />
                ) : (
                  <Queue
                    setIsPaymentLeftAligned={setIsPaymentLeftAligned}
                    isPaymentLeftAligned={isPaymentLeftAligned}
                  />
                )}
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
