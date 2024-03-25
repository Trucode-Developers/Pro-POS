'use client";';
import { motion, AnimatePresence } from "framer-motion";
import React, { ReactNode, useEffect, useState } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { closePopUp, useThemeStore } from "@/lib/store";
import { HiArrowsRightLeft } from "react-icons/hi2";
import { VscChromeClose } from "react-icons/vsc";

interface Props {
  children: ReactNode;
  title?: string;
  // canOpen: boolean;
}
export default function CustomSheet({children }: Props) {
  const adminPopUpSize = useThemeStore((state) => state.adminPopUpSize);
  const isPopUpOpen = useThemeStore((state) => state.isPopUpOpen);

  const onLayout = (sizes: number[]) => {
    // console.log(sizes);
    useThemeStore.setState({ adminPopUpSize: sizes });
  };

  const [open, setOpen] = useState(isPopUpOpen);
  const [isCardExpanded, setCardExpansion] = useState(false);

  //   const router = useRouter();
  const openModal = () => {
    useThemeStore.setState({ isPopUpOpen: true });
    // setOpen(true); //called in useEffect
  };
  const handleCloseModal = () => {
    closePopUp();
  };

  //use effect to tract changes in isPopUpOpen
  useEffect(() => {
    setOpen(isPopUpOpen);
  }, [isPopUpOpen]);

  const toggleWidth = () => {
    if (isCardExpanded) {
      useThemeStore.setState({ adminPopUpSize: [40, 60] });
      setCardExpansion(false);
    } else {
      useThemeStore.setState({ adminPopUpSize: [95, 5] });
      setCardExpansion(true);
    }
  };

  //use effect to tract changes in adminPopUpSize
  useEffect(() => {
    // adjust the width of the pop up
  }, [adminPopUpSize]);

  return (
    <AnimatePresence mode="wait">
      {/* <div> */}
        {/* this can be removed as we realise, once the sheet is imported into a page, it can be  opened using global state.
      this makes it easy for us to design the button opeing and closing the page as we like, we can have images, icons , links e.t.c that opens the model */}
        {/* <button
        onClick={() => openModal()}
        className="px-4 py-2 text-white bg-blue-700 border rounded-full"
      >
        {title}
      </button> */}
        {open && (
          <motion.div
            key="main-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, type: "spring" }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[rgba(0,0,0,0.52)] z-[999]"
          >
            <ResizablePanelGroup
              onLayout={onLayout}
              direction="horizontal"
              className="h-screen min-h-screen "
            >
              <ResizablePanel
                onClick={(e) => e.stopPropagation()}
                defaultSize={adminPopUpSize[0]}
                onResize={(size, prevSize) => {
                  // Update adminPopUpSize with the new size
                  // setAdminPopUpSize([size, prevSize]);
                }}
                // defaultSize={40}
                minSize={20}
                // className="relative items-center justify-center min-h-full p-4 bg-gray-200 rounded-r-2xl"
              >
                <motion.div
                  key="inner-modal"
                  initial={{ opacity: 0, x: -200 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 1.5, type: "spring" }}
                  exit={{ opacity: 0 }}
                  className="relative items-center justify-center min-h-full p-4 bg-gray-200 rounded-r-2xl"
                >
                  <div className="absolute top-0 right-0 flex gap-5 px-5 py-4 text-xl font-bold">
                    <div
                      className="duration-500 ease-in-out cursor-pointer hover:scale-125 "
                      onClick={toggleWidth}
                    >
                      <HiArrowsRightLeft />
                    </div>
                    <div
                      className="duration-500 ease-in-out cursor-pointer hover:scale-125 "
                      onClick={handleCloseModal}
                    >
                      <VscChromeClose />
                    </div>
                  </div>
                  <div>{children}</div>
                </motion.div>
              </ResizablePanel>
              <ResizableHandle
                withHandle
                className="duration-500 ease-in-out bg-transparent border-none"
              />
              <ResizablePanel
                // defaultSize={adminSidebarSize[0]}
                // defaultSize={50}
                minSize={5}
                // collapsible={true}
                onClick={handleCloseModal}
                className="transition-all duration-300 ease-in-out"
              >
                {/* left side is totally transparent */}
              </ResizablePanel>
            </ResizablePanelGroup>
          </motion.div>
          // <div
          //   className="fixed inset-0 bg-[rgba(0,0,0,0.7)] z-[999]"
          //   onClick={handleCloseModal}
          // >
          //   <div
          //     ref={cartRef}
          //     onClick={(e) => e.stopPropagation()}
          //     className="w-[80vw] md:w-[80vw] h-full absolute right-0 overflow-y-scroll animate-fade-in "
          //   >
          //     <div className="grid h-full grid-cols-5">
          //       <div>tile</div>
          //       <div>{children}</div>
          //     </div>
          //   </div>
          // </div>
        )}
      {/* </div> */}
    </AnimatePresence>
  );
}
