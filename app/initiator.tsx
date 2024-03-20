"use client";
import "./globals.css";
import "./custom.css";
import { useThemeStore } from "@/lib/store";
import React, { useEffect } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import NextTopLoader from "nextjs-toploader";

export default function Initiator() {

  // Active DB
  const activeDb = async () => {
    try {
      const response = await invoke("current_active_db");
      if (typeof response === "string") {
        useThemeStore.setState({ activeDb: response });
      } else {
        console.error("Response is not a string:", response);
      }
    } catch (error) {
      console.error("Error occurred while fetching active DB:", error);
    }
  };

  // useEffect to call activeDb
  useEffect(() => {
    useThemeStore.persist.rehydrate();
    activeDb();
  }, []);

  return (
    <>
      {" "}
      <NextTopLoader
        color="#DEB200"
        initialPosition={0.08}
        crawlSpeed={200}
        height={5}
        crawl={true}
        showSpinner={true}
        easing="ease"
        speed={200}
        shadow="0 0 10px #2299DD,0 0 5px #2299DD"
      />
    </>
  );
}
