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
    <form onSubmit={handleSearch} className="w-full px-0">
      <div className="relative w-full">
        <input
          type="text"
          placeholder="Search product..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="w-full px-3 py-2 pr-10 border border-[#999] rounded shadow-sm bg-[#2a2a2a] text-white placeholder-[#FFF] focus:outline-none focus:ring-2 focus:ring-[#ccc] text-sm"
          aria-label="Search for a product"
        />
        <button
          type="submit"
          aria-label="Search"
          className="absolute top-1/2 right-1 transform -translate-y-1/2 w-8 h-8 rounded flex items-center justify-center"
          style={{ backgroundColor: "#febd69" }}
        >
          <FiSearch className="w-4 h-4" style={{ color: "#333333" }} />
        </button>
      </div>
    </form>
  );
}
