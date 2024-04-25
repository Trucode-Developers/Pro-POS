import { cn } from "@/lib/utils";
import React from "react";

interface Props {
  label: string;
  [key: string]: any; // for the rest of the props
  register: any;
  options: { value: string | number; label: string }[];
}

export default function CustomRadioGroup({
  outerClass,
  innerClass,
  label,
  error,
  register,
  options,
  ...props
}: Props) {
  const { isRequired = false, ...restProps } = props;
  return (
    <div
      className={cn(
        "relative my-0 bg-inherit w-[400px] border px-2 py-4 rounded-xl bg-gray-50",
        outerClass
      )}
    >
      <div className="flex flex-col">
        <div className="flex gap-2 text-gray-500 capitalize ">
          <div>
            {label}
            {isRequired && <span className="text-red-500"> *</span>}
          </div>
          {error && (
            <div className="text-red-500 normal-case animate-pulse">
              {error.message}
            </div>
          )}
        </div>
        <div className="flex gap-4">
          {options.map((option) => (
            <div key={option.value} className="flex items-center">
              <input
                type="radio"
                id={`${label}-${option.value}`}
                value={option.value}
                {...(register && register)}
                className={cn(
                  "mr-2 focus:ring-sky-600 focus:outline-none ",
                  error
                    ? "ring-red-500 focus:ring-red-500"
                    : "ring-gray-500 focus:ring-blue-600",
                  innerClass
                )}
              />
              <label
                htmlFor={`${label}-${option.value}`}
                className="text-gray-700 cursor-pointer"
              >
                {option.label}
              </label>
            </div>
          ))}
        </div>
      </div>
      {/* {error && (
        <div className="text-red-500 normal-case animate-pulse">
          {error.message}
        </div>
      )} */}
    </div>
  );
}
