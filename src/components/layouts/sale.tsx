import React, { useState } from "react";
import SplitPane, { Pane } from "split-pane-react";
import "split-pane-react/esm/themes/default.css";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [vertical, setVertical] = useState<(number | string)[]>([
    "20%",
    "auto",
  ]);
  const [sizes, setSizes] = useState<(number | string)[]>(["70%", "auto"]);
  const [sizes1, setSizes1] = useState<(number | string)[]>(["20%", "auto"]);
  const [sizes2, setSizes2] = useState<(number | string)[]>([
    "50%",
    "auto",
    "20",
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
          sashRender={() => <div className="sash" />}
        >
          <Pane style={{ ...layoutCSS, background: "#a1a5a9" }}>
            <div>left side</div>
          </Pane>
          <SplitPane
            split="horizontal"
            sizes={sizes}
            onChange={setSizes}
            sashRender={() => <div className="sash" />}
          >
            <SplitPane
              sizes={sizes1}
              onChange={setSizes1}
              sashRender={() => <div className="sash" />}
            >
              <Pane style={{ ...layoutCSS, background: "#ddd" }}>
                Top Pane1
              </Pane>
              <Pane style={{ ...layoutCSS, background: "#d5d7d9" }}>
                <main>{children}</main>
              </Pane>
            </SplitPane>
            <SplitPane
              sizes={sizes2}
              onChange={setSizes2}
              sashRender={() => <div className="sash" />}
            >
              <Pane style={{ ...layoutCSS, background: "#c0c3c6" }}>
                Bottom Pane111
              </Pane>
              <Pane style={{ ...layoutCSS, background: "#a1a5a9" }}>
                Bottom Pane2
              </Pane>
              <Pane style={{ ...layoutCSS, background: "#c0c3c6" }}>
                Bottom Pane3
              </Pane>
            </SplitPane>
          </SplitPane>
        </SplitPane>
      </div>
    </>
  );
}
