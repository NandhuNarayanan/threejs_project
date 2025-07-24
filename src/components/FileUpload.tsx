"use client";
import React, { useRef, useState } from "react";

interface FileUploadProps {
  onStatusChange: (status: "idle" | "uploading" | "done") => void;
  onProgressUpdate: (progress: number) => void;
}

export default function FileUpload({ onStatusChange, onProgressUpdate }: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const onUpload = async () => {
    if (!selectedFile) return;
    setUploading(true);
    onStatusChange("uploading");
    onProgressUpdate(0);

    const formData = new FormData();
    formData.append("file", selectedFile);

    const progress = new XMLHttpRequest();
    progress.open("POST", "/api/upload", true);

    progress.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        const percent = Math.round((e.loaded * 100) / e.total);
        onProgressUpdate(percent);
      }
    };

    progress.onload = () => {
      setUploading(false);
      setSelectedFile(null);
      onProgressUpdate(100);
      onStatusChange("done");
    };

    progress.onerror = () => {
      setUploading(false);
      onStatusChange("idle");
      onProgressUpdate(0);
    };

    progress.send(formData);
  };

  return (
    <div
      className={`w-full max-w-lg transition-all border-2 border-dashed rounded-2xl p-8 flex flex-col items-center
        ${selectedFile ? "border-indigo-400 bg-white" : "border-gray-300 bg-gray-50 hover:bg-indigo-50"}`}
      onDrop={onDrop}
      onDragOver={(e) => e.preventDefault()}
      style={{ cursor: !selectedFile ? "pointer" : "default" }}
    >
      <input
        ref={inputRef}
        type="file"
        hidden
        disabled={uploading}
        onChange={onChange}
      />

      {!selectedFile ? (
        <div className="flex flex-col items-center" onClick={() => inputRef.current?.click()}>
          <svg
            className="w-16 h-16 text-indigo-400 mb-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16v1a2 2 0 002 2h14a2 2 0 002-2v-1m-4-4l-4-4m0 0l-4 4m4-4v12"
            />
          </svg>
          <p className="text-lg text-gray-700 font-semibold mb-2">
            Drag and drop your file here
          </p>
          <p className="text-gray-500 text-sm">or click to select a file</p>
        </div>
      ) : (
        <div className="w-full">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium text-indigo-700">
              {selectedFile.name}
            </span>
            <span className="text-sm text-gray-500">
              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
            </span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onUpload();
            }}
            disabled={uploading}
            className={`w-full mt-2 py-2 px-4 rounded-lg text-white font-semibold bg-indigo-500 hover:bg-indigo-600 transition
              ${uploading ? "opacity-60 cursor-not-allowed" : ""}`}
          >
            {uploading ? "Uploading..." : "Upload"}
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedFile(null);
              onStatusChange("idle");
              onProgressUpdate(0);
            }}
            disabled={uploading}
            className="w-full mt-2 py-2 px-4 rounded-lg text-indigo-600 font-semibold border border-indigo-100 bg-indigo-50 hover:bg-indigo-100 transition"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
