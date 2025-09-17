/** @format */
'use client';

import { useEffect, useState } from 'react';
import LoadingSpinner from './LoadingSpinner';

export default function SiteLoaderWrapper({ children }) {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) {
    return (
      <div
        className="fixed inset-0 flex items-center justify-center z-50"
        style={{ backgroundColor: 'var(--bg)' }}
      >
        <LoadingSpinner />
      </div>
    );
  }

  return children;
}
