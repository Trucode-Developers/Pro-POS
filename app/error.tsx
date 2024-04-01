"use client"; // Error components must be Client Components
import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  //   useEffect(() => {
  //     // Log the error to an error reporting service
  //     console.error(error);
  //   }, [error]);

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4 font-bold uppercase bg-gray-300">
      <h2 className="">Something went wrong!</h2>
      <Button className="bg-yellow-500 hover:bg-yellow-600"
        onClick={
          () => reset()
        }
      >
        Try again
      </Button>
      <Button className="bg-blue-500 hover:bg-blue-600"
      >
      <Link href="/">← Back to home</Link>
      </Button>
    </div>
  );
}
