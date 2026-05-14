/** @format */
'use client';

import { useEffect } from 'react';
import { toast } from 'sonner';
import { useAdminAuthStore } from '@/store/auth/authAdminStore';
import PieChartCard from '@/features/dashboard/charts/PieChartCard';
import BarChartCard from '@/features/dashboard/charts/BarChartCard';
import DashboardNotice from '@/features/dashboard/dashboard-notice/DashboardNotice';
import { motion } from 'framer-motion';
import { CloudCog } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.23, 1, 0.32, 1],
    },
  },
};

export default function AdminOverview() {
  const {
    totalDonors,
    totalPatients,
    totalAdmins,
    totalSuperAdmins,
    donorBloodGroups,
    patientBloodGroups,
    requestStats,
    loading,
    fetchStats,
  } = useAdminAuthStore();

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // 📊 TOTAL USERS (Registered)
  const totalAnalytics = [
    { name: 'ADMINS', value: (totalAdmins || 0) + (totalSuperAdmins || 0), fill: '#3b82f6' },
    { name: 'DONORS', value: totalDonors || 0, fill: '#ef4444' },
    { name: 'PATIENTS', value: totalPatients || 0, fill: '#eab308' },
  ];

  const totalPlatformUsers = (totalDonors || 0) + (totalPatients || 0) + (totalAdmins || 0) + (totalSuperAdmins || 0);

  // Dynamic colors for blood groups
  const bloodColors = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#6366f1', '#ec4899', '#8b5cf6', '#14b8a6'];

  return (
    <motion.section
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6 bg-bg text-white min-h-screen pb-20"
    >
      {/* Admin Notice */}
      <DashboardNotice role="admin" />

      {/* Admin Dashboard Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface border border-white/5 p-6 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.4)]">
        <div className="space-y-1.5">
          <div className="flex items-center gap-3">
            <div className="h-2.5 w-2.5 rounded-full bg-highlight animate-pulse shadow-[0_0_12px_rgba(var(--highlight-hex),0.5)]"></div>
            <h1 className="text-2xl font-black tracking-tighter text-white uppercase italic">Admin Dashboard</h1>
          </div>
          <p className="text-text-dim text-xs font-bold uppercase tracking-widest">
            Detailed Platform Analytics (Database Driven)
          </p>
        </div>

        {/* Total Platform Overview Banner */}
        <div className="bg-white/[0.02] border border-white/5 p-5 rounded-xl flex items-center gap-8 relative group">
          <button
            onClick={() => {
              fetchStats();
              toast.info('Syncing: Refreshing platform data streams...');
            }}
            disabled={loading}
            className={`absolute -top-2 -right-2 w-8 h-8 rounded-full bg-highlight text-black flex items-center justify-center shadow-lg transform transition-all duration-500 hover:rotate-180 active:scale-95 ${loading ? 'opacity-50 animate-spin' : 'opacity-0 group-hover:opacity-100'}`}
            title="Refresh Intelligence Data"
          >
            <CloudCog size={16} />
          </button>
          <div className="text-right">
            <p className="text-[9px] text-text-dim uppercase font-black tracking-[0.2em] mb-1">Total Users in App</p>
            {loading && !totalDonors && !totalPatients ? (
              <div className="h-8 w-16 bg-white/5 rounded animate-pulse ml-auto"></div>
            ) : (
              <p className="text-3xl font-black text-white italic tracking-tighter leading-none">{totalPlatformUsers}</p>
            )}
          </div>
        </div>
      </div>

      {/* Primary Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Donors Card */}
        <motion.div variants={itemVariants} className="bg-surface-2 border border-white/5 rounded-xl p-6 shadow-xl transition-all duration-300 hover:border-highlight/30 group relative overflow-hidden">
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-[9px] font-black text-text-dim uppercase tracking-[0.2em]">Total Donors</h3>
          </div>
          {loading && !totalDonors ? (
            <div className="h-9 w-20 bg-white/5 rounded-md animate-pulse mt-1"></div>
          ) : (
            <p className="text-4xl font-black text-white italic tracking-tighter group-hover:text-highlight transition-colors">
              {totalDonors}
            </p>
          )}
        </motion.div>

        {/* Patients Card */}
        <motion.div variants={itemVariants} className="bg-surface-2 border border-white/5 rounded-xl p-6 shadow-xl transition-all duration-300 hover:border-highlight/30 group relative overflow-hidden">
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-[9px] font-black text-text-dim uppercase tracking-[0.2em]">Total Patients</h3>
          </div>
          {loading && !totalPatients ? (
            <div className="h-9 w-20 bg-white/5 rounded-md animate-pulse mt-1"></div>
          ) : (
            <p className="text-4xl font-black text-white italic tracking-tighter group-hover:text-highlight transition-colors">
              {totalPatients}
            </p>
          )}
        </motion.div>

        {/* Normal Admins */}
        <motion.div variants={itemVariants} className="bg-surface-2 border border-white/5 rounded-xl p-6 shadow-xl transition-all duration-300 hover:border-highlight/30 group relative overflow-hidden">
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-[9px] font-black text-text-dim uppercase tracking-[0.2em]">Total Admins</h3>
          </div>
          {loading && !totalAdmins ? (
            <div className="h-9 w-20 bg-white/5 rounded-md animate-pulse mt-1"></div>
          ) : (
            <p className="text-4xl font-black text-white italic tracking-tighter group-hover:text-highlight transition-colors">
              {totalAdmins}
            </p>
          )}
        </motion.div>

        {/* Super Admins */}
        <motion.div variants={itemVariants} className="bg-surface-2 border border-highlight/20 rounded-xl p-6 shadow-xl transition-all duration-300 hover:border-highlight group relative overflow-hidden flex flex-col justify-between">
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-[9px] font-black text-highlight uppercase tracking-[0.2em]">Total Super Admins</h3>
          </div>
          {loading && !totalSuperAdmins ? (
            <div className="h-9 w-20 bg-highlight/10 rounded-md animate-pulse mt-1"></div>
          ) : (
            <p className="text-4xl font-black text-white italic tracking-tighter relative z-10">
              {totalSuperAdmins}
            </p>
          )}
        </motion.div>

      </div>

      {/* Main Analytics Section */}
      <section className="space-y-10">
        <motion.div variants={itemVariants} className="flex items-center gap-6">
          <div className="h-6 w-1 bg-highlight rounded-full"></div>
          <h2 className="text-xl font-black uppercase tracking-widest text-white italic">Platform Analytics</h2>
          <div className="h-px flex-1 bg-white/[0.03]"></div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div variants={itemVariants} className="bg-surface-2/30 backdrop-blur-xl p-8 rounded-xl border border-white/5 shadow-2xl">
            <PieChartCard
              title="Total Users Ratio"
              data={totalAnalytics}
              className="w-full"
              height={400}
            />
          </motion.div>

          <motion.div variants={itemVariants} className="bg-surface-2/30 backdrop-blur-xl p-8 rounded-xl border border-white/5 shadow-2xl">
            <BarChartCard
              title="Total Users Count"
              data={totalAnalytics}
              className="w-full"
              height={400}
            />
          </motion.div>
        </div>
      </section>
    </motion.section>
  );
}
