
'use client';

import React from 'react';
import { useNetworkHealth } from '@/hooks/useNetworkHealth';
const SystemHealthCard = ({ className = "" }) => {
  const { isOnline } = useNetworkHealth();
  const statusColor = isOnline ? 'text-green-400' : 'text-red-500';
  const pulseColor = isOnline ? 'bg-green-400' : 'bg-red-500';
  return (
    <div className={`rounded-xl border border-white/10 bg-white/[0.03] p-4 min-w-[220px] ${className}`}>
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-text-dim uppercase tracking-wider">System Health</span>
          <div className="flex items-center gap-2">
            <div className={`h-1.5 w-1.5 rounded-full animate-pulse ${pulseColor}`} />
            <span className={`text-[11px] font-black uppercase ${statusColor}`}>
              {isOnline ? 'Good' : 'Offline'}
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between border-t border-white/5 pt-2 mt-1">
          <span className="text-[10px] font-bold text-text-dim uppercase tracking-wider">Wi-Fi Signal</span>
          <span className={`text-[11px] font-black uppercase ${statusColor}`}>
            {isOnline ? 'Good' : 'None'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SystemHealthCard;

