import React, { useState } from "react";
import SplitPane, { Pane } from "split-pane-react";
import "split-pane-react/esm/themes/default.css";
import RightMenu from "./right-menu";
import  LeftMenu from "./left-menu";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [vertical, setVertical] = useState<(number | string | string)[]>([
    "20%",
    "auto",
    "20%",
  ]);

  const layoutCSS = {
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  return (
    <>
      <div className="h-screen">
        <SplitPane
          split="vertical"
          sizes={vertical}
          onChange={setVertical}
          style={{ "--pane-min-width": "5%" } as React.CSSProperties} //note this is not working yet
          sashRender={() => <div className="sash" />}
        >
          <Pane className="bg-primary text-primary_text">
            <LeftMenu setVertical={setVertical} />
          </Pane>
          <Pane style={{ ...layoutCSS }} className="bg-secondary">
            <div>
              <div>Center-line</div>
              <div>Center-line</div>
              <button onClick={() => setVertical(["20%", "auto", "10%"])}>
                {" "}
                Hide right
              </button>
            </div>
          </Pane>

          <Pane className="bg-gray-300">
            <RightMenu />
          </Pane>
        </SplitPane>
      </div>
    </>
  );
}
