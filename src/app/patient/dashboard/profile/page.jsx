/** @format */
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePatientAuthStore } from '@/store/auth/authPatientStore';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Droplet,
  Shield,
  CheckCircle2,
  XCircle,
  Activity,
  Building2,
  Hospital,
  Trash2,
} from 'lucide-react';
import { ProfileSkeleton } from '@/components/ui/Skeletons';
import DangerZone from '@/components/common/delete-account/DangerZone';
import { toast } from 'sonner';

export default function PatientProfileView() {
  const { PatientCaught: user, getPatient, loading, deleteOurself } = usePatientAuthStore();
  const router = useRouter();

  useEffect(() => {
    getPatient();
  }, [getPatient]);

  const handleDeleteAccount = async () => {
    const success = await deleteOurself();
    if (success) {
      // toast.success('Account permanently deleted successfully.');
      router.replace('/patient/login');
    }
  };

  if (loading || !user) {
    return <ProfileSkeleton />;
  }

  const displayValue = (val) =>
    val === null || val === undefined || val === '' ? 'Not Provided' : val;

  return (
    <>
      <div className="flex flex-col gap-8 w-full max-w-5xl mx-auto animate-fadeIn pb-16">
        {/* Profile Header */}
        <div className="bg-surface border border-white/5 rounded-xl p-10 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden group flex flex-col md:flex-row items-center gap-10">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-highlight to-highlight/50 opacity-50"></div>
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-highlight/5 rounded-full blur-3xl group-hover:bg-highlight/10 transition-all duration-500"></div>

          {/* Avatar */}
          <div className="relative">
            <div className="w-40 h-40 rounded-xl border-[1px] border-white/10 bg-bg flex items-center justify-center text-6xl font-black text-white shadow-2xl relative z-10 overflow-hidden rotate-3 group-hover:rotate-0 transition-transform duration-500 italic tracking-tighter">
              {user.fullName?.charAt(0).toUpperCase() || 'P'}
              <div className="absolute inset-0 bg-white/5 group-hover:bg-transparent transition duration-300"></div>
            </div>
            </div>
          </div>

          {/* Name & Role */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left flex-1 space-y-3 relative z-10">
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-highlight shadow-[0_0_10px_rgba(var(--highlight-hex),0.5)]"></div>
              <p className="text-xs font-black uppercase tracking-[0.4em] text-highlight italic">Verified Patient</p>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase italic leading-none">
              {displayValue(user.fullName)}
            </h1>
            <div className="flex items-center gap-4 pt-2">
              <div className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-text-dim">
                Role: {displayValue(user.role)}
              </div>
            </div>
          </div>
        </div>

        {/* Profile Details Grid */}
        <div className="grid grid-cols-1 gap-8">
          <div className="bg-surface-2 border border-white/5 rounded-xl p-10 md:p-14 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/[0.02] rounded-full -mr-32 -mt-32"></div>

            <div className="flex items-center gap-6 mb-12 pb-8 border-b border-white/5 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-bg border border-white/5 flex items-center justify-center text-highlight shadow-inner">
                <User className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic">Personal Info</h2>
            </div>

            <div className="flex flex-col divide-y divide-white/5 relative z-10">
              <ProfileRow icon={User} label="Full Name" value={displayValue(user.fullName)} />
              <ProfileRow icon={Mail} label="Email" value={displayValue(user.email)} />
              <ProfileRow icon={Droplet} label="Blood Group" value={displayValue(user.bloodGroup)} valueClass="text-donor font-black scale-110 origin-right transition-transform group-hover:scale-125" />
              <ProfileRow icon={MapPin} label="Location" value={displayValue(user.location)} />
              <ProfileRow icon={Phone} label="Phone" value={displayValue(user.phone)} />
            </div>
          </div>

          <div className="bg-surface-2 border border-white/5 rounded-xl p-10 md:p-14 shadow-2xl relative overflow-hidden group">
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/[0.02] rounded-full -ml-32 -mb-32"></div>

            <div className="flex items-center gap-6 mb-12 pb-8 border-b border-white/5 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-bg border border-white/5 flex items-center justify-center text-highlight shadow-inner">
                <Hospital className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic">Hospital Info</h2>
            </div>

            <div className="flex flex-col divide-y divide-white/5 relative z-10">
              <ProfileRow icon={Building2} label="Hospital Name" value={displayValue(user.hospitalName)} />
               <ProfileRow icon={MapPin} label="Hospital Location" value={displayValue(user.hospitalLocation)} />
              <ProfileRow
                icon={user.emailVerified ? CheckCircle2 : XCircle}
                label="Email Verified"
                value={user.emailVerified ? 'Yes' : 'No'}
                valueClass={user.emailVerified ? 'text-green-500 font-black italic' : 'text-highlight font-black italic'}
              />
            </div>
          </div>

          {/* Delete Account */}
          <DangerZone
            roleName="Patient"
            onDelete={handleDeleteAccount}
            description="Permanently delete your patient account. This removes all your data, session, and medical records from our system. This action "
          />
        </div>
      </div>
    </>
  );
}

// Reusable profile row component
function ProfileRow({ icon: Icon, label, value, valueClass = 'text-white' }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between py-6 group hover:bg-white/[0.02] transition-colors rounded-xl px-4 -mx-4">
      <div className="flex items-center gap-4 mb-2 sm:mb-0">
        <div className="w-10 h-10 rounded-full bg-[#121212] border border-white/5 flex items-center justify-center text-gray-400 group-hover:text-white transition-colors">
          <Icon className="w-5 h-5" />
        </div>
        <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{label}</span>
      </div>
      <div className={`text-right text-base md:text-lg font-medium max-w-lg ${valueClass}`}>
        {value}
      </div>
    </div>
  );
}