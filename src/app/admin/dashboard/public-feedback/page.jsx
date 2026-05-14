/** @format */
'use client';

import { useEffect, useState } from 'react';
import { useAdminAuthStore } from '@/store/auth/authAdminStore';
import Pagination from '@/components/common/Pagination';
import { motion } from 'framer-motion';
import {
  MessageSquare,
  ShieldCheck,
  Calendar,
  AlertCircle,
  Mail,
  User,
  Activity
} from 'lucide-react';
import { GenericSpinner as MiniSpinner } from '@/components/ui/Skeletons';
import FeedbackMessageViewer from '@/components/common/FeedbackMessageViewer';

export default function PublicFeedbackDashboardPage() {
  const { getPublicFeedbacks, user, AdminCaught, tableLoading } = useAdminAuthStore();
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Extract admin info securely
  const isSuperAdmin = AdminCaught?.isSuperAdmin || user?.isSuperAdmin;

  useEffect(() => {
    const fetchFeedbacks = async () => {
      if (isSuperAdmin) {
        setLoading(true);
        const data = await getPublicFeedbacks();
        setFeedbacks(data || []);
        setLoading(false);
      } else {
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, [getPublicFeedbacks, isSuperAdmin]);

  // Restrict access
  if (!loading && !isSuperAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-red-500 font-black uppercase tracking-[0.2em] space-y-4">
        <AlertCircle size={48} />
        <span>Access Denied: Only the Super Admin can view this page.</span>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 space-y-8 animate-in fade-in duration-700">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-surface border border-white/5 p-8 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="h-3 w-3 rounded-full bg-highlight/80 animate-pulse shadow-[0_0_15px_rgba(var(--highlight-hex),0.5)]"></div>
            <h1 className="text-3xl font-black tracking-tighter text-white uppercase italic">Public Feedback</h1>
          </div>
          <p className="text-text-dim text-sm font-bold uppercase tracking-widest flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-highlight/80" /> Management Portal
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end mr-4">
            <span className="text-[10px] font-black text-text-dim uppercase tracking-widest leading-none">Security</span>
            <span className="text-xs font-black text-highlight uppercase italic">SuperAdmin Only</span>
          </div>
          <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-highlight to-highlight/60 flex items-center justify-center shadow-lg transform hover:-rotate-6 transition-transform">
            <ShieldCheck className="text-black w-7 h-7" />
          </div>
        </div>
      </div>

      {/* FEEDBACKS TABLE */}
      <div className="relative bg-surface border border-white/5 rounded-xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                <th className="px-8 py-6 text-[10px] font-black text-text-dim uppercase tracking-[0.3em]">User</th>
                <th className="px-8 py-6 text-[10px] font-black text-text-dim uppercase tracking-[0.3em]">Message</th>
                <th className="px-8 py-6 text-[10px] font-black text-text-dim uppercase tracking-[0.3em]">Received</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.03]">
              {loading ? (
                <tr>
                  <td colSpan={3} className="py-24 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <MiniSpinner size={40} className="text-highlight" />
                      <p className="text-[10px] font-black text-text-dim uppercase tracking-widest animate-pulse">Fetching public feedbacks...</p>
                    </div>
                  </td>
                </tr>
              ) : feedbacks.length > 0 ? (
                feedbacks.map((item, idx) => (
                  <motion.tr
                    key={item._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="group hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-8 py-5">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm font-black text-white uppercase tracking-tight">
                        <User className="w-3.5 h-3.5 text-highlight" /> {item.name}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-bold text-text-dim lowercase tracking-tight">
                          <Mail className="w-3 h-3" /> {item.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="max-w-md">
                        <FeedbackMessageViewer message={item.message} />
                      </div>
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-text-dim">
                        <Calendar className="w-3.5 h-3.5 text-highlight/60" />
                        <span className="text-[10px] font-black uppercase tracking-widest">
                          {new Date(item.createdAt).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="py-24 text-center">
                    <div className="flex flex-col items-center gap-4 opacity-50">
                      <AlertCircle className="w-12 h-12 text-gray-700" />
                      <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.4em]">No public feedback found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
