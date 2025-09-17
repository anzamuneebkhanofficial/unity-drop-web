/** @format */
'use client';
import DashboardShell from '@/components/DashboardShell';
import { useDonorAuthStore } from '@/store/auth/auth-donor-store';
import DonorImage from '../../../../public/logo3.jpg';
const DonorMenu = [
  // { id: 'overview', label: 'Overview', href: '/admin', icon: '🏠' },
  {
    id: 'users',
    label: 'Users',
    icon: '📩',
    submenu: [{ label: 'Patients', href: '/donor/dashboard/patients' }],
  },
  // {
  //   id: 'bad-requests',
  //   label: 'Requests',
  //   icon: '👥',
  //   submenu: [{ label: 'Bad Requests', href: '/admin/dashboard/bad-requests' }],
  // },
  {
    id: 'feedbacks',
    label: 'Feedbacks',
    icon: '👥',
    submenu: [{ label: 'Feedbacks', href: '/donor/dashboard/feedbacks' }],
  },
];

export default function DonorLayout({ children }) {
  const { user } = useDonorAuthStore();

  // Safely extract values
  const fullName = user?.fullName;
  const role = user?.role;

  const DonorUser = {
    name: fullName,
    role,
    avatar: DonorImage.src,
  };

  return (
    <div className="bg-[var(--bg)] text-[var(--text)] min-h-screen">
      <DashboardShell menu={DonorMenu} user={DonorUser}>
        {children}
      </DashboardShell>
    </div>
  );
}
