import Head from "next/head";
import { useState } from "react";
import { useEffect } from "react";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import Layout from "@/components/layouts/cashier/layout";
import { invoke } from "@tauri-apps/api/tauri";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [greeting, setGreeting] = useState("Hello");
  useEffect(() => {
    invoke("greet", { name: "World" }).then(console.log).catch(console.error);
  }, []);
  function greet() {
    invoke("greet", { name: "World" }).then(console.log).catch(console.error);
    //save invoked result to greeting
    setGreeting("Hello World");
  }
  return (
    <>
      <Head>
        <title>Pro POS</title>
        <meta name="description" content="Truecode POS" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex justify-center items-center min-h-screen gap-4 flex-col ">
        <div>
          <h1 className="text-2xl text-red-500">Welcome to POS</h1>
          <h3>Pages under development </h3>
        </div>
        <div className="flex flex-wrap gap-4 text-2xl [&>*]:text-primary hover:[&>*]:text-secondary [&>*]:underline ">
          <Link href="/admin/services"> Admin</Link>
          <Link href="/cashier/sale"> Sale</Link>
          <Link href="/partitions"> Partitions stores</Link>
        </div>
      </main>
    </>
  );
}
