
'use client';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
export const useNetworkHealth = () => {
  const [isOnline, setIsOnline] = useState(() => {
    if (typeof window !== 'undefined') {
      return navigator.onLine;
    }
    return true;
  });
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!navigator.onLine) {
      toast.error('Internet connection lost! Please check your network.', {
        id: 'network-status',
      });
    }
    const handleOnline = () => {
      setIsOnline(true);
      toast.success('Internet connection restored! You are back online.', {
        id: 'network-status',
      });
    };
    const handleOffline = () => {
      setIsOnline(false);
      toast.error('Internet connection lost! Please check your network.', {
        id: 'network-status',
      });
    };
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return {
    isOnline,
    status: isOnline ? 'Good' : 'Bad',
  };
};