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

  return (
    <div className="min-h-screen bg-[#F8E3E7] relative">
      <Sidebar />

      <div className="p-2 max-w-7xl mx-auto text-[#6B4E5D]">
        <h2 className="text-2xl font-bold mb-6">Uploaded Files</h2>

        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
            <ThreeDLoader
              size={200}
              primaryColor="#6366f1"
              secondaryColor="#a855f7"
            />
            <p className="text-lg font-medium text-[#6B4E5D]">
              Loading your files...
            </p>
          </div>
        ) : (
          <>
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
                    <tr
                      key={log.id}
                      className="border-t border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-2 font-medium">{log.file_name}</td>
                      <td className="px-4 py-2 font-mono text-sm">
                        {log.job_id}
                      </td>
                      <td className="px-4 py-2">{log.total_logs}</td>
                      <td className="px-4 py-2 text-red-600 font-semibold">
                        {log.error_count}
                      </td>
                      <td className="px-4 py-2 text-yellow-600 font-semibold">
                        {log.warning_count}
                      </td>
                      <td className="px-4 py-2 text-blue-600 font-semibold">
                        {log.info_count}
                      </td>
                      <td className="px-4 py-2">
                        {Object.entries(log.keywords_found).map(([k, v]) => (
                          <div key={k} className="text-sm">
                            <span className="font-medium text-gray-700">
                              {k}
                            </span>
                            :<span className="ml-1">{String(v)}</span>
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
                className="px-6 py-2 rounded-lg bg-white border-2 border-[#6B4E5D] text-[#6B4E5D] hover:bg-[#6B4E5D] hover:text-white disabled:opacity-50 disabled:hover:bg-white disabled:hover:text-[#6B4E5D] transition-colors font-medium"
              >
                Previous
              </button>
              <span className="font-medium">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                disabled={page === totalPages}
                className="px-6 py-2 rounded-lg bg-white border-2 border-[#6B4E5D] text-[#6B4E5D] hover:bg-[#6B4E5D] hover:text-white disabled:opacity-50 disabled:hover:bg-white disabled:hover:text-[#6B4E5D] transition-colors font-medium"
              >
                Next
              </button>
            </div>
          </>
        )}

        {/* Show small loader during pagination */}
        {loading && logs.length > 0 && (
          <div className="fixed top-4 right-4 bg-white rounded-lg shadow-lg p-4 border">
            <div className="flex items-center space-x-3">
              <ThreeDLoader
                size={100}
                primaryColor=""
                secondaryColor=""
              />
              <span className="text-sm font-medium text-[#6B4E5D]">
                Loading...
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
