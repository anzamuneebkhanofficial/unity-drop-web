/** @format */
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  FiChevronDown,
  FiChevronUp,
  FiMenu,
  FiX,
  FiLogOut,
  FiUser,
  FiKey,
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAdminAuthStore } from '@/store/auth/auth-admin-store';
import { useDonorAuthStore } from '@/store/auth/auth-donor-store';
import { usePatientAuthStore } from '@/store/auth/auth-patient-store';
import { toast } from 'sonner';

export default function Sidebar({ menu, user }) {
  const { name, role, avatar } = user;
  const [collapsed, setCollapsed] = useState(false);
  const [openIds, setOpenIds] = useState({});
  const [activeId, setActiveId] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);

  const roleRoutes = {
    admin: '/admin/dashboard',
    donor: '/donor/dashboard',
    patient: '/patient/dashboard',
  };
  const basePath = roleRoutes[role] || '/';
  const router = useRouter();

  // stores
  const {
    logout: adminLogout,
    error: adminError,
    success: adminSuccess,
    resetMessages: resetAdminMessages,
  } = useAdminAuthStore();
  const {
    logout: donorLogout,
    error: donorError,
    success: donorSuccess,
    resetMessages: resetDonorMessages,
  } = useDonorAuthStore();
  const {
    logout: patientLogout,
    error: patientError,
    success: patientSuccess,
    resetMessages: resetPatientMessages,
  } = usePatientAuthStore();

  const toggleOpen = (id) =>
    setOpenIds((prev) => ({ ...prev, [id]: !prev[id] }));
  const handleActive = (id) => setActiveId(id);

  const logoutMethod = async () => {
    if (role === 'admin') {
      await adminLogout();
      router.push('/admin/login');
    } else if (role === 'donor') {
      await donorLogout();
      router.push('/donor/login');
    } else if (role === 'patient') {
      await patientLogout();
      router.push('/patient/login');
    }
  };

  useEffect(() => {
    if (adminSuccess) toast.success(adminSuccess);
    if (adminError) toast.error(adminError);
    if (adminSuccess || adminError) resetAdminMessages();

    if (donorSuccess) toast.success(donorSuccess);
    if (donorError) toast.error(donorError);
    if (donorSuccess || donorError) resetDonorMessages();

    if (patientSuccess) toast.success(patientSuccess);
    if (patientError) toast.error(patientError);
    if (patientSuccess || patientError) resetPatientMessages();
  }, [
    adminSuccess,
    adminError,
    donorSuccess,
    donorError,
    patientSuccess,
    patientError,
  ]);

  return (
    <motion.aside
      initial={{ width: 288 }} // 72 * 4 = 288px
      animate={{ width: collapsed ? 80 : 288 }} // 20 * 4 = 80px
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="h-screen bg-bg text-text border-r border-highlight flex flex-col overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-highlight">
        {!collapsed ? (
          <Link href={basePath}>
            <div className="flex items-center gap-3">
              <Image src="/logo3.jpg" alt="UnityDrop" width={60} height={60} />
              <span className="font-bold text-highlight text-xl tracking-wide">
                UnityDrop
              </span>
            </div>
          </Link>
        ) : (
          <Image src="/logo3.jpg" alt="UnityDrop" width={40} height={40} />
        )}

        <motion.button
          onClick={() => setCollapsed(!collapsed)}
          className="rounded hover:bg-highlight hover:text-bg transition p-2"
          whileTap={{ scale: 0.9 }}
        >
          <AnimatePresence mode="wait" initial={false}>
            {!collapsed ? (
              <motion.div
                key="close"
                initial={{ opacity: 0, rotate: -90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 90 }}
                transition={{ duration: 0.2 }}
              >
                <FiX size={20} />
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ opacity: 0, rotate: 90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: -90 }}
                transition={{ duration: 0.2 }}
              >
                <FiMenu size={20} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Profile area */}
      <div className="relative border-b border-highlight">
        <div
          className={`flex items-center ${
            collapsed ? 'justify-center p-4' : 'justify-between p-4'
          } cursor-pointer hover:bg-highlight hover:text-bg transition`}
          onClick={() => setProfileOpen(!profileOpen)}
        >
          <div
            className={`flex items-center ${
              collapsed ? 'justify-center' : 'gap-3'
            }`}
          >
            <img
              src={avatar}
              alt="user"
              className="w-10 h-10 rounded-full border border-highlight"
            />
            {!collapsed && (
              <div>
                <p className="font-semibold">
                  {name
                    ? name.slice(0, 15) + (name.length > 15 ? '...' : '')
                    : ''}
                </p>
                <p className="text-sm text-highlight">{role}</p>
              </div>
            )}
          </div>
          {!collapsed && (profileOpen ? <FiChevronUp /> : <FiChevronDown />)}
        </div>

        {/* Profile dropdown */}
        <AnimatePresence>
          {profileOpen && !collapsed && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-bg border-t border-highlight overflow-hidden"
            >
              <Link
                href={`${basePath}/profile`}
                className="flex items-center gap-2 px-6 py-2 hover:bg-highlight hover:text-bg transition"
              >
                <FiUser /> Profile
              </Link>
              <Link
                href={`${basePath}/profile/update`}
                className="flex items-center gap-2 px-6 py-2 hover:bg-highlight hover:text-bg transition"
              >
                <FiUser /> Update Profile
              </Link>
              <Link
                href={`${basePath}/change-password`}
                className="flex items-center gap-2 px-6 py-2 hover:bg-highlight hover:text-bg transition"
              >
                <FiKey /> Change Password
              </Link>
              <button
                onClick={logoutMethod}
                className="flex items-center gap-2 w-full text-left px-6 py-2 hover:bg-highlight hover:text-bg transition"
              >
                <FiLogOut /> Logout
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-2 space-y-1">
        {menu.map((item) => (
          <div key={item.id}>
            <div
              onClick={() => {
                handleActive(item.id);
                if (item.submenu) toggleOpen(item.id);
              }}
              className={`flex items-center ${
                collapsed ? 'justify-center' : 'justify-between'
              } p-3 rounded-lg cursor-pointer border border-transparent transition-all ${
                activeId === item.id
                  ? 'bg-highlight text-bg border-highlight'
                  : 'hover:bg-highlight hover:text-bg hover:border-highlight'
              }`}
            >
              <div
                className={`flex items-center ${
                  collapsed ? 'justify-center' : 'gap-3'
                }`}
              >
                {item.icon}
                {!collapsed && <span>{item.label}</span>}
              </div>
              {!collapsed && item.submenu && (
                <span>
                  {openIds[item.id] ? <FiChevronUp /> : <FiChevronDown />}
                </span>
              )}
            </div>

            {/* Submenu */}
            <AnimatePresence>
              {item.submenu && openIds[item.id] && !collapsed && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-1 space-y-1 text-sm border-l border-highlight pl-4 overflow-hidden"
                >
                  {item.submenu.map((sub) => (
                    <Link
                      key={sub.href}
                      href={sub.href}
                      className="block px-2 py-1 rounded hover:bg-highlight hover:text-bg transition"
                    >
                      {sub.label}
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </nav>
    </motion.aside>
  );
}
