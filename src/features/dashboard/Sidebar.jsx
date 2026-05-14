/** @format */
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, User, ShieldAlert, Home, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

import SidebarProfile from './components/SidebarProfile';

export default function Sidebar({ menu, user, basePath = '/', onLogout, isOpen = false, onClose = () => {} }) {
  const router = useRouter();
  const [openIds, setOpenIds] = useState({});
  const [activeId, setActiveId] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);

  const hasUnreadAlert = () => false;

  // 🚀 Register router with API wrapper for smooth SPA transitions
  useEffect(() => {
    const { setApiRouter } = require('@/lib/apiWrapper');
    setApiRouter(router);
  }, [router]);

  const toggleOpen = (id) =>
    setOpenIds((prev) => ({ ...prev, [id]: !prev[id] }));
  const handleActive = (id) => setActiveId(id);

  return (
    <aside className={`min-h-screen sticky top-0 w-[80px] sm:w-[90px] md:w-[260px] lg:w-[280px] flex flex-col bg-surface text-text-muted border-r border-white/5 shadow-[10px_0_30px_rgba(0,0,0,0.5)] z-[1000] lg:translate-x-0 transition-transform duration-300 ${
      isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
    } fixed lg:sticky`}>
      
      {/* ========== MOBILE VERSION (md:hidden) - Icon Only ========== */}
      <div className="md:hidden flex flex-col h-full w-full">
        {/* Logo + Close Button Row */}
        <div className="flex-shrink-0 px-2 py-2 border-b border-white/5 flex items-center justify-between">
          <Link href={basePath}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-donor to-donor/60 flex items-center justify-center shadow-[0_0_15px_rgba(var(--donor-hex),0.3)] border border-white/10">
              <span className="text-white font-black text-lg tracking-tighter italic">U</span>
            </div>
          </Link>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Profile - With Dropdown */}
        <div className="flex-shrink-0 px-2 py-2 border-b border-white/5">
          <button 
            onClick={() => setProfileOpen(!profileOpen)}
            className="w-full flex items-center justify-center p-2 rounded-lg hover:bg-white/5 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-donor/30 flex items-center justify-center border border-donor/50">
              <span className="text-donor font-black text-sm">{user?.name?.charAt(0) || 'U'}</span>
            </div>
          </button>

          {/* Profile Dropdown Menu */}
          <AnimatePresence>
            {profileOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="py-1 space-y-1 mt-2">
                  <Link href={`${basePath}/profile`} className="flex items-center gap-2 px-2 py-2 rounded text-[9px] font-bold text-text-muted hover:text-donor hover:bg-white/5 transition-all">
                    <User className="w-3.5 h-3.5 text-donor" />
                    <span>Profile</span>
                  </Link>
                  <Link href={`${basePath}/profile/update`} className="flex items-center gap-2 px-2 py-2 rounded text-[9px] font-bold text-text-muted hover:text-donor hover:bg-white/5 transition-all">
                    <User className="w-3.5 h-3.5 text-donor" />
                    <span>Update</span>
                  </Link>
                  <Link href={`${basePath}/change-password`} className="flex items-center gap-2 px-2 py-2 rounded text-[9px] font-bold text-text-muted hover:text-donor hover:bg-white/5 transition-all">
                    <ShieldAlert className="w-3.5 h-3.5 text-donor" />
                    <span>Password</span>
                  </Link>
                  <Link href="/" className="flex items-center gap-2 px-2 py-2 rounded text-[9px] font-bold text-text-muted hover:text-donor hover:bg-white/5 transition-all">
                    <Home className="w-3.5 h-3.5 text-donor" />
                    <span>Home</span>
                  </Link>
                  <button 
                    onClick={onLogout}
                    className="w-full flex items-center gap-2 px-2 py-2 rounded text-[9px] font-bold text-donor hover:bg-donor/10 transition-all"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Logout</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation - Icons Only - NO TEXT LABELS */}
        <nav className="flex-1 overflow-y-auto py-2 px-1 custom-scrollbar">
          <div className="space-y-1">
            {menu.map((item) => (
              <div key={item.id} className="relative">
                <button
                  onClick={() => {
                    handleActive(item.id);
                    if (item.submenu) {
                      toggleOpen(item.id);
                    } else {
                      router.push(item.href);
                    }
                  }}
                  className={`w-full flex items-center justify-center p-2 rounded-lg transition-all duration-200 min-h-[44px] ${
                    activeId === item.id
                      ? 'bg-white/10 text-white'
                      : 'text-text-muted hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="relative flex items-center justify-center">
                    <span className={`${activeId === item.id ? 'text-donor' : 'text-text-dim'}`}>
                      {item.icon}
                    </span>
                    {hasUnreadAlert(item.label) && (
                      <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-red-500 rounded-full border border-surface"></span>
                    )}
                  </div>
                </button>

                {/* Submenu */}
                <AnimatePresence>
                  {item.submenu && openIds[item.id] && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="py-1 space-y-0.5">
                        {item.submenu.map((sub) => (
                          <Link
                            key={sub.href}
                            href={sub.href}
                            onClick={(e) => {
                              e.stopPropagation();
                              // Don't close sidebar
                            }}
                            className="flex items-center justify-center px-1 py-1 rounded text-[7px] font-bold text-text-muted hover:text-donor hover:bg-white/5 transition-all min-h-[28px] text-center"
                          >
                            <span className="truncate max-w-[60px]">{sub.label.substring(0, 8)}</span>
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </nav>

        {/* Logout */}
        <div className="flex-shrink-0 px-2 py-2 border-t border-white/5">
          <button 
            onClick={onLogout}
            className="w-full flex items-center justify-center p-2 rounded-lg text-donor/70 hover:text-donor hover:bg-donor/10 transition-colors min-h-[44px]"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>

        {/* Footer - Same as Desktop */}
        <div className="flex-shrink-0 p-4 border-t border-white/5 bg-surface">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-donor animate-pulse"></div>
            <span className="text-[8px] font-black text-text-dim uppercase tracking-wider">Unity Drop V1</span>
          </div>
          <p className="text-[7px] text-text-muted mt-1 leading-relaxed">
            The Future of Blood Donation
          </p>
        </div>
      </div>

      {/* ========== DESKTOP VERSION (hidden md:flex) - Full Sidebar ========== */}
      <div className="hidden md:flex flex-col h-full">
        {/* Logo Area */}
        <div className="relative overflow-hidden px-5 py-6 border-b border-white/5 flex-shrink-0 flex items-center justify-between">
          <Link href={basePath} className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-donor to-donor/60 flex items-center justify-center shadow-[0_0_20px_rgba(var(--donor-hex),0.3)] border border-white/10 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 ease-out">
                <span className="text-white font-black text-xl tracking-tighter italic drop-shadow-md">U</span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-black text-xl tracking-tighter text-white leading-none group-hover:text-donor transition-colors">
                UNITYDROP
              </span>
              <span className="text-[9px] uppercase font-black tracking-widest text-text-dim mt-1">
                Network Platform
              </span>
            </div>
          </Link>

        </div>

        {/* Profile Section */}
        <SidebarProfile user={user} basePath={basePath} onLogout={onLogout} />

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto mt-6 px-4 custom-scrollbar pb-6">
          <p className="text-[9px] font-black text-text-dim uppercase tracking-[0.3em] mb-4 px-2 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-donor/80"></span> Main Application
          </p>
          <div className="space-y-2">
            {menu.map((item) => (
              <div key={item.id} className="relative group/menu">
                <button
                  onClick={() => {
                    handleActive(item.id);
                    if (item.submenu) {
                      toggleOpen(item.id);
                    } else {
                      router.push(item.href);
                    }
                  }}
                  className={`flex items-center justify-between w-full rounded-2xl px-4 py-3 text-[13px] font-black uppercase tracking-widest transition-all duration-300 min-h-[44px]
                    ${activeId === item.id
                      ? 'bg-gradient-to-r from-white/10 to-transparent text-white shadow-[inset_0_0_20px_rgba(255,255,255,0.02)]'
                      : 'text-text-muted hover:text-white hover:bg-white/[0.03]'
                    }`}
                >
                  <div className="flex items-center gap-4">
                    <span
                      className={`transition-all duration-300 ${activeId === item.id
                        ? 'text-donor scale-110'
                        : 'text-text-dim group-hover/menu:text-white'
                        }`}
                    >
                      {item.icon}
                    </span>
                    <span className="leading-none flex items-center gap-2">
                      {item.label}
                      {item.badge && (
                        <span className="bg-red-600 text-[10px] text-white px-1.5 py-0.5 rounded-full animate-bounce">
                          {item.badge}
                        </span>
                      )}
                      {hasUnreadAlert(item.label) && (
                        <span className="w-2 h-2 bg-red-600 rounded-full animate-blink-red border border-white/20"></span>
                      )}
                    </span>
                  </div>
                  {item.submenu && (
                    <ChevronDown
                      size={16}
                      className={`transition-transform duration-500 ease-in-out ${openIds[item.id] ? 'rotate-180 text-donor' : 'text-text-muted'}`}
                    />
                  )}
                </button>

                <AnimatePresence>
                  {item.submenu && openIds[item.id] && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                      className="ml-8 mt-2 space-y-1 mb-2 overflow-hidden"
                    >
                      {item.submenu.map((sub) => (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          className="flex items-center gap-3 px-6 py-3 text-[11px] font-bold text-text-muted hover:text-donor transition-all relative group/sub hover:bg-white/[0.01] min-h-[44px]"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-text-dim/40 group-hover/sub:bg-donor transition-colors duration-300 flex-shrink-0"></span>
                          <span className="flex items-center gap-2">
                            {sub.label}
                            {hasUnreadAlert(sub.label) && (
                              <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-blink-red border border-white/10"></span>
                            )}
                          </span>
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </nav>

        {/* Footer - Desktop */}
        <div className="flex-shrink-0 p-5 border-t border-white/5 bg-surface">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-donor animate-pulse"></div>
            <span className="text-[10px] font-black text-text-dim uppercase tracking-wider">Unity Drop V1</span>
          </div>
          <p className="text-[9px] text-text-muted mt-1.5 leading-relaxed">
            The Future of Blood Donation
          </p>
        </div>
      </div>
    </aside>
  );
}
