/** @format */
'use client';

import { useEffect } from 'react';
import { useDonorAuthStore } from '@/store/auth/auth-donor-store';
import {
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiDroplet,
  FiKey,
  FiCheckCircle,
  FiXCircle,
} from 'react-icons/fi';
import SectionLoader from '@/components/GeneralSpinner/SectionLoader';

export default function DonorProfileView() {
  const { DonorCaught: user, getDonor, loading } = useDonorAuthStore();

  useEffect(() => {
    getDonor();
  }, [getDonor]);

  if (loading || !user) {
    return (
      <SectionLoader message="Loading your profile..." size={56} height={200} />
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-900 text-white px-4">
      <div className="bg-neutral-800 border border-neutral-700 p-8 rounded-2xl shadow-xl w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 mx-auto rounded-full bg-yellow-400 flex items-center justify-center text-4xl font-bold text-black shadow-lg">
            {user.fullName?.charAt(0).toUpperCase()}
          </div>
          <h2 className="text-2xl font-bold mt-4">{user.fullName}</h2>
          <p className="text-gray-400">{user.role}</p>
        </div>

        {/* Profile Information */}
        <div className="grid gap-6 sm:grid-cols-2">
          <ProfileItem
            icon={<FiUser />}
            label="Full Name"
            value={user.fullName}
          />
          <ProfileItem
            icon={<FiMail />}
            label="Email Address"
            value={user.email}
          />
          <ProfileItem icon={<FiKey />} label="Role" value={user.role} />
          <ProfileItem icon={<FiUser />} label="Gender" value={user.gender} />
          <ProfileItem
            icon={<FiDroplet />}
            label="Blood Group"
            value={user.bloodGroup}
          />
          <ProfileItem
            icon={<FiMapPin />}
            label="Location"
            value={user.location}
          />
          <ProfileItem
            icon={<FiPhone />}
            label="Phone Number"
            value={user.phone}
          />
          <ProfileItem
            icon={user.availabilityStatus ? <FiCheckCircle /> : <FiXCircle />}
            label="Availability"
            value={user.availabilityStatus ? 'Available' : 'Unavailable'}
            valueClass={
              user.availabilityStatus ? 'text-green-400' : 'text-red-400'
            }
          />
        </div>
      </div>
    </div>
  );
}

// Reusable item
function ProfileItem({ icon, label, value, valueClass = 'text-white' }) {
  return (
    <div className="flex flex-col bg-neutral-900 border border-neutral-700 rounded-lg p-4 shadow-md max-w-full">
      <div className="flex items-center gap-2 text-gray-400 mb-1">
        {icon}
        <span className="text-sm">{label}</span>
      </div>
      <span className={`text-lg font-medium break-words ${valueClass}`}>
        {value}
      </span>
    </div>
  );
}
