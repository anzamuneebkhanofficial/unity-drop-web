/** @format */
'use client';
import { usePatientAuthStore } from '@/store/auth/auth-patient-store';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import Pagination from '@/components/Pagination';
import MiniLoader from '@/components/MiniLoader'; // 👈 your loader

export default function AISuggestionsPatient() {
  const {
    aiSuggestions,
    totalAISuggestions,
    fetchAISuggestions,
    loading,
    resetMessages,
    error,
    success,
  } = usePatientAuthStore();

  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [hasFetched, setHasFetched] = useState(false); // 👈 track first fetch

  useEffect(() => {
    const fetchData = async () => {
      await fetchAISuggestions();
      setHasFetched(true); // mark that initial fetch is done
    };
    fetchData();
  }, [fetchAISuggestions]);

  useEffect(() => {
    if (success) toast.success(success);
    if (error) toast.error(error);
    if (success || error) resetMessages();
  }, [success, error, resetMessages]);

  // ✅ Pagination
  const startIndex = (currentPage - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedData = aiSuggestions?.slice(startIndex, endIndex) || [];
  const pageCount = Math.ceil((aiSuggestions?.length || 0) / limit);

  return (
    <div className="bg-[var(--bg)] border border-[var(--highlight)] rounded-2xl p-6 mt-6 shadow-xl text-[var(--text)]">
      <h2 className="text-2xl font-bold text-[var(--highlight)] mb-2">
        🤖 AI-Powered Donor Suggestions
      </h2>
      <p className="text-sm text-gray-400 mb-4">
        These suggestions are dynamically generated using AI, based on your
        blood group and location.
      </p>

      {/* Status: waiting, loading, or result */}
      {!hasFetched && (
        <p className="text-gray-400">⏳ Waiting for AI suggestions...</p>
      )}

      {loading && (
        <div className="flex items-center gap-2 text-gray-400 mb-4">
          <MiniLoader size={20} /> Fetching AI donor suggestions...
        </div>
      )}

      {error && hasFetched && <p className="text-red-400">⚠️ {error}</p>}

      {hasFetched && !loading && (
        <>
          {/* ✅ Show total matches */}
          <p className="text-sm font-medium text-gray-300 mb-6">
            {totalAISuggestions > 0
              ? `${totalAISuggestions} donor matches found`
              : 'No donor matches yet'}
          </p>

          {/* Limit selector */}
          {totalAISuggestions > 0 && (
            <div className="mb-4 flex items-center gap-2">
              <label className="text-sm text-gray-300">Show per page:</label>
              <select
                value={limit}
                onChange={(e) => {
                  setLimit(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="bg-[#111111] border border-gray-600 rounded-md px-2 py-1 text-sm"
              >
                <option value={2}>2</option>
                <option value={5}>5</option>
                <option value={10}>10</option>
              </select>
            </div>
          )}

          {/* Suggestions list */}
          {paginatedData.length > 0 ? (
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
                        Match Score: {s.aiScore ?? 'N/A'}
                      </span>
                    </div>

                    <div className="mb-3">
                      <h3 className="font-semibold text-xl">
                        {s.fullName || 'Unnamed Donor'}
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
                        ✅ Availability:{' '}
                        {s.availabilityStatus || 'Not specified'}
                      </p>
                    </div>

                    <div className="space-y-2 text-sm">
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
            <p className="text-gray-400">No AI donor suggestions available.</p>
          )}
        </>
      )}
    </div>
  );
}
