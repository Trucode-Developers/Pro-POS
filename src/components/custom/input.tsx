import { cn } from "@/lib/utils";
import React from "react";

interface Props {
  label: string;
  [key: string]: any; // for the rest of the props
  register: any;
}

export default function CustomInput({
  outerClass,
  innerClass,
  label,
  error,
  register,
  ...props
}: Props) {
  return (
    <div
      className={cn(
        "relative  my-0 bg-inherit  ",
        outerClass
      )}
    >
      <input
        id={label}
        {...props}
        {...(register && register)}
        className={cn(
          "w-full px-2 py-2 placeholder-transparent bg-transparent border-b-2 peer ring-gray-500 focus:ring-sky-600 focus:outline-none",
          error
            ? "border-red-500 focus:border-red-500"
            : "border-gray-400 focus:border-blue-600", // Conditionally apply border color based on error
          innerClass
        )}
        placeholder="."
      />
      <label
        htmlFor={label}
        className="absolute left-0 px-1 mx-1 text-sm text-gray-500 capitalize transition-all cursor-text -top-3 bg-inherit peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-2 peer-focus:-top-3 peer-focus:text-sky-600 peer-focus:text-sm"
      >
        {label}
        {": "}
        {error && (
          <span className="text-red-500 animate-pulse"> {error.message} </span>
        )}
      </label>

      {/* {error && (
        <span className="text-red-500 animate-pulse"> {error.message} </span>
      )} */}
    </div>
  );
}
