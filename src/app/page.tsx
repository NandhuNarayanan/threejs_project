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
            initial={{ opacity: 0, y: -80, scale: 0.8 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              textShadow: "0 0 15px rgba(255,255,255,0.7)",
            }}
            transition={{
              duration: 1.2,
              ease: [0.16, 1, 0.3, 1],
              y: { type: "spring", stiffness: 100, damping: 15 },
            }}
            whileHover={{
              scale: 1.05,
              textShadow: "0 0 20px rgba(255,255,255,0.9)",
              transition: { duration: 0.3 },
            }}
            className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-8"
            style={{
              background: "linear-gradient(45deg, #ffffff, #c9d6ff)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "#faf0e6",
              letterSpacing: "-0.05em",
              lineHeight: "1.1",
              position: "relative",
              display: "inline-block",
            }}
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
