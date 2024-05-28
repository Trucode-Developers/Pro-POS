"use client";
import "./globals.css";
import "./custom.css";
import { useThemeStore } from "@/lib/store";
import React, { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import NextTopLoader from "nextjs-toploader";
import { usePathname, useRouter } from "next/navigation";

export default function Initiator() {
  const path = usePathname();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState("");

  const fetchToken = async () => {
    try {
      const tokenFromStore = useThemeStore.getState().token;
      if (tokenFromStore !== null) {
        setToken(tokenFromStore);
      }
      setIsLoading(false);
    } catch (error) {
      // console.error("Error fetching token:", error);
      setIsLoading(false);
    }
  };

  // useEffect to call activeDb
  useEffect(() => {
    useThemeStore.persist.rehydrate();
    activeDb();
    fetchToken();
    if (!token) {
      console.log("Token is null");
      router.push("/");
    } else {
      //redrect to previous page
      router.push(path);
    }
  }, [path, token, isLoading]);

  // Active DB
  const activeDb = async () => {
    try {
      const response = await invoke("current_active_db");
      if (typeof response === "string") {
        console.error("Response is a string:", response);
        useThemeStore.setState({ activeDb: response });
      } else {
        // console.error("Response is not a string:", response);
      }
    } catch (error) {
      // console.error("Error occurred while fetching active DB:", error);
    }
  };

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
