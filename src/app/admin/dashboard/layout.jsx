/** @format */

'use client';
import DashboardShell from '@/components/DashboardShell';
import { useAdminAuthStore } from '@/store/auth/auth-admin-store';
import { useEffect } from 'react';

export default function AdminLayout({ children }) {
  const { user, getAdmin, AdminCaught } = useAdminAuthStore();

  // Fetch admin info on mount if not already loaded
  useEffect(() => {
    if (!AdminCaught) getAdmin();
  }, [AdminCaught, getAdmin]);

  // Extract admin info safely
  const fullName = AdminCaught?.fullName || 'Admin';
  const role = AdminCaught?.role || 'admin';
  const _id = AdminCaught?._id || '';

  // Default menu
  const adminMenu = [
    { id: 'overview', label: 'Overview', href: '/admin', icon: '🏠' },
    {
      id: 'users',
      label: 'Users',
      icon: '📩',
      submenu: [
        { label: 'Donors', href: '/admin/dashboard/donors' },
        { label: 'Patients', href: '/admin/dashboard/patients' },
      ],
    },
    {
      id: 'bad-requests',
      label: 'Requests',
      icon: '👥',
      submenu: [
        { label: 'Bad Requests', href: '/admin/dashboard/bad-requests' },
      ],
    },
    {
      id: 'feedbacks',
      label: 'Feedbacks',
      icon: '👥',
      submenu: [{ label: 'Feedbacks', href: '/admin/dashboard/feedbacks' }],
    },
  ];

  // Conditionally add "Generate Key" menu only for super admin
  if (role === 'admin' && _id === '68c84a8778121c4ddf86edc5') {
    adminMenu.push({
      id: 'generate_key',
      label: 'Key',
      icon: '🔑',
      submenu: [
        { label: 'Generate Key', href: '/admin/dashboard/generate-key' },
      ],
    });
  }

  // Admin user info for DashboardShell
  const adminUser = {
    name: fullName,
    role,
    avatar: '/logo3.jpg',
  };

  return (
    <div className="bg-[var(--bg)] text-[var(--text)] min-h-screen">
      <DashboardShell menu={adminMenu} user={adminUser}>
        {children}
      </DashboardShell>
    </div>
  );
}
