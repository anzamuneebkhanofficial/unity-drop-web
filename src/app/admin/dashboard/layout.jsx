/** @format */

'use client';
import DashboardShell from '@/features/dashboard/DashboardShell';
import { useAdminAuthStore } from '@/store/auth/authAdminStore';
import { useEffect } from 'react';
import { toast } from 'sonner';
import Cookies from 'js-cookie';
import { LayoutDashboard, Users, FileStack, MessageSquare, ShieldCheck, Megaphone } from 'lucide-react';

import BoyAvatar from '../../../assets/publicImages/SiteLogos/boy.jpg';
import GirlAvatar from '../../../assets/publicImages/SiteLogos/girl.jpg';
import { useRouter } from 'next/navigation';

export default function AdminLayout({ children }) {
  const router = useRouter();
  const { user, getAdmin, AdminCaught, logout: adminLogout } = useAdminAuthStore();
  // console.log('--- ADMIN LAYOUT RENDER ---');
  // console.log('AdminCaught:', AdminCaught);
  // console.log('isSuperAdmin:', AdminCaught?.isSuperAdmin);
  // console.log('---------------------------');

  // Always fetch fresh admin data from DB on every dashboard mount.
  // This ensures that any privilege changes made by the Super Admin
  // (e.g., canDelete updated from false → true) are reflected immediately
  // without requiring the admin to log out and back in.
  useEffect(() => {
    if (!Cookies.get('role')) return; // 🛑 No cookie = logged out, skip fetch
    getAdmin(); // ✅ Always refresh — never rely on stale localStorage data

    // ✅ Show deferred login success toast AFTER navigation completes
    const loginMsg = sessionStorage.getItem('login_success');
    if (loginMsg) {
      sessionStorage.removeItem('login_success');
      toast.success(loginMsg, { id: 'login-success', duration: 3500 });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Extract admin info safely
  const isSuperAdmin = AdminCaught?.isSuperAdmin || user?.isSuperAdmin;
  const role = AdminCaught?.role || 'admin';
  const _id = AdminCaught?._id || '';
  const gender = AdminCaught?.gender || '';
  const fullName = AdminCaught?.fullName || 'Administrator';


  const adminMenu = [
    { id: 'home', label: 'Home', href: '/admin/dashboard', icon: <LayoutDashboard size={18} /> },
    {
      id: 'users',
      label: 'Users',
      icon: <Users size={18} />,
      submenu: [
        { label: 'Donors', href: '/admin/dashboard/donors' },
        { label: 'Patients', href: '/admin/dashboard/patients' },
        ...(isSuperAdmin ? [{ label: 'Admins', href: '/admin/dashboard/admins' }] : []),
      ],
    },

    {
      id: 'feedbacks',
      label: 'Feedbacks',
      icon: <MessageSquare size={18} />,
      submenu: [{ label: 'Feedbacks', href: '/admin/dashboard/feedbacks' }],
    },
  ];


  // Conditionally add "Public Feedback" menu only for super admin
  if (isSuperAdmin) {
    adminMenu.push({
      id: 'public_feedback',
      label: 'Public Feedback',
      href: '/admin/dashboard/public-feedback',
      icon: <Megaphone size={18} />,
    });
  }

  // Admin user info for DashboardShell
  const adminUser = {
    name: fullName,
    role: isSuperAdmin ? 'Super Admin' : 'Admin',
    _id,
    avatar: gender === 'Male' ? BoyAvatar : GirlAvatar,
  };


  return (
    <div className="bg-[var(--bg)] text-[var(--text)] min-h-screen theme-admin">
      <DashboardShell menu={adminMenu} user={adminUser} onLogout={async () => { await adminLogout(); router.replace('/admin/login') }} basePath="/admin/dashboard">
        {children}
      </DashboardShell>
    </div>
  );
}
