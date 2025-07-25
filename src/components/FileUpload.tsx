"use client";

import { useState, useRef } from "react";

interface FileUploadProps {
  setUploadStatus: (status: "idle" | "uploading" | "done") => void;
  setUploadProgress?: (value: number) => void; // Optional if you add progress bar later
}

export default function FileUpload({
  setUploadStatus,
  setUploadProgress,
}: FileUploadProps) {
  const [dragging, setDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) setSelectedFile(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("file", selectedFile);

    setUploading(true);
    setSuccess(false);
    setUploadStatus("uploading");

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    setUploading(false);
    setUploadStatus("done");
    setSelectedFile(null);
    setSuccess(res.ok);
  };

  return (
    <div className="mt-4 md:mt-8 lg:mt-8 flex flex-col items-center space-y-6">
      <div
        className={`w-80 h-20 border-4 border-dashed rounded-2xl flex items-center justify-center text-center px-2 cursor-pointer transition-all ${
          dragging ? "border-pink-400 bg-transparent" : "border-[#faf0e6] bg-transparent"
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        <span className="text-[#faf0e6] font-medium text-lg">
          {dragging
            ? "Drop the file here"
            : selectedFile
            ? `${selectedFile.name}`
            : "Click or drag a file to upload"}
        </span>
        <input
          type="file"
          ref={inputRef}
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {selectedFile && (
        <button
          onClick={handleUpload}
          disabled={uploading}
          className="bg-[#8E5D72] hover:bg-[#A97B90] text-white text-lg px-4 py-2 rounded-full shadow-md transition duration-300"
        >
          {uploading ? "Uploading..." : "Upload File"}
        </button>
      )}

      {success && (
        <p className="text-green-600 font-medium">
          ✅ File uploaded successfully!
        </p>
      )}
    </div>
  );
}
