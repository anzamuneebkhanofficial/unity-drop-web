/** @format */

'use client';

import Sidebar from './Sidebar';

export default function DashboardShell({
  children,
  menu = [],
  user = {},
  initialCollapsed = false,
}) {
  return (
    <div className="flex min-h-screen">
      <Sidebar menu={menu} user={user} initialCollapsed={initialCollapsed} />
      <main className="flex-1 p-6 bg-[var(--bg)]">
        <div className="max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
