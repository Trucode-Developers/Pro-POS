import { cn } from "@/lib/utils";
import React from "react";

interface Props {
  label: string;
  [key: string]: any; // for the rest of the props
}

export default function CustomInput({ className, label, ...props }: Props) {
  return (
    <div className="relative w-full my-4 bg-inherit">
      <input
        id={label}
        {...props} // Spread the rest of the props onto the input element
        className={cn(
          "w-full px-2 py-2 placeholder-transparent bg-transparent border-b-2 border-gray-400 peer ring-gray-500 focus:ring-sky-600 focus:outline-none focus:border-blue-600",
          className 
        )}
        placeholder="Type inside me"
      />
      <label
        htmlFor={label}
        className="absolute left-0 px-1 mx-1 text-sm text-gray-500 capitalize transition-all cursor-text -top-3 bg-inherit peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-2 peer-focus:-top-3 peer-focus:text-sky-600 peer-focus:text-sm"
      >
        {label}
      </label>
    </div>
  );
}
