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
      <div className="md:hidden flex items-center">
        <button
          onClick={() => setOpen(true)}
          className="text-white focus:outline-none"
        >
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 8h16M4 16h16"
            />
          </svg>
        </button>
        <span className="ml-4 text-white font-bold flex-1">Log Analytics</span>
      </div>

      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`fixed z-50 top-0 left-0 h-full w-64 bg-white shadow-md transform transition-transform duration-300
        ${
          open ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:static md:h-auto md:shadow-none`}
      >
        <div className="h-16 flex items-center px-4 border-b bg-gradient-to-br from-indigo-300 to-white">
          <span className="text-lg font-bold text-gray-700">Log Analytics</span>
          <button
            className="ml-auto md:hidden text-gray-700"
            onClick={() => setOpen(false)}
          >
            <svg
              className="w-7 h-7"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <nav className="p-4">
          {links.map((link) => {
            const isActive = currentPath === link.href;

            return (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`block py-2 px-3 rounded mt-1 transition 
                ${
                  isActive
                    ? "bg-indigo-100 text-gray-700 font-bold"
                    : "text-gray-700 hover:bg-indigo-100"
                }`}
              >
                {link.name}
              </a>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
