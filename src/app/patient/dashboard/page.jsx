
'use client';

import { useEffect } from 'react';
import { usePatientAuthStore } from '@/store/auth/authPatientStore';
import DashboardNotice from '@/features/dashboard/dashboard-notice/DashboardNotice';
import { ClipboardCheck, Droplet, Clock, HeartPulse, UserCheck } from 'lucide-react';
import SystemHealthCard from '@/components/common/SystemHealthCard';
const STATUS_STYLES = {
  'No Request': { text: 'text-gray-400', hover: 'hover:border-gray-500/30', dot: 'bg-gray-500' },
  'Pending': { text: 'text-yellow-500', hover: 'hover:border-yellow-500/30', dot: 'bg-yellow-500 animate-pulse' },
  'Approved': { text: 'text-emerald-500', hover: 'hover:border-emerald-500/30', dot: 'bg-emerald-500' },
  'Rejected': { text: 'text-rose-500', hover: 'hover:border-rose-500/30', dot: 'bg-rose-500' },
  'Expired': { text: 'text-amber-600', hover: 'hover:border-amber-600/30', dot: 'bg-amber-600' },
};

export default function PatientDashboard() {
  const {
    totalDonors,
    pendingMyRequests,
    totalDonationsReceived,
    fetchStats,
    loading,
    PatientCaught: user,
    getPatient,
    requests,
    fetchRequests
  } = usePatientAuthStore();

  useEffect(() => {
    fetchStats();
    getPatient();
    fetchRequests();
  }, [fetchStats, getPatient, fetchRequests]);

  const getLatestRequestStatus = () => {
    if (!requests || requests.length === 0) return 'No Request';
    const latest = requests[0];

    // Check expiration
    if (latest.expiresAt && new Date() > new Date(latest.expiresAt)) {
      return 'Expired';
    }
    return latest.status || 'No Request';
  };

  const activeStatus = getLatestRequestStatus();
  const statusStyle = STATUS_STYLES[activeStatus] || STATUS_STYLES['No Request'];

  return (
    <section className="space-y-8 text-white pb-10">
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

        <SystemHealthCard className="!p-4 border-red-500/5 bg-white/[0.02] min-w-[240px]" />
      </div>

      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="h-5 w-1 bg-red-600 rounded-full"></div>
          <h2 className="text-lg font-black uppercase tracking-widest text-white italic">Request & Matching Status</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          <div
            style={{ animationDelay: '50ms' }}
            className={`bg-surface-2 border border-white/5 rounded-xl p-6 shadow-xl transition-all duration-300 ${statusStyle.hover} group relative overflow-hidden flex flex-col justify-between h-36 animate-fade-up opacity-0`}
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-[9px] font-black text-text-dim uppercase tracking-[0.2em]">Active Request Status</h3>
              <ClipboardCheck className={`w-5 h-5 text-gray-500 group-hover:${statusStyle.text} transition-colors`} />
            </div>
            <div className="flex items-center gap-2.5">
              <div className={`h-2.5 w-2.5 rounded-full ${statusStyle.dot} shadow-[0_0_8px_currentColor]`}></div>
              <p className={`text-3xl font-black italic tracking-tighter uppercase ${statusStyle.text}`}>
                {activeStatus}
              </p>
            </div>
          </div>


          <div
            style={{ animationDelay: '100ms' }}
            className="bg-surface-2 border border-white/5 rounded-xl p-6 shadow-xl transition-all duration-300 hover:border-rose-500/30 group relative overflow-hidden flex flex-col justify-between h-36 animate-fade-up opacity-0"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-[9px] font-black text-text-dim uppercase tracking-[0.2em]">Blood Group Needed</h3>
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
              <h3 className="text-[9px] font-black text-text-dim uppercase tracking-[0.2em]">Estimated Match Time</h3>
              <Clock className="w-5 h-5 text-cyan-500/50 group-hover:text-cyan-500 transition-colors" />
            </div>
            <div>
              <p className="text-4xl font-black text-white italic tracking-tighter group-hover:text-cyan-500 transition-colors">
                15 Mins
              </p>
              <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mt-1 block">
                {totalDonors != null ? `${totalDonors} donors available for type ${user?.bloodGroup || 'your type'}` : 'Checking available donors...'}
              </span>
            </div>
          </div>
        </div>
      </section>


      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="h-5 w-1 bg-red-600 rounded-full"></div>
          <h2 className="text-lg font-black uppercase tracking-widest text-white italic">Platform Analytics</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          <div
            style={{ animationDelay: '200ms' }}
            className="bg-surface-2 border border-white/5 rounded-xl p-6 shadow-xl transition-all duration-300 hover:border-red-500/30 group relative overflow-hidden flex flex-col justify-between h-36 animate-fade-up opacity-0"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-[9px] font-black text-text-dim uppercase tracking-[0.2em]">Total Donors Available</h3>
              <UserCheck className="w-5 h-5 text-red-500/50 group-hover:text-red-500 transition-colors" />
            </div>
            {loading && totalDonors == null ? (
              <div className="h-9 w-20 bg-white/5 rounded-md animate-pulse mt-1"></div>
            ) : (
              <p className="text-4xl font-black text-white italic tracking-tighter group-hover:text-red-500 transition-colors">
                {totalDonors || 0}
              </p>
            )}
          </div>


          <div
            style={{ animationDelay: '250ms' }}
            className="bg-surface-2 border border-white/5 rounded-xl p-6 shadow-xl transition-all duration-300 hover:border-yellow-500/30 group relative overflow-hidden flex flex-col justify-between h-36 animate-fade-up opacity-0"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-[9px] font-black text-text-dim uppercase tracking-[0.2em]">My Pending Requests</h3>
              <Clock className="w-5 h-5 text-yellow-500/50 group-hover:text-yellow-500 transition-colors" />
            </div>
            {loading && pendingMyRequests == null ? (
              <div className="h-9 w-20 bg-white/5 rounded-md animate-pulse mt-1"></div>
            ) : (
              <p className="text-4xl font-black text-white italic tracking-tighter group-hover:text-yellow-500 transition-colors">
                {pendingMyRequests || 0}
              </p>
            )}
          </div>


          <div
            style={{ animationDelay: '300ms' }}
            className="bg-surface-2 border border-white/5 rounded-xl p-6 shadow-xl transition-all duration-300 hover:border-emerald-500/30 group relative overflow-hidden flex flex-col justify-between h-36 animate-fade-up opacity-0"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-[9px] font-black text-text-dim uppercase tracking-[0.2em]">Donations Received</h3>
              <HeartPulse className="w-5 h-5 text-emerald-500/50 group-hover:text-emerald-500 transition-colors" />
            </div>
            {loading && totalDonationsReceived == null ? (
              <div className="h-9 w-20 bg-white/5 rounded-md animate-pulse mt-1"></div>
            ) : (
              <p className="text-4xl font-black text-white italic tracking-tighter group-hover:text-emerald-500 transition-colors">
                {totalDonationsReceived || 0}
              </p>
            )}
          </div>
        </div>
      </section>
    </section>
  );
}