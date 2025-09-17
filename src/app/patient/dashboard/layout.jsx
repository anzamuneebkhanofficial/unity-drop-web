/** @format */
'use client';
import DashboardShell from '@/components/DashboardShell';

import PatientImage from '../../../../public/logo3.jpg';
import { usePatientAuthStore } from '@/store/auth/auth-patient-store';
const PatientMenu = [
  // { id: 'overview', label: 'Overview', href: '/admin', icon: '🏠' },
  {
    id: 'users',
    label: 'Users',
    icon: '📩',
    submenu: [{ label: 'Donors', href: '/patient/dashboard/donors' }],
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
    submenu: [{ label: 'Feedbacks', href: '/patient/dashboard/feedback' }],
  },
];

export default function PatientLayout({ children }) {
  const { user } = usePatientAuthStore();
  // console.log('users', user);
  // Safely extract values
  const fullName = user?.fullName;
  const role = user?.role;

  const PatientUser = {
    name: fullName,
    role,
    avatar: PatientImage.src,
  };

  return (
    <div className="bg-[var(--bg)] text-[var(--text)] min-h-screen">
      <DashboardShell menu={PatientMenu} user={PatientUser}>
        {children}
      </DashboardShell>
    </div>
  );
}
