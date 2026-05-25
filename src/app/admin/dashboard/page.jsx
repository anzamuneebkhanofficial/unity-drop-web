
'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useAdminAuthStore } from '@/store/auth/authAdminStore';
import PieChartCard from '@/features/dashboard/charts/PieChartCard';
import BarChartCard from '@/features/dashboard/charts/BarChartCard';
import DashboardNotice from '@/features/dashboard/dashboard-notice/DashboardNotice';
import { CloudCog } from 'lucide-react';
import SystemHealthCard from '@/components/common/SystemHealthCard';

export default function AdminOverview() {
  const [mounted, setMounted] = useState(false);
  const {
    totalDonors, totalPatients, totalAdmins, totalSuperAdmins,
    loading, fetchStats,
  } = useAdminAuthStore();

  useEffect(() => {
    setMounted(true);
    fetchStats();
  }, [fetchStats]);

  const totalAnalytics = [
    { name: 'ADMINS', value: (totalAdmins || 0) + (totalSuperAdmins || 0), fill: '#3b82f6' },
    { name: 'DONORS', value: totalDonors || 0, fill: '#ef4444' },
    { name: 'PATIENTS', value: totalPatients || 0, fill: '#eab308' },
  ];

  const totalPlatformUsers = (totalDonors || 0) + (totalPatients || 0) + (totalAdmins || 0) + (totalSuperAdmins || 0);

  if (!mounted) return null;

  return (
    <section
      className="space-y-6 bg-bg text-white min-h-screen pb-20"
    >
      <DashboardNotice role="admin" />
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface border border-white/5 p-6 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.4)]">
        <div className="space-y-1.5">
          <div className="flex items-center gap-3">
            <div className="h-2.5 w-2.5 rounded-full bg-highlight animate-pulse shadow-[0_0_12px_rgba(var(--highlight-hex),0.5)]"></div>
            <h1 className="text-2xl font-black tracking-tighter text-white uppercase italic">Admin Dashboard</h1>
          </div>
          <p className="text-text-dim text-xs font-bold uppercase tracking-widest">
            Detailed Platform Analytics
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch gap-4">
          <div className="bg-white/[0.02] border border-white/5 p-5 rounded-xl flex items-center gap-8 relative group min-w-[200px]">
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
            <div className="text-right w-full">
              <p className="text-[9px] text-text-dim uppercase font-black tracking-[0.2em] mb-1">Total Users in App</p>
              {loading && totalPlatformUsers == null ? (
                <div className="h-8 w-16 bg-white/5 rounded animate-pulse ml-auto"></div>
              ) : (
                <p className="text-3xl font-black text-white italic tracking-tighter leading-none">{totalPlatformUsers}</p>
              )}
            </div>
          </div>
          <SystemHealthCard className="!p-4 border-white/5 bg-white/[0.02] min-w-[240px]" />
        </div>
      </div>
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="h-5 w-1 bg-highlight rounded-full"></div>
          <h2 className="text-lg font-black uppercase tracking-widest text-white italic">Administrative Registry</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard label="Total Donors" value={totalDonors} loading={loading} delay="50ms" />
          <StatCard label="Total Patients" value={totalPatients} loading={loading} delay="100ms" />
          <StatCard label="Total Admins" value={totalAdmins} loading={loading} delay="150ms" />
          <StatCard label="Total Super Admins" value={totalSuperAdmins} loading={loading} isPrimary delay="200ms" />
        </div>
      </section>
      <section className="space-y-10">
        <div style={{ animationDelay: '250ms' }} className="flex items-center gap-6 animate-fade-up opacity-0">
          <div className="h-6 w-1 bg-highlight rounded-full"></div>
          <h2 className="text-xl font-black uppercase tracking-widest text-white italic">Platform Analytics</h2>
          <div className="h-px flex-1 bg-white/[0.03]"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div style={{ animationDelay: '300ms' }} className="bg-surface-2/30 backdrop-blur-xl p-8 rounded-xl border border-white/5 shadow-2xl animate-fade-up opacity-0">
            <PieChartCard title="Total Users Ratio" data={totalAnalytics} className="w-full" height={400} />
          </div>
          <div style={{ animationDelay: '350ms' }} className="bg-surface-2/30 backdrop-blur-xl p-8 rounded-xl border border-white/5 shadow-2xl animate-fade-up opacity-0">
            <BarChartCard title="Total Users Count" data={totalAnalytics} className="w-full" height={400} />
          </div>
        </div>
      </section>
    </section>
  );
}
function StatCard({ label, value, loading, isPrimary = false, delay }) {
  return (
    <div
      style={{ animationDelay: delay }}
      className={`bg-surface-2 border ${isPrimary ? 'border-highlight/20 hover:border-highlight' : 'border-white/5 hover:border-highlight/30'} rounded-xl p-6 shadow-xl transition-all duration-300 group relative overflow-hidden animate-fade-up opacity-0`}
    >
      <h3 className={`text-[9px] font-black uppercase tracking-[0.2em] mb-6 ${isPrimary ? 'text-highlight' : 'text-text-dim'}`}>
        {label}
      </h3>
      {loading && value == null ? (
        <div className="h-9 w-20 bg-white/5 rounded-md animate-pulse"></div>
      ) : (
        <p className="text-4xl font-black text-white italic tracking-tighter group-hover:text-highlight transition-colors">
          {value || 0}
        </p>
      )}
    </div>
  );
}