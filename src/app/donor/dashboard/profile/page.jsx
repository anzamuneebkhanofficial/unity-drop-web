
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDonorAuthStore } from '@/store/auth/authDonorStore';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Droplet,
  Shield,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { ProfileSkeleton } from '@/components/ui/Skeletons';
import DangerZone from '@/components/common/delete-account/DangerZone';

export default function DonorProfileView() {
  const { DonorCaught: user, getDonor, loading, deleteOurself } = useDonorAuthStore();
  const router = useRouter();

  useEffect(() => {
    getDonor();
  }, [getDonor]);

  const handleDeleteAccount = async () => {
    try {
      const success = await deleteOurself();
      if (success) {
        router.replace('/donor/login');
      }
    } catch (error) {
      console.error('Failed to delete account:', error);
    }
  };

  if (loading || !user) {
    return <ProfileSkeleton />;
  }

  const displayValue = (val) =>
    val === null || val === undefined || val === '' ? 'Not Provided' : val;

  return (
    <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto animate-fadeIn pb-10">

      <div className="bg-[#0f0f0f] border border-white/5 rounded-[2rem] p-8 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden group flex flex-col md:flex-row items-center gap-8">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-donor to-highlight opacity-50"></div>


        <div className="relative">
          <div className="w-32 h-32 rounded-full border-[4px] border-[#1a1a1a] bg-[#121212] flex items-center justify-center text-5xl font-black text-white shadow-2xl relative z-10 overflow-hidden">
            {user.fullName?.charAt(0).toUpperCase() || 'D'}
            <div className="absolute inset-0 bg-white/5 group-hover:bg-transparent transition duration-300"></div>
          </div>
        </div>


        <div className="flex flex-col items-center md:items-start text-center md:text-left flex-1">
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight uppercase mb-2">
            {displayValue(user.fullName)}
          </h1>
          <div className="flex items-center gap-3 text-sm font-semibold uppercase tracking-widest text-donor">
            <Shield className="w-4 h-4" />
            <span>{displayValue(user.role)} PROFILE</span>
          </div>
        </div>
      </div>


      <div className="bg-[#0c0c0c] border border-white/5 rounded-xl p-8 md:p-12 shadow-2xl relative">
        <div className="flex items-center gap-3 mb-8 pb-6 border-b border-white/5">
          <User className="w-6 h-6 text-gray-400" />
          <h2 className="text-xl font-bold text-white uppercase tracking-wider">Personal Details</h2>
        </div>

        <div className="flex flex-col divide-y divide-white/5">
          <ProfileRow icon={User} label="Full Name" value={displayValue(user.fullName)} />
          <ProfileRow icon={Mail} label="Email" value={displayValue(user.email)} />
          <ProfileRow
            icon={user?.emailVerified ? CheckCircle2 : XCircle}
            label="Email Status"
            value={user?.emailVerified ? 'Verified' : 'Unverified'}
            valueClass={user?.emailVerified ? 'text-green-500 font-bold italic' : 'text-highlight font-bold italic'}
          />
          <ProfileRow icon={Shield} label="Role" value={displayValue(user.role)} />
          <ProfileRow icon={User} label="Gender" value={displayValue(user.gender)} />
          <ProfileRow
            icon={Droplet}
            label="Blood Group"
            value={displayValue(user.bloodGroup)}
            valueClass="text-donor font-bold"
          />
          <ProfileRow icon={MapPin} label="Location" value={displayValue(user.location)} />
          <ProfileRow icon={Phone} label="Phone Number" value={displayValue(user.phone)} />
        </div>
      </div>


      <DangerZone
        roleName="Donor"
        onDelete={handleDeleteAccount}
        description="Delete your account forever. This will remove all your details from our system. This action cannot be undone."
      />
    </div>
  );
}

function ProfileRow({ icon: Icon, label, value, valueClass = 'text-white' }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between py-6 group hover:bg-white/[0.02] transition-colors rounded-xl px-4 -mx-4 gap-4">
      <div className="flex items-center gap-4 shrink-0 mb-2 sm:mb-0">
        <div className="w-10 h-10 rounded-full bg-[#121212] border border-white/5 flex items-center justify-center text-gray-400 group-hover:text-white transition-colors">
          <Icon className="w-5 h-5" />
        </div>
        <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{label}</span>
      </div>
      <div className={`text-left sm:text-right text-base md:text-lg font-medium break-words whitespace-normal max-w-full sm:max-w-[60%] leading-relaxed ${valueClass}`}>
        {value}
      </div>
    </div>
  );
}