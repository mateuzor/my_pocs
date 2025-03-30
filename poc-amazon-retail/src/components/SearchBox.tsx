"use client";

import { useState } from "react";
import { useStore } from "@/store/useStore";
import { FiSearch } from "react-icons/fi";

interface SearchBoxProps {
  inputClassName?: string;
}

export default function SearchBox({ inputClassName = "" }: SearchBoxProps) {
  const setSearchTerm = useStore((state) => state.setSearchTerm);
  const [inputValue, setInputValue] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchTerm(inputValue);
  };

  return (
    <form onSubmit={handleSearch} className="w-full px-1">
      <div className="relative w-full">
        <input
          type="text"
          placeholder="Search product..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className={`w-full pr-6 pl-2 h-[22px] border border-gray-300 rounded-sm text-xs text-black placeholder-gray-500 focus:outline-none focus:ring focus:ring-gray-200 ${inputClassName}`}
        />
        <button
          type="submit"
          className="absolute right-1 top-1/2 -translate-y-1/2 p-0 m-0 h-[16px] w-[16px] flex items-center justify-center"
          style={{ backgroundColor: "#febd69" }}
        >
          <FiSearch
            className="w-[12px] h-[12px]"
            style={{ color: "#333333" }}
          />
        </button>
      </div>
    </form>
  );
}
