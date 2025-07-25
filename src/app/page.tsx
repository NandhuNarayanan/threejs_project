"use client";
// import Animation from "@/components/Animation";
import FileUpload from "@/components/FileUpload";
import Sidebar from "@/components/SideBar";
import SpheresScene from "@/components/Three";
import { motion } from "framer-motion";
import { useState } from "react";

export default function Home() {
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "uploading" | "done"
  >("idle");
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  return (
    <main>
      <div className="min-h-screen bg-[#F8E3E7] font-inter text-gray-800 overflow-hidden relative">
        <SpheresScene
          uploadStatus={uploadStatus}
          uploadProgress={uploadProgress}
        />
        <Sidebar />

        <main className="relative z-20 flex flex-col items-center justify-center px-4 py-12 md:py-12 lg:py-12 text-center">
          <motion.h2
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-2xl lg:text-6xl font-extrabold leading-tight text-[#6B4E5D] mb-8 drop-shadow-lg"
          >
            Upload Your Data With 3D
          </motion.h2>
          <FileUpload
            setUploadStatus={setUploadStatus}
            setUploadProgress={setUploadProgress}
          />
        </main>
      </div>
    </main>
  );
}
