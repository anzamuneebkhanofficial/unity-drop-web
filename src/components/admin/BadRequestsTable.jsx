/** @format */

'use client';

import { useAdminAuthStore } from '@/store/auth/auth-admin-store';
import { useEffect } from 'react';

import { toast } from 'sonner';

export default function BadRequestsTable() {
  const {
    badRequests,
    loading,
    fetchBadRequests,
    resolveBadRequest,
    success,
    error,
    resetMessages,
  } = useAdminAuthStore();

  useEffect(() => {
    fetchBadRequests();
  }, [fetchBadRequests]);

  useEffect(() => {
    if (success) toast.success(success);
    if (error) toast.error(error);
    if (success || error) resetMessages();
  }, [success, error, resetMessages]);

  const handleAction = async (id, action) => {
    await resolveBadRequest(id, action);
  };

  if (loading) return <p>Loading pending requests...</p>;

  return (
    <div className="bg-bg border border-highlight p-4 rounded shadow text-text">
      <h3 className="font-semibold text-highlight">Bad Requests</h3>
      {badRequests.length === 0 ? (
        <p className="text-sm mt-2">No Bad Requests 🎉</p>
      ) : (
        <table className="w-full mt-4 border-collapse border border-highlight text-sm">
          <thead>
            <tr className="bg-highlight/10">
              <th className="border p-2">Donor</th>
              <th className="border p-2">Patient</th>
              <th className="border p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {badRequests.map((req) => (
              <tr key={req._id} className="hover:bg-highlight/5">
                <td className="border p-2">
                  {req.donorId?.fullName} <br />
                  <span className="text-xs text-gray-500">
                    {req.donorId?.email}
                  </span>
                </td>
                <td className="border p-2">
                  {req.patientId?.fullName} <br />
                  <span className="text-xs text-gray-500">
                    {req.patientId?.email}
                  </span>
                </td>
                <td className="border p-2 space-x-2">
                  {['Forgive', 'Ignore', 'Ban'].map((action) => (
                    <button
                      key={action}
                      onClick={() => handleAction(req._id, action)}
                      disabled={resolveLoading}
                      className={`px-3 py-1 rounded text-white ${
                        action === 'Ban'
                          ? 'bg-red-600 hover:bg-red-700'
                          : action === 'Forgive'
                          ? 'bg-green-600 hover:bg-green-700'
                          : 'bg-yellow-600 hover:bg-yellow-700'
                      }`}
                    >
                      {loading ? '...' : action}
                    </button>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
