import Head from "next/head";
import { useState } from "react";
import { useEffect } from "react";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import Layout from "@/components/Layout";
import { invoke } from "@tauri-apps/api/tauri";

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
    <Layout>
      <Head>
        <title>Pro POS</title>
        <meta name="description" content="Truecode POS" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h1 className="text-2xl text-red-500">Welcome to POS</h1>
        <button className="bg-blue-700 text-white hover:bg-opacity-70 px-4 py-2 rounded-2xl" onClick={greet}>Greet</button>
        <h3>{greeting}</h3>
      </main>
    </Layout>
  );
}
