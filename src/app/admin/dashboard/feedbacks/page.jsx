/** @format */
'use client';

import { useEffect, useState } from 'react';
import { useAdminAuthStore } from '@/store/auth/auth-admin-store';
import { toast } from 'sonner';

export default function FeedbackTable() {
  const { getAllFeedbacks, loading, error, success, resetMessages } =
    useAdminAuthStore();

  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      const res = await getAllFeedbacks();
      if (res?.feedbacks) setFeedbacks(res.feedbacks);
    };
    fetchFeedbacks();
  }, [getAllFeedbacks]);

  useEffect(() => {
    if (success) toast.success(success);
    if (error) toast.error(error);
    if (success || error) resetMessages();
  }, [success, error, resetMessages]);

  if (loading) return <p>Loading feedbacks...</p>;

  return (
    <div className="bg-bg border border-highlight p-4 rounded shadow text-text">
      <h3 className="font-semibold text-highlight">User Feedbacks</h3>
      {feedbacks.length === 0 ? (
        <p className="text-sm mt-2">No feedbacks yet 🎉</p>
      ) : (
        <table className="w-full mt-4 border-collapse border border-highlight text-sm">
          <thead>
            <tr className="bg-highlight/10">
              <th className="border p-2">User</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Message</th>
              <th className="border p-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {feedbacks.map((fb) => (
              <tr key={fb._id} className="hover:bg-highlight/5">
                <td className="border p-2">{fb.userId?.fullName}</td>
                <td className="border p-2">{fb.userId?.email}</td>
                <td className="border p-2">{fb.message}</td>
                <td className="border p-2">
                  {new Date(fb.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
