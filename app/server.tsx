"use client";
import { useThemeStore } from "@/lib/store";
import React from "react";
import { Radio } from "react-loader-spinner";

export default function Server() {
  const server_running = useThemeStore((state) => state.server_running);

  return (
    // {server_running && (
    <div className="absolute bottom-0 right-0 z-50">
      {server_running && (
        <Radio
          visible={true}
          height="100"
          width="100"
          // color="#4fa94d"
          colors={["#348feb", "#348feb", "#348feb"]}
          ariaLabel="radio-loading"
          wrapperStyle={{}}
          wrapperClass=""
        />
      )}
    </div>
    // )}
  );
}
