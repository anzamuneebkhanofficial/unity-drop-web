/** @format */
'use client';
import { usePatientAuthStore } from '@/store/auth/auth-patient-store';
import { useEffect, useState } from 'react';
import Pagination from '@/components/Pagination'; // ✅ reuse your pagination

export default function ResponsesList() {
  const { responses, fetchAdminDonorResponses, loading, error } =
    usePatientAuthStore();

  // ✅ Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 2; // always 2 per page

  useEffect(() => {
    fetchAdminDonorResponses();
  }, [fetchAdminDonorResponses]);

  if (loading) return <p className="text-gray-500">Loading responses...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!responses?.length)
    return <p className="text-gray-600">No responses yet.</p>;

  // ✅ Pagination logic
  const startIndex = (currentPage - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedData = responses.slice(startIndex, endIndex);
  const pageCount = Math.ceil(responses.length / limit);

  return (
    <div className="space-y-4">
      {paginatedData.map((res) => (
        <div key={res._id} className="p-4 border rounded-lg shadow-sm bg-white">
          <p className="text-sm text-gray-800">
            <strong>Donor:</strong> {res?.donorId?.fullName} (
            {res?.donorId?.email})
          </p>
          <p className="text-sm text-gray-800">
            <strong>Admin:</strong> {res?.createdBy?.fullName}
          </p>
          <p className="text-sm text-gray-600">
            <strong>Message:</strong> {res?.message || 'No message'}
          </p>
          <p className="text-xs text-gray-400">
            {new Date(res.createdAt).toLocaleString()}
          </p>
        </div>
      ))}

      {/* ✅ Pagination Controls */}
      <Pagination
        pageCount={pageCount}
        currentPage={currentPage}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  );
}
