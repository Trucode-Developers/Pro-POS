import { useEffect, useState, useContext } from "react";
import SplitPane, { Pane } from "split-pane-react";
import "split-pane-react/esm/themes/default.css";
import { ThemeContext } from "../../../pages/_app";
//icons
import {
  VscCloud,
  VscAccount,
  VscLayoutPanelOff,
  VscLayoutPanel,
  VscLayoutSidebarRightOff,
  VscLayoutSidebarRight,
  VscExclude,
  VscGear,
} from "react-icons/vsc";
import Settings from "./settings";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  
  const getTheme: any = useContext(ThemeContext);
  const [vertical, setVertical] = useState<(number | string)[]>([
    "0.05%",
    "auto",
    "25%",
  ]);
  const [sizes, setSizes] = useState<(number | string)[]>(["70%", "auto"]);
  // const [sizes1, setSizes1] = useState<(number | string)[]>(["20%", "auto"]);
  const [sizes2, setSizes2] = useState<(number | string)[]>(["auto", "30%"]);

  // const leftBorderCSS = {
  //   height: "100%",
  //   borderRight: "5px solid red",
  // };

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
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  //a function to close the left side
  const closeAndOpenRight = () => {
    if (isRightOpen) {
      setVertical(["0.05%","auto", "0.2%"]);
      setIsRightOpen(false);
    } else {
      setVertical(["0.05%","auto", "25%"]);
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
  //a function to open and close the panel
  const closeAndOpenSettings = () => {
    if (isSettingsOpen) {
      setVertical(["0.05%", "auto", "25%"]);
      setIsSettingsOpen(false);
    } else {
      setVertical(["25%","auto", "25%"]);
      setIsSettingsOpen(true);
    }
  };

  return (
    <>
      <div className="h-[95vh]">
        <div
          className="h-[5vh] flex justify-between items-center px-4"
          style={{ backgroundColor, color: textColor }}
        >
          <div className="flex gap-4 justify-center items-center">
            {isSettingsOpen ? (
              <VscExclude onClick={closeAndOpenSettings} />
            ) : (
              <VscGear onClick={closeAndOpenSettings} />
            )}
            <div>Quality service for you !</div>
          </div>
          <div className="flex gap-4 [&>*]:cursor-pointer">
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
          <Pane>
            <Settings />
          </Pane>

          <SplitPane
            split="horizontal"
            sizes={sizes}
            onChange={setSizes}
            sashRender={() => <div className="sash" />}
          >
            <Pane style={(getTheme.viewStyle)}>
              <main>{children}</main>
            </Pane>
            <SplitPane
              sizes={sizes2}
              onChange={setSizes2}
              sashRender={() => <div className="sash" />}
            >
              <Pane style={getTheme.tabsStyle}>Bottom Pane2</Pane>
              <Pane style={getTheme.tabsStyle}>Bottom Pane111</Pane>
            </SplitPane>
          </SplitPane>
          <Pane style={getTheme.tabsStyle}>
            <div>Right side</div>
          </Pane>
        </SplitPane>
      </div>
    </>
  );
}
