"use client";

import Image from "next/image";
import SearchBox from "@/components/SearchBox";

export default function HeaderBanner() {
  return (
    <header className="w-full bg-[#232F3E] py-2 px-2 flex items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <Image
          src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg"
          alt="Amazon Logo"
          width={60}
          height={35}
          className="object-contain"
        />
      </div>
      <div className="flex-1 max-w-4xl">
        <SearchBox />
      </div>
    </header>
  );
}
