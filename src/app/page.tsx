"use client";

import { useState } from "react";
import FileUpload from "@/components/FileUpload";
import ThreeScene from "@/components/Three";

export default function Home() {
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "done">("idle");
  const [uploadProgress, setUploadProgress] = useState<number>(0); // NEW

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-200 via-white to-gray-300 overflow-hidden">
      {/* Background blobs */}
      <div className="absolute w-full h-full top-0 left-0 -z-10 overflow-hidden">
        <div className="absolute left-[20%] top-[10%] w-[300px] h-[300px] bg-indigo-400 rounded-full blur-3xl opacity-40 animate-pulse" />
        <div className="absolute right-[15%] bottom-[10%] w-[200px] h-[200px] bg-purple-300 rounded-full blur-2xl opacity-40 animate-pulse" />
        <div className="absolute left-[50%] bottom-[30%] w-[250px] h-[250px] bg-pink-500 rounded-full blur-2xl opacity-50" />
      </div>

      {/* 3D Scene with uploader inside */}
      <div className="relative w-full md:w-[800px] h-[500px] rounded-xl overflow-hidden shadow-lg">
        <ThreeScene uploadStatus={uploadStatus} uploadProgress={uploadProgress} />
        
        {/* Upload form overlay */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-10">
          <FileUpload
            onStatusChange={setUploadStatus}
            onProgressUpdate={setUploadProgress} 
          />
        </div>
      </div>
    </main>
  );
}
