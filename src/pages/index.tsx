import Head from "next/head";
import { useState } from "react";
import { useEffect } from "react";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import Layout from "@/components/layouts/cashier/layout";
import { invoke } from "@tauri-apps/api/tauri";
import Link from "next/link";
import { VscAccount, VscGear, VscWorkspaceTrusted } from "react-icons/vsc";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [greeting, setGreeting] = useState("Hello");
  useEffect(() => {
    invoke("greet", { name: "World" }).then(console.log).catch(console.error);
  }, []);
  function greet() {
    const greet=invoke("greet", { name: "World" }).then(console.log).catch(console.error);
    //save invoked result to greeting
    // setGreeting(greet);
  }
  return (
    <main className="grid grid-cols-2 min-h-screen relative">
      <div className="flex justify-center items-center gap-4 flex-col bg-gray-300">
        <div className="flex flex-col items-center">
          <Image src="/pos.png" alt="main pic" width={180} height={200} />
          <h1 className="text-2xl text-[var(--primary)]">Welcome back: </h1>
          <h1 className="text-2xl text-red-500">Professional Point Of Sale</h1>
          <h3>
            Is committed to digitize your selling by increasing security and
            efficiency
          </h3>
        </div>
        <div className="flex flex-wrap gap-4 text-2xl [&>*]:text-primary hover:[&>*]:text-secondary [&>*]:underline ">
          <Link href="/admin/services"> Admin</Link>
          <Link href="/cashier/sale"> Sale</Link>
          <Link href="/partitions"> Partitions stores</Link>
        </div>
      </div>
      <div className="flex justify-center items-center gap-4 flex-col text-xl ">

        <div>
          <h1 className="text-2xl md:text-4xl font-bold text-[var(--primary)] py-5">
            LOGIN
          </h1>
        </div>
        <div>
          <form
            className="flex flex-col gap-4 w-[200px] md:w-[350px]
          
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
      <div className="absolute p-2 top-0 right-0 text-2xl hover:text-[var(--primary)]">
        <VscGear />
      </div>
    </main>
  );
}
