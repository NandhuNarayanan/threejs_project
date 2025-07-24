"use client";
import FileUpload from "@/components/FileUpload";
import Sidebar from "@/components/SideBar";
import SpheresScene from "@/components/Three";
import ThreeDLoader from "@/components/ThreeDLoader"; // 🆕
import { useState } from "react";

export default function Home() {
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "uploading" | "done"
  >("idle");
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  return (
    <main>
      <div className="min-h-screen bg-[#F8E3E7] font-inter text-gray-800 overflow-hidden relative">
        <SpheresScene />
        <Sidebar />

        <main className="relative z-20 flex flex-col items-center justify-center px-4 py-12 md:py-24 lg:py-32 text-center">
          <h2 className="text-5xl md:text-7xl lg:text-8xl font-extrabold leading-tight text-[#6B4E5D] mb-8 drop-shadow-lg">
            Upload Your Data
          </h2>

          {uploadStatus === "uploading" ? (
            <ThreeDLoader />
          ) : (
            <FileUpload
              setUploadStatus={setUploadStatus}
              setUploadProgress={setUploadProgress}
            />
          )}
        </main>
      </div>
    </main>
  );
}
