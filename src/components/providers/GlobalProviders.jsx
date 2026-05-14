'use client';

import { Toaster } from 'sonner';
import NextTopLoader from 'nextjs-toploader';
import ProgressProvider from '@/components/providers/ProgressProvider';
import { Suspense } from 'react';

export default function GlobalProviders({ children }) {
  return (
    <>
      <NextTopLoader
        color="#fdc700"
        initialPosition={0.08}
        crawlSpeed={200}
        height={3}
        crawl={true}
        showSpinner={false}
        easing="ease"
        speed={200}
        shadow="0 0 10px #fdc700,0 0 5px #fdc700"
        zIndex={1600}
        showAtBottom={false}
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
