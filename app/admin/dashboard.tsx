"use client";
import { openPopUp } from "@/lib/store";
import React from "react";

export default function Dashboard() {
 
  return (
    <div className="text-2xl">
      <div>add more dashboard components</div>
      <button onClick={openPopUp} className="text-2xl">
        Open modal
      </button>
    </div>
  );
}
