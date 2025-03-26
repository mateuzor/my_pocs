"use client";

import { useStore } from "@/store/useStore";

export default function SearchBox() {
  const searchTerm = useStore((state) => state.searchTerm);
  const setSearchTerm = useStore((state) => state.setSearchTerm);

  return (
    <div className="w-full px-4">
      <input
        type="text"
        placeholder="Search product..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full px-2 py-0.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-gray-200 text-black placeholder-gray-500 text-xs"
      />
    </div>
  );
}
