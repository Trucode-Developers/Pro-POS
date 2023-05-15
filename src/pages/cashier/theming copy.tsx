import Link from "next/link";
import React, { useEffect, useState } from "react";

export default function Page() {
  const [cColor, setcColor] = useState("#2ecc71");
  const colors = [
    "#2ecc71",
    "#3498db",
    "#9b59b6",
    "#f1c40f",
    "#e67e22",
    "#e74c3c",
  ];

  useEffect(() => {
    const currentColor = localStorage.getItem("color") || "#2ecc71";
    setTheme(currentColor);
  }, []);

  const setTheme = (color: any) => {
    document.documentElement.style.setProperty("--primary", color);
  };

  const setColor = (event: any) => {
    const currentColor =
      event.target.style.getPropertyValue("background-color");
    setTheme(currentColor);
    setcColor(currentColor);
    localStorage.setItem("color", currentColor);
  };

  return (
    <div style={{ backgroundColor: "var(--primary)" }} className="flex flex-col min-h-screen">
      {colors.map((colr, index) => (
        <button
          key={index}
          style={{ backgroundColor: colr }}
          onClick={setColor}
        >
          {colr}
        </button>
      ))}
      <Link href="/" className=" px-4 py-2 rounded-xl">
        Back home
        </Link>
    </div>
  );
}
