/** @format */
'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { toast } from 'sonner';
import PatientRequestCard from './PatientRequestCard';
import { useDonorAuthStore } from '@/store/auth/authDonorStore';
import Pagination from '@/components/common/Pagination';

import { HeartPulse, ShieldCheck, ClipboardCheck, Activity, Search } from 'lucide-react';

const PER_PAGE_DEFAULT = 6;

export default function PatientRequestsList() {
  const {
    requests,
    fetchRequests,
    updateRequestStatus,
    loadingRequests,
    errorRequests,
    successRequests,
    resetMessages,
  } = useDonorAuthStore();

  const [currentPage, setCurrentPage] = useState(1);
  const [expanded, setExpanded] = useState({}); // id => bool

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  // Manual toast listener removed (apiWrapper handles this globally)

  const pageCount = Math.max(1, Math.ceil((requests?.length || 0) / PER_PAGE_DEFAULT));

  const visible = useMemo(() => {
    const start = (currentPage - 1) * PER_PAGE_DEFAULT;
    return (requests || []).slice(start, start + PER_PAGE_DEFAULT);
  }, [requests, currentPage]);

  const toggleExpand = (id) => {
    setExpanded((s) => ({ ...s, [id]: !s[id] }));
  };

  const handleUpdateStatus = async (id, status) => {
    await updateRequestStatus(id, status);
    // store triggers successRequests/errorRequests; toasts handled by useEffect above
  };

  if (loadingRequests) {
    return (
      <div className="py-10 flex justify-center items-center text-gray-300 animate-pulse">
        Loading patient requests...
      </div>
    );
  }

  if (!loadingRequests && (!requests || requests.length === 0)) {
    return (
      <div className="py-8 text-center text-gray-400">
        No patient requests available.
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-2 duration-700">
      {/* PROFESSIONAL BANNER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-[#0f0f0f] border border-white/5 p-8 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-3">
            <div className="h-3 w-3 rounded-full bg-donor/80 animate-pulse shadow-[0_0_15px_rgba(231,77,42,0.5)]"></div>
            <h1 className="text-3xl font-black tracking-tighter text-white uppercase italic">Blood Requests</h1>
          </div>
          <p className="text-gray-500 text-sm font-bold uppercase tracking-widest flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-donor/80" /> Patient Request Stream
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-4">
          <div className="flex flex-col items-end mr-2 text-right">
            <span className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] leading-none mb-1">Queue Status</span>
            <span className="text-xs font-black text-highlight uppercase tracking-wider">{requests?.length || 0} Total Requests</span>
          </div>
          <div className="h-14 w-14 bg-donor/80 rounded-xl flex items-center justify-center shadow-[0_10px_30px_rgba(231,77,42,0.2)] group-hover:rotate-12 transition-all duration-500">
            <HeartPulse className="text-white w-7 h-7" />
          </div>
        </div>
      </div>

      {/* REQUESTS LIST GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {visible.map((req, idx) => (
          <div 
            key={req._id} 
            className="animate-in fade-in slide-in-from-bottom-4 duration-500" 
            style={{ animationDelay: `${idx * 100}ms` }}
          >
            <PatientRequestCard
              request={req}
              onUpdateStatus={handleUpdateStatus}
              expanded={!!expanded[req._id]}
              onToggleExpand={toggleExpand}
            />
          </div>
        ))}
      </div>

      {/* PAGINATION SECTION */}
      {pageCount > 1 && (
        <div className="mt-12 flex justify-center bg-[#0c0c0c] border border-white/5 py-6 rounded-xl shadow-2xl">
          <Pagination
            pageCount={pageCount}
            currentPage={currentPage}
            onPageChange={(p) => setCurrentPage(p)}
          />
        </div>
      )}

      {/* FOOTER INFO */}
      <div className="flex items-center justify-between pt-8 border-t border-white/5 text-[10px] font-black uppercase tracking-[0.3em] text-gray-700">
        <div className="flex items-center gap-3">
          <Activity className="w-4 h-4 text-donor/50 animate-pulse" />
          <span>Monitoring active blood requests...</span>
        </div>
      </div>
    </div>
  );
}
