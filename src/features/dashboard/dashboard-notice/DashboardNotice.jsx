/** @format */
'use client';

import React from 'react';
import { Info, BellRing, RefreshCw, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

/**
 * Unified Dashboard Notice Component
 * Combines System Notice (refresh/reset) + Role Notice (donor/patient/admin info)
 * Used across all dashboards (admin, donor, patient) - no repetition
 */
export default function DashboardNotice({ role = 'patient' }) {
  // Role-specific notice content
  const getRoleNotice = () => {
    switch (role.toLowerCase()) {
      case 'donor':
        return {
          title: 'Important Notice for Donors',
          message: `As a donor, please check your email regularly for patient requests and admin updates. 
          You can accept or decline donation requests directly. Keeping your response prompt helps save lives.`,
          accent: 'text-blue-400',
          border: 'border-blue-500/40 bg-blue-900/20',
          iconBg: 'bg-blue-500/20',
        };

      case 'patient':
        return {
          title: 'Important Notice for Patients',
          message: `Please keep an eye on your email for donor responses and admin updates. 
          Once you send a request, you'll be updated via email about the donor's reply or any admin action. 
          Stay alert for quick communication.`,
          accent: 'text-green-400',
          border: 'border-green-500/40 bg-green-900/20',
          iconBg: 'bg-green-500/20',
        };

      case 'admin':
        return {
          title: 'Notice for Admin',
          message: `As an admin, ensure that donor and patient activities are monitored carefully. 
          Your actions affect donor eligibility and patient trust. Keep the system fair, transparent, and responsive.`,
          accent: 'text-highlight',
          border: 'border-highlight/40 bg-highlight/20',
          iconBg: 'bg-highlight/20',
        };

      default:
        return {
          title: 'Important Notice',
          message: `Please check your registered email regularly for updates and actions related to your account.`,
          accent: 'text-gray-400',
          border: 'border-gray-500/40 bg-gray-900/20',
          iconBg: 'bg-gray-500/20',
        };
    }
  };

  const roleNotice = getRoleNotice();

  // System notice actions
  const handleRefresh = () => {
    window.location.reload();
  };

  const router = useRouter();

  const handleResetSession = () => {
    localStorage.clear();
    document.cookie.split(";").forEach((c) => {
      const key = c.split("=")[0].trim();
      document.cookie = `${key}=;expires=${new Date().toUTCString()};path=/`;
    });

    let loginRoute = '/login';
    if (role.toLowerCase() === 'admin') {
      loginRoute = '/admin/login';
    } else if (role.toLowerCase() === 'donor') {
      loginRoute = '/donor/login';
    } else if (role.toLowerCase() === 'patient') {
      loginRoute = '/patient/login';
    }

    router.replace(`${loginRoute}?msg=Session reset manually.`);
  };
  return (
    <div className="space-y-4">
      {/* System Notice - For ALL roles */}
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-highlight/20 to-highlight/5 rounded-2xl blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
        <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 md:p-5 bg-surface-2/40 backdrop-blur-xl border border-white/5 rounded-xl shadow-2xl">
          {/* Icon */}
          <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-highlight/10 border border-highlight/20 flex items-center justify-center relative">
            <div className="w-2 h-2 rounded-full bg-highlight animate-ping"></div>
            <div className="absolute w-2 h-2 rounded-full bg-highlight"></div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-highlight mb-2">
              System Update Notice
            </h3>
            <div className="flex flex-wrap items-center gap-2 text-xs md:text-sm font-bold text-text-muted leading-relaxed">
              <span>To receive the latest updates,</span>
              <button
                onClick={handleRefresh}
                className="inline-flex items-center gap-1.5 text-white hover:text-highlight font-bold transition-all underline decoration-1 underline-offset-4 hover:no-underline"
              >
                <RefreshCw className="w-3 h-3" />
                refresh your window
              </button>
              <span>and if your dashboard is stuck,</span>
              <button
                onClick={handleResetSession}
                className="inline-flex items-center gap-1.5 text-donor hover:text-white font-bold transition-all underline decoration-1 underline-offset-4 hover:no-underline"
              >
                <LogOut className="w-3 h-3" />
                reset your session
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Role-Specific Notice - Dynamic based on role */}
      <div className={`p-4 rounded-xl border ${roleNotice.border} shadow-md transition hover:shadow-lg`}>
        <div className="flex items-start gap-3">
          <div className={`flex-shrink-0 w-10 h-10 rounded-lg ${roleNotice.iconBg} flex items-center justify-center`}>
            <BellRing className={`w-5 h-5 ${roleNotice.accent}`} />
          </div>
          <div className="space-y-1 min-w-0">
            <h3 className={`text-sm font-black uppercase tracking-tight ${roleNotice.accent}`}>
              {roleNotice.title}
            </h3>
            <p className="text-sm text-white/80 font-medium leading-relaxed whitespace-pre-line">
              {roleNotice.message}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
