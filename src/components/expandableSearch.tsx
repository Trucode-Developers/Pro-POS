"use client";
import React, { useState, ChangeEvent } from "react";
import { HiMagnifyingGlass } from "react-icons/hi2";

interface Props {
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}
const SearchBar = ({placeholder, value, onChange }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSearch = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative w-max">
      <button
        onClick={toggleSearch}
        className="p-2 text-gray-600 transition duration-300 bg-gray-200 rounded-full hover:bg-gray-300 focus:outline-none focus:bg-gray-300"
      >
        <HiMagnifyingGlass className="w-6 h-6" />
      </button>
      <div
        className={`absolute right-0 mt-2 bg-white rounded-md shadow-lg z-10 ${
          isOpen ? "w-72" : "w-0"
        } overflow-hidden transition-all duration-300 ease-in-out`}
      >
        <input
          type="search"
          className={`w-full px-4 py-4 focus:outline-none ${
            isOpen ? "opacity-100" : "opacity-0"
          } transition-opacity duration-300 ease-in-out`}
          style={{ pointerEvents: isOpen ? "auto" : "none" }}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
      </div>
    </div>
  );
};

export default SearchBar;
