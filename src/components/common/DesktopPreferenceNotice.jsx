'use client';

import { useState, useEffect } from 'react';
import { Bell, X } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function DesktopPreferenceNotice() {
  const [isVisible, setIsVisible] = useState(false);
  const pathname = usePathname() || '';

  useEffect(() => {
    // Phase 1: Wait 3 seconds AFTER PAGE LOADS to trigger the popup
    const showTimer = setTimeout(() => {
      setIsVisible(true);

      // Phase 2: Once it appears, keep it on screen for 10 seconds, then auto-close
      const hideTimer = setTimeout(() => {
        setIsVisible(false);
      }, 10000);

      // Cleanup the hide timer if the component unmounts before 10 seconds
      return () => clearTimeout(hideTimer);
    }, 3000);

    return () => clearTimeout(showTimer);
  }, []); // Only runs once explicitly on page refresh/mount

  const handleDismiss = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  // Detect the user role dynamically from the URL so we say "Hi Admin", "Hi Donor" etc.
  let role = 'User';
  if (pathname.includes('/admin')) role = 'Admin';
  else if (pathname.includes('/donor')) role = 'Donor';
  else if (pathname.includes('/patient')) role = 'Patient';

  return (
    <div className="fixed top-20 left-4 right-4 z-[2000] bg-surface border border-white/10 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] p-4 max-w-sm mx-auto animate-in slide-in-from-top duration-700 fade-in zoom-in-95">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-1">
          <div className="w-8 h-8 bg-donor/10 rounded-lg flex items-center justify-center">
            <Bell className="w-4 h-4 text-donor animate-bounce" />
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-black text-sm uppercase tracking-wider mb-2">
            Hi {role}!
          </h3>
          <p className="text-text-dim text-xs leading-relaxed space-y-2">
            <span className="block mb-1 font-bold text-white/80">Welcome to the application!</span>
            <span className="block">To ensure you receive the latest updates, please <strong>refresh your page every 5 minutes.</strong></span>
            <span className="block mt-1">Also, keep monitoring your emails closely for any activity or platform notices.</span>
          </p>
        </div>
        
        <button
          onClick={handleDismiss}
          className="flex-shrink-0 p-1 text-text-dim hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
