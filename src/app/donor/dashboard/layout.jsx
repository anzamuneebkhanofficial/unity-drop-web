
'use client';

import React, { useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { toast } from 'sonner';
import { HeartPulse, MessageSquare, ClipboardList, LayoutDashboard } from 'lucide-react';

import DashboardShell from '@/features/dashboard/DashboardShell';
import { useDonorAuthStore } from '@/store/auth/authDonorStore';

import BoyAvatar from '../../../assets/publicImages/SiteLogos/boy.jpg';
import GirlAvatar from '../../../assets/publicImages/SiteLogos/girl.jpg';

const DonorMenu = [
  {
    id: 'home',
    label: 'Home',
    href: '/donor/dashboard',
    icon: <LayoutDashboard size={18} />
  },
  {
    id: 'users',
    label: 'Users',
    icon: <HeartPulse size={18} />,
    submenu: [{ label: 'Patients', href: '/donor/dashboard/patients' }],
  },
  {
    id: 'feedbacks',
    label: 'Feedbacks',
    icon: <MessageSquare size={18} />,
    submenu: [{ label: 'Feedbacks', href: '/donor/dashboard/feedbacks' }],
  },
  {
    id: 'requests',
    label: 'Requests',
    icon: <ClipboardList size={18} />,
    submenu: [{ label: 'Requests', href: '/donor/dashboard/requests' }],
  },
];

export default function DonorLayout({ children }) {
  const router = useRouter();
  const { user, DonorCaught, getDonor, logout: donorLogout } = useDonorAuthStore();

  useEffect(() => {
    if (!Cookies.get('role')) return; // Stop fetch if logged out

    if (!DonorCaught) {
      getDonor();
    }

    // Show login success toast AFTER navigation completes
    const loginMsg = sessionStorage.getItem('login_success');
    if (loginMsg) {
      sessionStorage.removeItem('login_success');
      toast.success(loginMsg, { id: 'login-success', duration: 3500 });
    }
  }, [DonorCaught, getDonor]);
  const DonorUser = {
    name: user?.fullName,
    role: 'Donor',
    _id: user?._id || user?.id,
    avatar: user?.gender === 'Male' ? BoyAvatar : GirlAvatar,
  };

  // Prefetch login route so logout transition is instant and smooth
  useEffect(() => {
    router.prefetch('/donor/login');
  }, [router]);

  // Safe logout with Next.js router.replace (smooth SPA transition, no page reload)
  const handleLogout = useCallback(async () => {
    try {
      await donorLogout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      router.replace('/donor/login');
    }
  }, [donorLogout, router]);

  return (
    <div className="bg-[var(--bg)] text-[var(--text)] min-h-screen theme-donor">
      <DashboardShell
        menu={DonorMenu}
        user={DonorUser}
        onLogout={handleLogout}
        basePath="/donor/dashboard"
      >
        {children}
      </DashboardShell>
    </div>
  );
}