
'use client';

import React, { useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { toast } from 'sonner';
import { Droplets, MessageSquare, LayoutDashboard } from 'lucide-react';

import DashboardShell from '@/features/dashboard/DashboardShell';
import { usePatientAuthStore } from '@/store/auth/authPatientStore';

import BoyAvatar from '../../../assets/publicImages/SiteLogos/boy.jpg';
import GirlAvatar from '../../../assets/publicImages/SiteLogos/girl.jpg';

const PatientMenu = [
  {
    id: 'home',
    label: 'Home',
    href: '/patient/dashboard',
    icon: <LayoutDashboard size={18} />
  },
  {
    id: 'users',
    label: 'Users',
    icon: <Droplets size={18} />,
    submenu: [{ label: 'Donors', href: '/patient/dashboard/donors' }],
  },
  {
    id: 'feedbacks',
    label: 'Feedbacks',
    icon: <MessageSquare size={18} />,
    submenu: [{ label: 'Feedbacks', href: '/patient/dashboard/feedback' }],
  },
];

export default function PatientLayout({ children }) {
  const router = useRouter();
  const { user, PatientCaught, getPatient, logout: patientLogout } = usePatientAuthStore();

  useEffect(() => {
    if (!Cookies.get('role')) return; // Stop fetch if logged out

    if (!PatientCaught) {
      getPatient();
    }
    const loginMsg = sessionStorage.getItem('login_success');
    if (loginMsg) {
      sessionStorage.removeItem('login_success');
      toast.success(loginMsg, { id: 'login-success', duration: 3500 });
    }
  }, [PatientCaught, getPatient]);
  const PatientUser = {
    name: user?.fullName,
    role: 'Patient',
    _id: user?._id || user?.id,
    avatar: user?.gender === 'Male' ? BoyAvatar : GirlAvatar,
  };

  const handleLogout = useCallback(async () => {
    try {
      await patientLogout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      router.refresh();
      router.replace('/patient/login');
    }
  }, [patientLogout, router]);

  return (
    <div className="bg-[var(--bg)] text-[var(--text)] min-h-screen theme-patient">
      <DashboardShell
        menu={PatientMenu}
        user={PatientUser}
        onLogout={handleLogout}
        basePath="/patient/dashboard"
      >
        {children}
      </DashboardShell>
    </div>
  );
}