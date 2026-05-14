/** @format */
'use client';
import DashboardShell from '@/features/dashboard/DashboardShell';

import { usePatientAuthStore } from '@/store/auth/authPatientStore';
import BoyAvatar from '../../../assets/publicImages/SiteLogos/boy.jpg';
import GirlAvatar from '../../../assets/publicImages/SiteLogos/girl.jpg';
import { useEffect } from 'react';
import { toast } from 'sonner';
import Cookies from 'js-cookie';
import { Droplets, MessageSquare, CheckCircle, LayoutDashboard } from 'lucide-react';

const PatientMenu = [
  { id: 'home', label: 'Home', href: '/admin/dashboard', icon: <LayoutDashboard size={18} /> },
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
  {
    id: 'responses',
    label: 'Responses',
    icon: <CheckCircle size={18} />,
    submenu: [{ label: 'Responses', href: '/patient/dashboard/responses' }],
  },
];

import { useRouter } from 'next/navigation';

export default function PatientLayout({ children }) {
  const router = useRouter();
  const { user, PatientCaught, getPatient, logout: patientLogout } = usePatientAuthStore();
  useEffect(() => {
    if (!Cookies.get('role')) return; // 🛑 Stop fetching if logged out
    if (!PatientCaught) getPatient();

    // ✅ Show deferred login success toast AFTER navigation completes
    const loginMsg = sessionStorage.getItem('login_success');
    if (loginMsg) {
      sessionStorage.removeItem('login_success');
      toast.success(loginMsg, { id: 'login-success', duration: 3500 });
    }
  }, [PatientCaught, getPatient]);

  const fullName = user?.fullName;
  const role = user?.role;
  const gender = user?.gender || '';

  const PatientUser = {
    name: fullName,
    role: 'Patient',
    _id: user?._id || user?.id,
    avatar: gender === 'Male' ? BoyAvatar : GirlAvatar,
  };


  return (
    <div className="bg-[var(--bg)] text-[var(--text)] min-h-screen theme-patient">
      <DashboardShell menu={PatientMenu} user={PatientUser} onLogout={async () => { await patientLogout(); router.replace('/patient/login') }} basePath="/patient/dashboard">
        {children}
      </DashboardShell>
    </div>
  );
}
