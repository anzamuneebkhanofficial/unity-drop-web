
'use client';

import { useEffect, useState } from 'react';
import { useAdminAuthStore } from '@/store/auth/authAdminStore';
import Pagination from '@/components/common/Pagination';
import FeedbackMessageViewer from '@/components/common/FeedbackMessageViewer';
import { MessageSquare, Star, User, Activity, Clock } from 'lucide-react';
import { fmtDate } from '@/lib/fmtDate';

const PER_PAGE = 6;

const reactionLabel = {
  '❤️': 'Excellent',
  '🔥': 'Critical',
  '😡': 'Angry',
  '👍': 'Good',
};

const ratingBadge = (rating) => {
  if (rating == null) {
    return { label: '—', classes: 'bg-[#1a1a1a] text-gray-400 border border-white/5' };
  }
  if (rating <= 2) {
    return { label: `${rating} / 5`, classes: 'bg-red-500/10 text-red-400 border border-red-500/20' };
  }
  if (rating <= 4) {
    return { label: `${rating} / 5`, classes: 'bg-blue-500/10 text-blue-400 border border-blue-500/20' };
  }
  return { label: `${rating} / 5`, classes: 'bg-green-500/10 text-green-400 border border-green-500/20' };
};

export default function FeedbackTable() {
  const { getAllFeedbacks, loading, feedbacks } = useAdminAuthStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    getAllFeedbacks(1, 100);
  }, [getAllFeedbacks]);

  const pageCount = Math.max(1, Math.ceil((feedbacks?.length || 0) / PER_PAGE));

  const start = (currentPage - 1) * PER_PAGE;
  const visible = (feedbacks || []).slice(start, start + PER_PAGE);

  if (!mounted) return null;

  if (loading && (!feedbacks || feedbacks.length === 0)) {
    return (
      <div className="flex flex-col items-center justify-center p-20 text-gray-500 gap-6">
        <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
        <p className="font-mono text-sm uppercase tracking-[0.3em] font-black animate-pulse">Loading feedbacks...</p>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto animate-fadeIn pb-12">
      <div className="bg-[#0c0c0c] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl relative p-8 md:p-12">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-highlight to-blue-500 opacity-50"></div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-8 border-b border-white/5">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#121212] border border-white/5 flex items-center justify-center text-blue-500 shadow-inner group hover:border-blue-500/50 transition-all duration-500">
              <MessageSquare className="w-8 h-8 group-hover:scale-110 transition-transform" />
            </div>
            <div>
              <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic">All Feedbacks</h2>
              <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] mt-1">User feedback from donors and patients</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-[#121212] border border-white/5 px-8 py-4 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.3)]">
            <div className="flex flex-col items-end">
              <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest leading-none mb-1">Total Feedbacks</span>
              <span className="text-xl font-black text-blue-500 italic tracking-tighter leading-none">{feedbacks?.length || 0}</span>
            </div>
            <div className="h-8 w-[1px] bg-white/5 mx-2"></div>
            <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center">
              <Activity className="w-5 h-5 text-blue-500 animate-pulse" />
            </div>
          </div>
        </div>

        {feedbacks?.length === 0 ? (
          <div className="text-center py-32 bg-[#0a0a0a] rounded-3xl border border-dashed border-white/5">
            <p className="text-[10px] font-black text-gray-700 uppercase tracking-[0.4em]">No feedbacks found 📡</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
              {visible.map((fb, idx) => {
                const user = fb.userId ?? {};
                const role = fb.userModel ?? 'Unknown';
                const rLabel = reactionLabel[fb.reaction] ?? 'Reaction';
                const rb = ratingBadge(fb.rating);

                const ratingText = {
                  1: 'Poor',
                  2: 'Critical',
                  3: 'Good',
                  4: 'Excellent',
                  5: 'Perfect'
                }[fb.rating] || 'Nominal';

                return (
                  <article
                    key={fb._id}
                    className="bg-[#121212]/50 backdrop-blur-sm border border-white/5 rounded-[2.5rem] p-8 flex flex-col hover:border-blue-500/30 transition-all duration-500 group relative overflow-hidden animate-in fade-in slide-in-from-bottom-5"
                    style={{ animationDelay: `${idx * 100}ms` }}
                  >
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                      <MessageSquare className="w-20 h-20 -mr-6 -mt-6" />
                    </div>

                    <div className="flex justify-between items-center mb-8">
                      <span className={`text-[9px] px-4 py-1.5 rounded-full font-black tracking-widest uppercase border ${role === 'Donor' ? 'bg-donor/10 text-donor border-donor/20' : role === 'Patient' ? 'bg-highlight/10 text-highlight border-highlight/20' : 'bg-gray-800 text-gray-300 border-white/5'}`}>
                        {role}
                      </span>
                      <div className={`px-4 py-1.5 text-[10px] font-black rounded-xl flex items-center gap-2 shadow-lg ${rb.classes}`}>
                        <Star className="w-3 h-3 fill-current" /> {ratingText} ({rb.label})
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mb-8 bg-white/[0.01] p-4 rounded-2xl border border-white/5">
                      <div className="w-14 h-14 rounded-2xl bg-[#1a1a1a] border border-white/5 flex items-center justify-center text-gray-500 group-hover:border-blue-500/40 transition-all duration-500 shadow-inner overflow-hidden">
                        <User className="w-7 h-7 group-hover:text-blue-400 transition-colors" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[8px] font-black text-gray-600 uppercase tracking-widest block mb-1">User</span>
                        <h3 className="font-black text-white uppercase tracking-tighter text-md truncate">{user.fullName ?? 'Unknown User'}</h3>
                        <p className="text-[11px] font-bold text-gray-600 truncate tracking-tight">{user.email ?? 'No email'}</p>
                      </div>
                    </div>

                    <div className="flex-1 bg-white/[0.02] rounded-3xl p-6 border border-white/5 group-hover:bg-white/[0.03] transition-colors relative">
                      <span className="text-[8px] font-black text-gray-600 uppercase tracking-widest block mb-4 border-b border-white/5 pb-2">Feedback Message</span>
                      <FeedbackMessageViewer message={fb.message} maxLength={200} />
                    </div>

                    <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between gap-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-[8px] font-black text-gray-700 uppercase tracking-widest">Submitted On</span>
                        <div className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-[0.1em]">
                          <Clock className="w-4 h-4 text-blue-500/50" />
                          {fmtDate(fb.createdAt) || '-'}
                        </div>
                      </div>
                      {fb.reaction && (
                        <div className="flex flex-col items-end gap-1">
                          <span className="text-[8px] font-black text-gray-700 uppercase tracking-widest">Reaction</span>
                          <div className="flex items-center gap-3 bg-[#1a1a1a] border border-white/5 px-4 py-2 rounded-xl shadow-inner">
                            <span className="text-xl">{fb.reaction}</span>
                            <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest">{rLabel}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>

            <div className="mt-16 flex justify-center bg-[#0a0a0a] border border-white/5 py-8 rounded-3xl shadow-xl">
              <Pagination
                pageCount={pageCount}
                onPageChange={(page) => setCurrentPage(page)}
                currentPage={currentPage}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}