'use client';

import { Suspense } from 'react';
import { Toaster, toast } from 'sonner';
import NextTopLoader from 'nextjs-toploader';
import ProgressProvider from '@/components/providers/ProgressProvider';
if (typeof window !== 'undefined') {
  const recentToasts = [];
  const TOAST_DEBOUNCE_MS = 1500;

  const isDuplicate = (message, type) => {
    if (typeof message !== 'string') return false;

    const now = Date.now();
    const normalizedNew = message.toLowerCase().replace(/[^a-z0-9]/g, '');
    while (recentToasts.length > 0 && now - recentToasts[0].time > TOAST_DEBOUNCE_MS) {
      recentToasts.shift();
    }
    for (const item of recentToasts) {
      if (item.type === type) {
        const normalizedOld = item.text.toLowerCase().replace(/[^a-z0-9]/g, '');
        if (normalizedNew.includes(normalizedOld) || normalizedOld.includes(normalizedNew)) {
          return true;
        }
      }
    }

    recentToasts.push({ text: message, type, time: now });
    return false;
  };
  const methodsToPatch = ['success', 'error', 'warning', 'info', 'message'];
  methodsToPatch.forEach((method) => {
    const original = toast[method];
    if (typeof original === 'function') {
      toast[method] = function (message, ...args) {
        if (isDuplicate(message, method)) {
          return '';
        }
        return original.call(toast, message, ...args);
      };
    }
  });
}


export default function GlobalProviders({ children }) {
  return (
    <>
      <NextTopLoader
        color="#fdc700"
        initialPosition={0.08}
        crawlSpeed={200}
        height={3}
        showSpinner={false}
        easing="ease"
        speed={200}
        shadow="0 0 10px #fdc700,0 0 5px #fdc700"
        zIndex={1600}
      />
      <Toaster
        richColors
        closeButton
        position="top-right"
        theme="dark"
        expand={true}
      />
      <Suspense fallback={null}>
        <ProgressProvider />
      </Suspense>
      {children}
    </>
  );
}