"use client";

import Image from "next/image";
import SearchBox from "@/components/SearchBox";

export default function HeaderBanner() {
  return (
    <header
      className="w-full bg-[#232F3E] py-4 px-4 flex items-center justify-between gap-4 text-white"
      role="banner"
      aria-label="Main navigation"
    >
      <div className="flex items-center gap-4">
        <Image
          src="/images/amazon-logo.png"
          alt="Amazon logo"
          width={70}
          height={30}
          className="object-contain"
        />
      </div>
      <div className="flex-1 max-w-4xl">
        <SearchBox />
      </div>
    </header>
  );
}
