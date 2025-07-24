"use client";

import { useState } from "react";
import FileUpload from "@/components/FileUpload";
import ThreeScene from "@/components/Three";
import Sidebar from "@/components/SideBar";

export default function Home() {
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "uploading" | "done"
  >("idle");
  const [uploadProgress, setUploadProgress] = useState<number>(0); // NEW

  return (
    <main>
      <div className="min-h-screen bg-[#F8E3E7] font-inter text-gray-800 overflow-hidden">
        {/* Background Watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
          <h1 className="text-8xl md:text-[4rem] lg:text-[8rem] font-extrabold text-[#F0D0D7] opacity-70 rotate-[-8deg] select-none uppercase">
            experience the 3D
          </h1>
        </div>

        {/* Navbar */}
        <Sidebar />
        {/* Hero Section */}
        <main className="relative z-10 flex flex-col items-center justify-center px-4 py-12 md:py-24 lg:py-32 text-center overflow-hidden">
          <h2 className="text-5xl md:text-7xl lg:text-8xl font-extrabold leading-tight text-[#6B4E5D] mb-8 drop-shadow-lg">
            Upload Your Data With 3D
          </h2>

          {/* Skateboard Image - Placeholder */}
          {/* Increased max-width for a more "close look" */}

          <div className="mt-8 md:mt-12 lg:mt-16 flex flex-col items-center space-y-6">
            <button className="bg-[#8E5D72] hover:bg-[#A97B90] text-white text-xl md:text-2xl font-bold py-4 px-10 rounded-full shadow-lg transform transition duration-300 ease-in-out hover:scale-105">
              Upload Your File
            </button>
          </div>
        </main>
      </div>
    </main>
  );
}
