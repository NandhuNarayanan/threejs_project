"use client";

import { usePathname } from "next/navigation";
import React, { useState } from "react";

const links = [
  { name: "Upload", href: "/" },
  { name: "Logs", href: "/logs" },
];

export default function Sidebar() {
  const [open, setOpen] = useState(false);

  const currentPath = usePathname();
  return (
    <>
      <nav className="relative z-10 flex items-center justify-between p-6 md:p-8 lg:p-10">
        {/* Logo */}
        <div className="flex flex-col items-center">
          <img
            src="https://placehold.co/40x40/E9A9B4/FFFFFF?text=UPLOAD"
            alt="Upload Data Logo"
            className="w-10 h-10 rounded-full mb-1"
          />
        </div>

        {/* Nav Links */}
        <div className="hidden md:flex space-x-8 text-md font-semibold">
          <a
            href="/"
            className="hover:text-[#b0e0e6] text-[#faf0e6] transition-colors"
          >
            Upload
          </a>
          <a
            href="/logs"
            className="hover:text-[#b0e0e6] text-[#faf0e6] transition-colors"
          >
            Logs
          </a>
        </div>
      </nav>
    </>
  );
}
