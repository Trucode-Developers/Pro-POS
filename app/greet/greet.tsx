"use client";
import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import Link from "next/link";

export default function Greet() {
  const [greeting, setGreeting] = useState("");
  useEffect(() => {
    invoke<string>("greet", { name: "Professional POS" })
      .then(
        (greeting) => setGreeting(greeting),
        (error) => console.error(error)
        // console.log(greeting)
      )
      .catch(console.error);
  }, []);

  // Necessary because we will have to use Greet as a component later.
  return (
    <div className="flex gap-2 justify-center items-center flex-wrap flex-col bg-blue-200 h-full w-full">
      <Link href="/">← Back to hom now</Link>
      <br />
      <div>
        <h1 className="text-4xl font-bold">Greet</h1>
        <p className="text-2xl">{greeting}</p>
      </div>
    </div>
  );
}
