import React from "react";
import Link from "next/link";

export default function ErrorPage() {
  return (
    <div className="h-screen flex justify-center items-center flex-col gap-4">
      <div>
        Module under construction, will be available inthe next version{" "}
      </div>
      <Link
        href="/"
        className="bg-yellow-500 px-4 py-2 rounded-xl bg-primary text-primary_text hover:text-secondary duration-300 ease-in-out"
      >
        Back home
      </Link>
    </div>
  );
}
