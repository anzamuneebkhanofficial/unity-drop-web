/** @format */
'use client';
import DashboardShell from '@/features/dashboard/DashboardShell';
import { useDonorAuthStore } from '@/store/auth/authDonorStore';
import BoyAvatar from '../../../assets/publicImages/SiteLogos/boy.jpg';
import GirlAvatar from '../../../assets/publicImages/SiteLogos/girl.jpg';
import { useEffect } from 'react';
import { toast } from 'sonner';
import Cookies from 'js-cookie';
import { HeartPulse, MessageSquare, AlertTriangle, ClipboardList, LayoutDashboard } from 'lucide-react';

const DonorMenu = [
  { id: 'home', label: 'Home', href: '/admin/dashboard', icon: <LayoutDashboard size={18} /> },
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

import { useRouter } from 'next/navigation';

export default function DonorLayout({ children }) {
  const router = useRouter();
  const { user, DonorCaught, getDonor, logout: donorLogout } = useDonorAuthStore();
  // Fetch admin info on mount if not already loaded
  useEffect(() => {
    if (!Cookies.get('role')) return; // 🛑 Stop fetching if logged out
    if (!DonorCaught) getDonor();

    // ✅ Show deferred login success toast AFTER navigation completes
    const loginMsg = sessionStorage.getItem('login_success');
    if (loginMsg) {
      sessionStorage.removeItem('login_success');
      toast.success(loginMsg, { id: 'login-success', duration: 3500 });
    }
  }, [DonorCaught, getDonor]);
  const fullName = user?.fullName;
  const role = user?.role;
  const gender = user?.gender || '';

  const DonorUser = {
    name: fullName,
    role: 'Donor',
    _id: user?._id || user?.id,
    avatar: gender === 'Male' ? BoyAvatar : GirlAvatar,
  };


  return (
    <div className="bg-[var(--bg)] text-[var(--text)] min-h-screen theme-donor">
      <DashboardShell menu={DonorMenu} user={DonorUser} onLogout={async () => { await donorLogout(); router.replace('/donor/login') }} basePath="/donor/dashboard">
        {children}
      </DashboardShell>
    </div>
  );
}
