import { cn } from '@/lib/utils';
import React from 'react'

interface Props {
    className?: string;
    label: string;
    data: { label: string; value: string }[];
    [key: string]: any; // for the rest of the props
    }
    
export default function CustomSelect({ className, label, data, ...props }: Props) {
  return (
    <div className="relative w-full bg-inherit">
      <select
        id={label}
        {...props} // Spread the rest of the props onto the select element
        className={cn(
          "w-full px-2 py-2 placeholder-transparent bg-transparent border-b-2 border-gray-400 peer ring-gray-500 focus:ring-sky-600 focus:outline-none focus:border-yellow-600",
          className
        )}
      >
        {data.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <label
        htmlFor={label}
        className="absolute left-0 px-1 mx-1 text-sm text-gray-500 capitalize transition-all cursor-text -top-3 bg-inherit peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-2 peer-focus:-top-3 peer-focus:text-sky-600 peer-focus:text-sm"
      >
        {label}
      </label>
    </div>
  );
}
