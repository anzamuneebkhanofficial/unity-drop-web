/** @format */
'use client';

import { useEffect } from 'react';
import { usePatientAuthStore } from '@/store/auth/authPatientStore';
import DashboardNotice from '@/features/dashboard/dashboard-notice/DashboardNotice';
import { motion } from 'framer-motion';

export default function PatientDashboard() {
  const { totalDonors, fetchStats, loading } = usePatientAuthStore();

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return (
    <section className="space-y-6 text-white">
      <DashboardNotice role="patient" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface border border-white/5 p-6 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.4)]">
        <div className="space-y-1.5">
          <div className="flex items-center gap-3">
            <div className="h-2.5 w-2.5 rounded-full bg-red-600 animate-pulse shadow-[0_0_12px_rgba(220,38,38,0.5)]"></div>
            <h1 className="text-2xl font-black tracking-tighter text-white uppercase italic">Patient Dashboard</h1>
          </div>
          <p className="text-text-dim text-xs font-bold uppercase tracking-widest">
            Your active donors & help requests
          </p>
        </div>
      </div>

      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-5 w-1 bg-red-600 rounded-full"></div>
          <h2 className="text-lg font-black uppercase tracking-widest text-white">Quick Stats</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-surface-2 border border-white/5 rounded-xl p-6 shadow-xl transition-all duration-300 hover:border-red-500/30 group relative overflow-hidden flex flex-col justify-between h-40">
             <div className="flex justify-between items-start mb-6">
               <h3 className="text-[9px] font-black text-text-dim uppercase tracking-[0.2em]">Total Donors Available</h3>
             </div>
             {loading && !totalDonors ? (
               <div className="h-9 w-20 bg-white/5 rounded-md animate-pulse mt-1"></div>
             ) : (
               <p className="text-5xl font-black text-white italic tracking-tighter group-hover:text-red-500 transition-colors">
                 {totalDonors || 0}
               </p>
             )}
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-surface-2 border border-white/5 rounded-xl p-6 shadow-xl transition-all duration-300 hover:border-green-500/30 group relative overflow-hidden flex flex-col justify-between h-40">
             <div className="flex justify-between items-start mb-6">
               <h3 className="text-[9px] font-black text-text-dim uppercase tracking-[0.2em]">System Status</h3>
             </div>
             <p className="text-4xl font-black text-white italic tracking-tighter group-hover:text-green-400 transition-colors">
               Good
             </p>
          </motion.div>
        </div>
      </section>
    </section>
  );
}
