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
export default function CustomSheet({ title,children }: Props) {
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
              minSize={20}
            >
              <motion.div
                key="inner-modal"
                initial={{ opacity: 0, x: -200 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1.5, type: "spring" }}
                exit={{ opacity: 0 }}
                className="relative h-screen min-h-full overflow-auto border-r modalBgImage rounded-r-2xl"
              >
                <div className="sticky top-0 right-0 z-20 flex items-center justify-between gap-5 px-4 py-2 text-xl font-bold bg-gray-500 ">
                  <div>
                    <span className="text-white uppercase">{title}</span>
                  </div>
                  <div className="flex gap-4 px-2 py-2 text-white rounded-full hover:bg-red-500">
                    <div
                      className="font-bold duration-500 ease-in-out cursor-pointer hover:scale-125 "
                      onClick={handleCloseModal}
                    >
                      <VscChromeClose />
                    </div>
                  </div>
                </div>
                <div className="pt-5">{children}</div>
              </motion.div>
            </ResizablePanel>
            <ResizableHandle
              withHandle
              className="duration-500 ease-in-out bg-transparent border-none"
            />
            <ResizablePanel
              minSize={5}
              onClick={handleCloseModal}
              className="transition-all duration-300 ease-in-out"
            ></ResizablePanel>
          </ResizablePanelGroup>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
