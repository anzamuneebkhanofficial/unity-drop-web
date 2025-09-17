/** @format */

'use client';

import { useState, useRef, useEffect } from 'react';

export default function UserMenu({
  user = { name: 'User', role: 'Role', avatar: '' },
  onAction,
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    function onDoc(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('click', onDoc);
    return () => document.removeEventListener('click', onDoc);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-[var(--muted-2)] transition btn-focus"
        aria-expanded={open}
      >
        <img
          src={
            user.avatar ||
            `https://i.pravatar.cc/40?u=${encodeURIComponent(user.name)}`
          }
          alt={user.name}
          className="w-9 h-9 rounded-full border border-[var(--muted)]"
        />
        <div className="flex-1 text-left min-w-0">
          <p className="text-sm font-semibold text-[var(--text)] truncate">
            {user.name}
          </p>
          <p className="text-xs text-[rgba(255,255,255,0.7)] truncate">
            {user.role}
          </p>
        </div>
        <svg
          className={`w-4 h-4 text-[var(--text)] transform ${
            open ? 'rotate-180' : ''
          }`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M5.23 7.21a.75.75 0 011.06.02L10 11l3.71-3.77a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.25 8.27a.75.75 0 01-.02-1.06z" />
        </svg>
      </button>

      {open && (
        <div className="absolute left-0 right-0 mt-2 bg-[rgba(10,10,10,0.95)] border border-[var(--muted)] rounded-lg shadow-lg z-30">
          <ul className="py-2">
            <li
              className="px-3 py-2 hover:bg-[var(--muted-2)] cursor-pointer"
              onClick={() => onAction?.('profile')}
            >
              Profile
            </li>
            <li
              className="px-3 py-2 hover:bg-[var(--muted-2)] cursor-pointer"
              onClick={() => onAction?.('update')}
            >
              Update Profile
            </li>
            <li
              className="px-3 py-2 hover:bg-[var(--muted-2)] cursor-pointer"
              onClick={() => onAction?.('change-password')}
            >
              Change Password
            </li>
            <li
              className="px-3 py-2 hover:bg-[var(--muted-2)] cursor-pointer"
              onClick={() => onAction?.('feedback')}
            >
              Feedback
            </li>
            <li
              className="px-3 py-2 text-red-400 hover:bg-[var(--muted-2)] cursor-pointer"
              onClick={() => onAction?.('logout')}
            >
              Logout
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
