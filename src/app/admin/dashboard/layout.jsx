
'use client';
import React, { useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { toast } from 'sonner';
import { LayoutDashboard, Users, MessageSquare, Megaphone } from 'lucide-react';
import DashboardShell from '@/features/dashboard/DashboardShell';
import { useAdminAuthStore } from '@/store/auth/authAdminStore';
import BoyAvatar from '../../../assets/publicImages/SiteLogos/boy.jpg';
import GirlAvatar from '../../../assets/publicImages/SiteLogos/girl.jpg';
export default function AdminLayout({ children }) {
  const router = useRouter();
  const { user, AdminCaught, getAdmin, logout: adminLogout } = useAdminAuthStore();
  useEffect(() => {
    if (!Cookies.get('role')) return;

    if (!AdminCaught) {
      getAdmin();
    }
    const loginMsg = sessionStorage.getItem('login_success');
    if (loginMsg) {
      sessionStorage.removeItem('login_success');
      toast.success(loginMsg, { id: 'login-success', duration: 3500 });
    }
  }, [AdminCaught, getAdmin]);
  const isSuperAdmin = AdminCaught?.isSuperAdmin || user?.isSuperAdmin;
  const menu = [
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
  if (isSuperAdmin) {
    menu.push({
      id: 'public_feedback',
      label: 'Public Feedback',
      href: '/admin/dashboard/public-feedback',
      icon: <Megaphone size={18} />,
    });
  }
  const adminMenu = menu;
  const adminUser = {
    name: AdminCaught?.fullName || 'Administrator',
    role: isSuperAdmin ? 'Super Admin' : 'Admin',
    _id: AdminCaught?._id || '',
    avatar: (AdminCaught?.gender === 'Male') ? BoyAvatar : GirlAvatar,
  };
  const handleLogout = useCallback(async () => {
    try {
      await adminLogout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      router.replace('/admin/login');
    }
  }, [adminLogout, router]);
  return (
    <div className="bg-[var(--bg)] text-[var(--text)] min-h-screen theme-admin">
      <DashboardShell
        menu={adminMenu}
        user={adminUser}
        onLogout={handleLogout}
        basePath="/admin/dashboard"
      >
        {children}
      </DashboardShell>
    </div>
  );
}