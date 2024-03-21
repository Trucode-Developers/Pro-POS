'use client";';
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { HiArrowSmLeft } from "react-icons/hi";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useThemeStore } from "@/lib/store";

export default function FadedSec({ title, children }: any) {
  const adminSidebarSize = useThemeStore((state) => state.adminSidebarSize);

  const onLayout = (sizes: number[]) => {
    // console.log(sizes);
    useThemeStore.setState({ adminSidebarSize: sizes });
  };
  const cartRef: any = useRef();

  const [open, setOpen] = useState(false);

  //   const router = useRouter();
  const handleCloseCart = () => {
    setOpen(false);
    //   cartRef.current.classList.remove("animate-fade-in");
    //   cartRef.current.classList.add("animate-fade-out");
    //   setTimeout(() => {
    //   //   router.push("/admin/users");
    // }, 300);
  };

  return (
    <div>
      <button
        onClick={() => setOpen(true)}
        className="px-4 py-2 text-white bg-blue-700 border rounded-full bg-primary"
      >
        Open me
      </button>
      {open && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.52)] z-[999]">
          <ResizablePanelGroup
            onLayout={onLayout}
            direction="horizontal"
            className="h-screen min-h-screen "
          >
            <ResizablePanel
              onClick={(e) => e.stopPropagation()}
              //   defaultSize={adminSidebarSize[1]}
              defaultSize={40}
              minSize={20}
              className="items-center justify-center min-h-full p-4 bg-gray-200 rounded-r-2xl "
            >
              <div>{children}</div>
            </ResizablePanel>
            <ResizableHandle
              withHandle
              className="bg-transparent border-none"
            />
            <ResizablePanel
              //   defaultSize={adminSidebarSize[0]}
              //   defaultSize={50}
              minSize={5}
              //   collapsible={true}
              onClick={handleCloseCart}
              className="transition-all duration-300 ease-in-out"
            >
              {/* left side is totally transparent */}
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
        // <div
        //   className="fixed inset-0 bg-[rgba(0,0,0,0.7)] z-[999]"
        //   onClick={handleCloseCart}
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
    </div>
  );
}
