/** @format */
'use client';

import { useState } from 'react';
import { Menu } from 'lucide-react';

import Sidebar from './Sidebar';

export default function DashboardShell({
  children,
  menu = [],
  user = {},
  basePath = '/',
  onLogout = () => { },
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen overflow-hidden bg-[var(--bg)]">
      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden fixed top-4 left-4 z-[1001] p-2.5 bg-surface border border-white/10 rounded-lg text-white hover:bg-surface-2 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
      )}
      <Sidebar
        menu={menu}
        user={user}
        basePath={basePath}
        onLogout={onLogout}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative lg:ml-0">
        <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
          <div className="w-full px-3 sm:px-4 md:px-6 lg:px-8 xl:px-10 space-y-3 sm:space-y-4 pt-16 pb-4 lg:pt-6 lg:pb-6 overflow-x-hidden">
            {children}
          </div>
        </div>
      </main>

    </div>
  );
}