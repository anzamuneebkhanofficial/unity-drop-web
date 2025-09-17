/** @format */
'use client';
import { useDonorAuthStore } from '@/store/auth/auth-donor-store';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import Pagination from '@/components/Pagination'; // 👈 use your pagination

export default function AISuggestions() {
  const {
    aiSuggestions,
    fetchAISuggestions,
    loading,
    resetMessages,
    error,
    success,
  } = useDonorAuthStore();

  // ✅ Local state
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(5); // default 5 per page (dynamic)

  useEffect(() => {
    fetchAISuggestions();
  }, [fetchAISuggestions]);

  useEffect(() => {
    if (success) toast.success(success);
    if (error) toast.error(error);
    if (success || error) resetMessages();
  }, [success, error, resetMessages]);

  // ✅ Calculate pagination
  const startIndex = (currentPage - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedData = aiSuggestions?.slice(startIndex, endIndex) || [];
  const pageCount = Math.ceil((aiSuggestions?.length || 0) / limit);

  return (
    <div className="bg-[var(--bg)] border border-[var(--highlight)] rounded-2xl p-6 mt-6 shadow-xl text-[var(--text)]">
      <h2 className="text-2xl font-bold text-[var(--highlight)] mb-4">
        🤖 AI-Powered Patient Suggestions
      </h2>
      <p className="text-sm text-gray-400 mb-6">
        Suggestions are dynamically generated using AI, based on your blood
        group and location.
      </p>

      {/* Limit selector */}
      <div className="mb-4 flex items-center gap-2">
        <label className="text-sm text-gray-300">Show per page:</label>
        <select
          value={limit}
          onChange={(e) => {
            setLimit(Number(e.target.value));
            setCurrentPage(1); // reset to first page
          }}
          className="bg-[#111111] border border-gray-600 rounded-md px-2 py-1 text-sm"
        >
          <option value={2}>2</option>
          <option value={5}>5</option>
          <option value={10}>10</option>
        </select>
      </div>

      {loading && (
        <p className="animate-pulse text-gray-400">
          Fetching AI suggestions...
        </p>
      )}

      {error && <p className="text-red-400">⚠️ {error}</p>}

      {!loading && paginatedData.length > 0 ? (
        <>
          <ul className="space-y-6">
            {paginatedData.map((s, index) => (
              <li
                key={s._id}
                className="p-5 border border-gray-700 rounded-xl bg-[#111111] shadow-md hover:shadow-lg transition"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-lg font-bold text-[var(--highlight)]">
                    #{startIndex + index + 1}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-[var(--highlight)] text-black text-sm font-semibold">
                    Urgency: {s.urgency || 'N/A'}
                  </span>
                </div>

                <div className="mb-3">
                  <h3 className="font-semibold text-xl">
                    {s.hospitalName || 'Unnamed Hospital'}
                  </h3>
                  <p className="text-sm text-gray-400 mt-1">
                    🩸 Blood Group:{' '}
                    <strong className="text-[var(--highlight)]">
                      {s.bloodGroup}
                    </strong>{' '}
                    • 📍 Location:{' '}
                    <strong className="text-[var(--highlight)]">
                      {s.location || 'Unknown'}
                    </strong>
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    ✅ Availability: {s.availabilityStatus || 'Not specified'}
                  </p>
                </div>

                <div className="space-y-2 text-sm">
                  <p>
                    <span className="font-semibold text-[var(--highlight)]">
                      ⭐ AI Score:
                    </span>{' '}
                    {s.aiScore}
                  </p>
                  <p>
                    <span className="font-semibold text-[var(--highlight)]">
                      Reason:
                    </span>{' '}
                    {s.reason}
                  </p>
                  <p>
                    <span className="font-semibold text-[var(--highlight)]">
                      Suggestion:
                    </span>{' '}
                    {s.suggestion}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          {/* ✅ Pagination */}
          <Pagination
            pageCount={pageCount}
            currentPage={currentPage}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </>
      ) : (
        !loading && (
          <p className="text-gray-400">No AI suggestions available.</p>
        )
      )}
    </div>
  );
}
