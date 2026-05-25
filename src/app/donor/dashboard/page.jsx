
'use client';

import { useEffect } from 'react';
import { useDonorAuthStore } from '@/store/auth/authDonorStore';
import DashboardNotice from '@/features/dashboard/dashboard-notice/DashboardNotice';
import { ShieldCheck, Droplet, Activity } from 'lucide-react';

import SystemHealthCard from '@/components/common/SystemHealthCard';

export default function DonorDashboard() {
  const {
    fetchStats,
    loading,
    totalRejected,
    totalApproved,
    totalRequests,
    pendingRequests,
    DonorCaught: user,
    getDonor
  } = useDonorAuthStore();

  useEffect(() => {
    fetchStats();
    getDonor();
  }, [fetchStats, getDonor]);
  const stats = [
    { label: 'Total Requests', value: totalRequests, color: 'text-blue-500', hover: 'hover:border-blue-500/30' },
    { label: 'Pending Requests', value: pendingRequests, color: 'text-yellow-500', hover: 'hover:border-yellow-500/30' },
    { label: 'Approved Requests', value: totalApproved, color: 'text-emerald-500', hover: 'hover:border-emerald-500/30' },
    { label: 'Rejected Requests', value: totalRejected, color: 'text-red-500', hover: 'hover:border-red-500/30' },
  ];

  return (
    <section className="space-y-8 text-white pb-10">
      <DashboardNotice role="donor" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface border border-white/5 p-6 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.4)]">
        <div className="space-y-1.5">
          <div className="flex items-center gap-3">
            <div className="h-2.5 w-2.5 rounded-full bg-red-600 animate-pulse shadow-[0_0_12px_rgba(220,38,38,0.5)]"></div>
            <h1 className="text-2xl font-black tracking-tighter text-white uppercase italic">Donor Dashboard</h1>
          </div>
          <p className="text-text-dim text-xs font-bold uppercase tracking-widest">
            Request Analytics & System Health
          </p>
        </div>

        <SystemHealthCard className="!p-4 border-red-500/5 bg-white/[0.02] min-w-[240px]" />
      </div>
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="h-5 w-1 bg-emerald-500 rounded-full"></div>
          <h2 className="text-lg font-black uppercase tracking-widest text-white italic">My Status & Profile</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            style={{ animationDelay: '50ms' }}
            className="bg-surface-2 border border-white/5 rounded-xl p-6 shadow-xl transition-all duration-300 hover:border-emerald-500/30 group relative overflow-hidden flex flex-col justify-between h-36 animate-fade-up opacity-0"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-[9px] font-black text-text-dim uppercase tracking-[0.2em]">Donor Status</h3>
              <ShieldCheck className="w-5 h-5 text-emerald-500/50 group-hover:text-emerald-500 transition-colors" />
            </div>
            <div className="flex items-center gap-3">
              <div className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
              <p className="text-3xl font-black text-white italic tracking-tighter uppercase group-hover:text-emerald-500 transition-colors">
                Available
              </p>
            </div>
          </div>
          <div
            style={{ animationDelay: '100ms' }}
            className="bg-surface-2 border border-white/5 rounded-xl p-6 shadow-xl transition-all duration-300 hover:border-rose-500/30 group relative overflow-hidden flex flex-col justify-between h-36 animate-fade-up opacity-0"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-[9px] font-black text-text-dim uppercase tracking-[0.2em]">My Blood Group</h3>
              <Droplet className="w-5 h-5 text-rose-500/50 group-hover:text-rose-500 transition-colors" />
            </div>
            {loading && user == null ? (
              <div className="h-9 w-20 bg-white/5 rounded-md animate-pulse mt-1"></div>
            ) : (
              <p className="text-4xl font-black text-white italic tracking-tighter group-hover:text-rose-500 transition-colors">
                {user?.bloodGroup || 'Not Set'}
              </p>
            )}
          </div>
          <div
            style={{ animationDelay: '150ms' }}
            className="bg-surface-2 border border-white/5 rounded-xl p-6 shadow-xl transition-all duration-300 hover:border-cyan-500/30 group relative overflow-hidden flex flex-col justify-between h-36 animate-fade-up opacity-0"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-[9px] font-black text-text-dim uppercase tracking-[0.2em]">My Response Rate</h3>
              <Activity className="w-5 h-5 text-cyan-500/50 group-hover:text-cyan-500 transition-colors" />
            </div>
            <div>
              <p className="text-4xl font-black text-white italic tracking-tighter group-hover:text-cyan-500 transition-colors">
                85%
              </p>
              <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mt-1 block">Excellent Performance</span>
            </div>
          </div>
        </div>
      </section>
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="h-5 w-1 bg-red-600 rounded-full"></div>
          <h2 className="text-lg font-black uppercase tracking-widest text-white italic">Platform Pulse</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, idx) => (
            <StatCard
              key={stat.label}
              stat={stat}
              idx={idx}
              loading={loading}
            />
          ))}
        </div>
      </section>
    </section>
  );
}

function StatCard({ stat, idx, loading }) {
  const isDataMissing = stat.value == null;

  return (
    <div
      style={{ animationDelay: `${idx * 100 + 200}ms` }}
      className={`bg-surface-2 border border-white/5 rounded-xl p-6 shadow-xl transition-all duration-300 ${stat.hover} group relative overflow-hidden flex flex-col justify-between h-36 animate-fade-up opacity-0`}
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-[9px] font-black text-text-dim uppercase tracking-[0.2em]">{stat.label}</h3>
      </div>
      {loading && isDataMissing ? (
        <div className="h-9 w-20 bg-white/5 rounded-md animate-pulse mt-1"></div>
      ) : (
        <p className={`text-4xl font-black text-white italic tracking-tighter group-hover:${stat.color} transition-colors`}>
          {stat.value || 0}
        </p>
      )}
    </div>
  );
}
