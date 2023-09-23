"use client";
import React, { useState } from "react";
import SplitPane, { Pane } from "split-pane-react";
import "split-pane-react/esm/themes/default.css";
import RightMenu from "./components/right-menu";
import LeftMenu from "./components/left-menu";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [vertical, setVertical] = useState<(number | string | string)[]>([
    "16%",
    "auto",
    "4%",
  ]);

  const layoutCSS = {
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  return (
    <>
      <div className="h-screen bg-gradient-to-b from-primary via-gray-400 to-primary">
        <SplitPane
          split="vertical"
          sizes={vertical}
          onChange={setVertical}
          // style={{ "--pane-min-width": "5%" } as React.CSSProperties} //note this is not working yet
          sashRender={() => <div className="sash" />}
        >
          <Pane className=" text-primary_text">
            <LeftMenu setVertical={setVertical} />
          </Pane>
          <Pane
            style={{ ...layoutCSS }}
            className="p-10 bg-gray-100 rounded-l-3xl "
          >
            <div>{children}</div>
          </Pane>

          <Pane className="bg-gray-300">
            <RightMenu />
          </Pane>
        </SplitPane>
      </div>
    </>
  );
}
