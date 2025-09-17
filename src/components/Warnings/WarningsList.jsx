/** @format */

// components/Warnings/WarningsList.jsx
'use client';
import { useDonorAuthStore } from '@/store/auth/auth-donor-store';
import { useEffect, useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import Pagination from '@/components/Pagination'; // ✅ reuse your pagination component

export default function WarningsList() {
  const { warnings, fetchWarnings, loading, error } = useDonorAuthStore();

  // ✅ Local pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(5); // default 5 per page

  useEffect(() => {
    fetchWarnings();
  }, [fetchWarnings]);

  if (loading) return <p className="text-[var(--text)]">Loading warnings...</p>;
  if (error) return <p className="text-red-400">{error}</p>;

  // ✅ Pagination calculations
  const startIndex = (currentPage - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedData = warnings?.slice(startIndex, endIndex) || [];
  const pageCount = Math.ceil((warnings?.length || 0) / limit);

  return (
    <div className="bg-[var(--bg)] border border-[var(--highlight)] rounded-2xl shadow-lg p-6 mt-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-[var(--highlight)]">
        <AlertTriangle className="w-5 h-5 text-[var(--highlight)]" />
        Your Warnings
      </h2>

      {/* Limit Selector */}
      {warnings && warnings.length > 0 && (
        <div className="mb-4 flex items-center gap-2">
          <label className="text-sm text-gray-300">Show per page:</label>
          <select
            value={limit}
            onChange={(e) => {
              setLimit(Number(e.target.value));
              setCurrentPage(1); // reset to first page when limit changes
            }}
            className="bg-[#111111] border border-gray-600 rounded-md px-2 py-1 text-sm"
          >
            <option value={2}>2</option>
            <option value={5}>5</option>
            <option value={10}>10</option>
          </select>
        </div>
      )}

      {warnings && warnings.length > 0 ? (
        <>
          <div className="grid gap-4">
            {paginatedData.map((warn) => (
              <div
                key={warn._id}
                className="p-4 rounded-xl border border-[var(--highlight)] bg-[#1a1a1a] shadow-md hover:shadow-lg transition"
              >
                <p className="text-[var(--text)] font-medium">{warn.message}</p>
                <div className="flex justify-between items-center mt-2 text-sm text-gray-400">
                  <span>
                    By:{' '}
                    <strong className="text-[var(--highlight)]">
                      {warn.createdBy?.fullName || 'Admin'}
                    </strong>
                  </span>
                  <span>{new Date(warn.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>

          {/* ✅ Pagination Controls */}
          <Pagination
            pageCount={pageCount}
            currentPage={currentPage}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </>
      ) : (
        <div className="p-6 rounded-xl border border-green-500 bg-green-900/30 text-green-400 text-center shadow-sm">
          🎉 No warnings found. Keep up the good work!
        </div>
      )}
    </div>
  );
}
