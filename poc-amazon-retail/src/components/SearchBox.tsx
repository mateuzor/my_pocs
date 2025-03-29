"use client";

import { useState } from "react";
import { useStore } from "@/store/useStore";
import { FiSearch } from "react-icons/fi";

export default function SearchBox() {
  const setSearchTerm = useStore((state) => state.setSearchTerm);
  const [inputValue, setInputValue] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchTerm(inputValue);
  };

  return (
    <form onSubmit={handleSearch} className="w-full px-4">
      <div className="relative w-full">
        <input
          type="text"
          placeholder="Search product..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="w-full px-2 py-1 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-gray-200 text-black placeholder-gray-500 text-xs"
        />
        <button
          type="submit"
          className="absolute top-1/2 right-0.5 -translate-y-1/2 w-6 h-6 rounded-sm flex items-center justify-center"
          style={{ backgroundColor: "#febd69" }}
        >
          <FiSearch className="w-3.5 h-3.5" style={{ color: "#333333" }} />
        </button>
      </div>
    </form>
  );
}
