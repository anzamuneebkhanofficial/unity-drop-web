/** @format */
'use client';

import Sidebar from './Sidebar';
import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import DesktopPreferenceNotice from '@/components/common/DesktopPreferenceNotice';

export default function DashboardShell({
  children,
  menu = [],
  user = {},
  initialCollapsed = false,
  basePath = '/',
  onLogout = () => {},
}) {

  const [mounted, setMounted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>

      <div className="flex min-h-screen overflow-hidden bg-[var(--bg)]">
        {/* Mobile Hamburger - Only shows when sidebar is closed */}
        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden fixed top-4 left-4 z-[1001] p-2.5 bg-surface border border-white/10 rounded-lg text-white hover:bg-surface-2 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        {/* NO OVERLAY - User requested removal */}

        {/* Sidebar - Desktop & Mobile */}
        <Sidebar
          menu={menu}
          user={user}
          initialCollapsed={initialCollapsed}
          basePath={basePath}
          onLogout={onLogout}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative lg:ml-0">
          <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
            <div className="w-full px-3 sm:px-4 md:px-6 lg:px-8 xl:px-10 space-y-3 sm:space-y-4 pt-16 pb-4 lg:pt-6 lg:pb-6 overflow-x-hidden">
              {/* ️ Desktop Preference Notice */}
              <DesktopPreferenceNotice />

              {/* Main page content */}
              {children}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
