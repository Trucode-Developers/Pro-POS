"use client";
import Image from "next/image";
import { Inter } from "next/font/google";
import { invoke } from "@tauri-apps/api/tauri";
import Link from "next/link";
import { VscAccount, VscGear, VscWorkspaceTrusted } from "react-icons/vsc";
import { InitialSetUp } from "./initialSetUp";

const inter = Inter({ subsets: ["latin"] });
import { cn } from "@/lib/utils";
import { useThemeStore } from "@/lib/store";
import { use, useEffect } from "react";

export default function Page() {
  const font = useThemeStore((state) => state.fontSize);

  // useEffect(() => {
  //   useThemeStore.persist.rehydrate();
  // }, []);

  return (
    <main className="relative grid min-h-screen md:grid-cols-2">
      <div className="flex-col items-center justify-center hidden gap-4 px-2 bg-gray-300 md:flex md:px-4">
        <div className="flex flex-col items-center">
          <Image src="/pos.png" alt="main pic" width={180} height={200} />
          <h1 className="text-2xl text-[var(--primary)]">Welcome back: </h1>
          <h1 className="text-2xl text-red-500">Professional Point Of Sale</h1>
          <h3 className={cn("text-center")} style={{ fontSize: `${font}px` }}>
            Is committed to digitize your selling by increasing security and
            efficiency {font}
          </h3>
        </div>
        <div className="flex flex-wrap gap-4 text-2xl [&>*]:text-primary hover:[&>*]:text-secondary [&>*]:underline ">
          <Link href="/admin"> Admin</Link>
          <Link href="/cashier"> Sale</Link>
          <Link href="/greet"> Greet</Link>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center gap-4 text-xl ">
        <div>
          <h1 className="text-2xl md:text-4xl font-bold text-[var(--primary)] py-5">
            LOGIN
          </h1>
        </div>
        <div>
          <form
            className="flex flex-col gap-4 w-full md:w-[350px]
          [&>input]:px-4
          [&>input]:border-b-4
          [&>input]:rounded-2xl
          [&>input]:w-full
          [&>input]:border-[var(--primary)]
          [&>input]:outline-none
          [&>input]:text-center
          "
          >
            <div className="flex justify-between">
              <label>UserName:</label>
              <VscAccount />
            </div>
            <input type="search" name="user-name" placeholder="user.name" />
            <div className="flex justify-between">
              <label>Password:</label>
              <VscWorkspaceTrusted />
            </div>
            <input type="password" name="user-name" placeholder="*********" />
            <input
              type="submit"
              className="bg-[var(--primary)] py-2 text-white hover:bg-blue-500 my-5 outline-double outline-4 cursor-pointer"
            />
          </form>
        </div>
      </div>
      <div className="absolute p-2 top-2 right-2">
        <InitialSetUp />
      </div>
    </main>
  );
}
