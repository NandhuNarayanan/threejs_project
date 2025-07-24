"use client";

import Sidebar from "@/components/SideBar";
import ThreeDLoader from "@/components/ThreeDLoader";
import { useEffect, useState } from "react";

export default function UploadedFiles() {
  const [logs, setLogs] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const limit = 10;

  const fetchData = async (page: number) => {
    setLoading(true);
    const res = await fetch(`/api/log-stats?page=${page}&limit=${limit}`);
    const json = await res.json();
    setLogs(json.data);
    setTotalCount(json.count);
    setLoading(false);
  };

  useEffect(() => {
    fetchData(page);
  }, [page]);

  const totalPages = Math.ceil(totalCount / limit);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <ThreeDLoader />
      </div>
    );
  }

  return (
    <div className="p-2 max-w-7xl mx-auto text-[#6B4E5D]">
      <Sidebar />
      <h2 className="text-2xl font-bold mb-6">Uploaded Files</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">File Name</th>
              <th className="px-4 py-2 text-left">Job ID</th>
              <th className="px-4 py-2 text-left">Total Logs</th>
              <th className="px-4 py-2 text-left">Errors</th>
              <th className="px-4 py-2 text-left">Warnings</th>
              <th className="px-4 py-2 text-left">Infos</th>
              <th className="px-4 py-2 text-left">Keywords</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id} className="border-t border-gray-200">
                <td className="px-4 py-2">{log.file_name}</td>
                <td className="px-4 py-2">{log.job_id}</td>
                <td className="px-4 py-2">{log.total_logs}</td>
                <td className="px-4 py-2 text-red-600">{log.error_count}</td>
                <td className="px-4 py-2 text-yellow-600">
                  {log.warning_count}
                </td>
                <td className="px-4 py-2 text-blue-600">{log.info_count}</td>
                <td className="px-4 py-2">
                  {Object.entries(log.keywords_found).map(([k, v]) => (
                    <div key={k}>
                      <span className="font-medium">{k}</span>: {String(v)}
                    </div>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center items-center mt-6 space-x-4">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
          className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
        >
          Previous
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          disabled={page === totalPages}
          className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
