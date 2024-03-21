"use client";
import React, { useState } from "react";
import SplitPane, { Pane } from "split-pane-react";
import "split-pane-react/esm/themes/default.css";
import RightMenu from "./components/right-menu";
import LeftMenu from "./components/left-menu";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useThemeStore } from "@/lib/store";
interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    const adminSidebarSize = useThemeStore((state) => state.adminSidebarSize);


   const onLayout = (sizes: number[]) => {
    // console.log(sizes);
    useThemeStore.setState({ adminSidebarSize: sizes });
   };

  return (
    <>
      <ResizablePanelGroup
        onLayout={onLayout}
        direction="horizontal"
        className="h-screen min-h-screen bg-gradient-to-b from-primary via-gray-400 to-primary"
      >
        <ResizablePanel
          defaultSize={adminSidebarSize[0]}
          minSize={4}
          collapsible={true}
        >
          <LeftMenu  />
        </ResizablePanel>
        <ResizableHandle withHandle className="bg-transparent border-none" />
        <ResizablePanel
          defaultSize={adminSidebarSize[1]}
          minSize={60}
          className="items-center justify-center min-h-full p-4 bg-gray-200 rounded-l-3xl"
        >
          <div>{children}</div>
        </ResizablePanel>
      </ResizablePanelGroup>
      {/* <div className="h-screen bg-gradient-to-b from-primary via-gray-400 to-primary">
        <SplitPane
          split="vertical"
          sizes={vertical}
          onChange={setVertical}
          sashRender={() => <div className="sash" />}
        >
          <Pane className=" text-primary_text">
            <LeftMenu setVertical={setVertical} />
          </Pane>
          <Pane
            style={{ ...layoutCSS }}
            className="px-2 bg-gray-100 rounded-l-3xl "
          >
            <div>{children}</div>
          </Pane>
        </SplitPane>
      </div> */}
    </>
  );
}
