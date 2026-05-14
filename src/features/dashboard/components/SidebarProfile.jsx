'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { User, ShieldAlert, Home, LogOut, ChevronDown } from 'lucide-react';

export default function SidebarProfile({ user, basePath, onLogout }) {
  const [profileOpen, setProfileOpen] = useState(false);
  const { name, role, avatar } = user || {};

  return (
    <div className="px-3 sm:px-5 mt-4 sm:mt-6 flex-shrink-0">
      <div
        onClick={() => setProfileOpen(!profileOpen)}
        className={`p-2 sm:p-3 rounded-2xl cursor-pointer flex items-center gap-3 sm:gap-4 transition-all duration-300 ${profileOpen
          ? 'bg-white/5 ring-1 ring-white/10 shadow-lg'
          : 'hover:bg-white/5 active:scale-95'
          }`}
      >
        <div className="relative">
          <Image
            src={avatar?.src || avatar || '/default-avatar.png'}
            alt="Profile"
            width={40}
            height={40}
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full ring-2 ring-donor/50 ring-offset-2 sm:ring-offset-4 ring-offset-bg bg-surface-2"
          />
        </div>
        <div className="flex-1 overflow-hidden">
          <p className="font-black text-xs sm:text-sm truncate text-white leading-tight">
            {name || 'User Account'}
          </p>
          <p className="text-[9px] sm:text-[10px] text-donor font-black uppercase tracking-widest mt-0.5">
            {role}
          </p>
        </div>
        <ChevronDown
          className={`text-text-muted transition-transform duration-500 ${profileOpen ? 'rotate-180 text-white' : ''}`}
        />
      </div>

      <AnimatePresence>
        {profileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0, y: -10 }}
            animate={{ height: 'auto', opacity: 1, y: 0 }}
            exit={{ height: 0, opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            className="overflow-hidden bg-white/[0.02] rounded-b-2xl mx-1 border-x border-b border-white/5 shadow-xl"
          >
            <div className="p-3 sm:p-4 space-y-1 sm:space-y-1.5">
              <ProfileLink href={`${basePath}/profile`} icon={User} label="Profile Details" />
              <ProfileLink href={`${basePath}/profile/update`} icon={User} label="Profile Update" />
              <ProfileLink href={`${basePath}/change-password`} icon={ShieldAlert} label="Password Change" />
              <ProfileLink href="/" icon={Home} label="Back Home" />
              <button
                onClick={onLogout}
                className="w-full flex items-center gap-3 px-3 sm:px-4 py-2 sm:py-3 text-[10px] sm:text-[11px] font-black uppercase tracking-widest rounded-xl text-donor/80 hover:bg-donor/10 hover:text-donor transition-all active:translate-x-1 min-h-[44px]"
              >
                <LogOut size={14} className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ProfileLink({ href, icon: Icon, label }) {
  return (
    <Link
      href={href}
      onClick={() => {
        // Close sidebar on mobile after navigation, keep open on desktop
        if (window.innerWidth < 1024) {
          // This will be handled by the parent component
        }
      }}
      className="flex items-center gap-3 px-3 sm:px-4 py-2 sm:py-3 text-[10px] sm:text-[11px] font-black uppercase tracking-widest rounded-xl text-text-muted hover:bg-white/5 hover:text-white transition-all active:scale-95 active:translate-x-1 min-h-[44px]"
    >
      <Icon size={14} className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-donor" /> <span className="hidden sm:inline">{label}</span>
    </Link>
  );
}
