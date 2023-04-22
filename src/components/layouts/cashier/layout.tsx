import { useEffect, useState } from "react";
import SplitPane, { Pane } from "split-pane-react";
import "split-pane-react/esm/themes/default.css";
//icons
import {
  VscCloud,
  VscAccount,
  VscLayoutPanelOff,
  VscLayoutPanel,
  VscLayoutSidebarRightOff,
  VscLayoutSidebarRight,
} from "react-icons/vsc";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [vertical, setVertical] = useState<(number | string)[]>([
    "auto",
    "25%",
  ]);
  const [sizes, setSizes] = useState<(number | string)[]>(["70%", "auto"]);
  // const [sizes1, setSizes1] = useState<(number | string)[]>(["20%", "auto"]);
  const [sizes2, setSizes2] = useState<(number | string)[]>(["auto", "30%"]);

  const layoutCSS = {
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

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
  //a function to close the left side
  const closeAndOpenRight = () => {
    if (isRightOpen) {
      setVertical(["auto", "0.2%"]);
      setIsRightOpen(false);
    } else {
      setVertical(["auto", "25%"]);
      setIsRightOpen(true);
    }
  };
  //a function to open and close the panel
  const closeAndOpenPanel = () => {
    if (isPanelOpen) {
      setSizes(["auto", "0.2%"]);
      setIsPanelOpen(false);
    } else {
      setSizes(["70%", "auto"]);
      setIsPanelOpen(true);
    }
  };

  return (
    <>
      <div className="h-[95vh]">
        <div
          className="h-[5vh] flex justify-between items-center px-4"
          style={{ backgroundColor, color: textColor }}
        >
          <div> this is the upper nav</div>
          <div className="flex gap-4 [&>*]:cursor-pointer">
            {isPanelOpen ? (
              <VscLayoutPanelOff onClick={closeAndOpenPanel} />
            ) : (
              <VscLayoutPanel onClick={closeAndOpenPanel} />
            )}
            {isRightOpen ? (
              <VscLayoutSidebarRightOff onClick={closeAndOpenRight} />
            ) : (
              <VscLayoutSidebarRight onClick={closeAndOpenRight} />
            )}
            <VscCloud />
            <VscAccount />
          </div>
        </div>
        <SplitPane
          split="vertical"
          sizes={vertical}
          onChange={setVertical}
          sashRender={() => <div className="sash" />}
        >
          <SplitPane
            split="horizontal"
            sizes={sizes}
            onChange={setSizes}
            sashRender={() => <div className="sash" />}
          >
            <Pane style={{background: "#d5d7d9" }}>
              <main>{children}</main>
            </Pane>
            <SplitPane
              sizes={sizes2}
              onChange={setSizes2}
              sashRender={() => <div className="sash" />}
            >
              <Pane style={{ ...layoutCSS, background: "#a1a5a9" }}>
                Bottom Pane2
              </Pane>
              <Pane style={{ ...layoutCSS, background: "#c0c3c6" }}>
                Bottom Pane111
              </Pane>
              {/* <Pane style={{ ...layoutCSS, background: "#c0c3c6" }}>
                Bottom Pane3
              </Pane> */}
            </SplitPane>
          </SplitPane>
          <Pane style={{ ...layoutCSS, background: "#a1a5a9" }}>
            <div>left side</div>
          </Pane>
        </SplitPane>
      </div>
    </>
  );
}
