/** @format */

'use client';

import { useEffect } from 'react';
import { toast } from 'sonner';
import { useAdminAuthStore } from '@/store/auth/auth-admin-store';
import PieChartCard from '@/components/Charts/PieChartCard';
import BarChartCard from '@/components/Charts/BarChartCard';

export default function AdminOverview() {
  const {
    totalDonors,
    totalPatients,
    loading,
    fetchStats,
    success,
    error,
    resetMessages,
  } = useAdminAuthStore();

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    if (success) toast.success(success);
    if (error) toast.error(error);
    if (success || error) resetMessages();
  }, [success, error, resetMessages]);

  const donorPatientData = [
    { name: 'Donors', value: totalDonors },
    { name: 'Patients', value: totalPatients },
  ];

  return (
    <section className="space-y-6">
      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-bg border border-highlight p-4 rounded shadow text-text">
          Total donors:{' '}
          <strong className="text-highlight">
            {loading ? '...' : totalDonors}
          </strong>
        </div>
        <div className="bg-bg border border-highlight p-4 rounded shadow text-text">
          Total patients:{' '}
          <strong className="text-highlight">
            {loading ? '...' : totalPatients}
          </strong>
        </div>
      </div>

      {/* <PieChartCard
        title="Donors vs Patients (Pie)"
        data={donorPatientData}
        className="w-full" // ✅ dynamic width
        height={350} // ✅ optional height
      />
      <BarChartCard
        title="Donors vs Patients (Bar)"
        data={donorPatientData}
        className="w-full" // ✅ dynamic width
        height={350}
      /> */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PieChartCard
          title="Donors vs Patients (Pie)"
          data={donorPatientData}
          className="w-full" // ✅ dynamic width
          height={350} // ✅ optional height
        />
        <BarChartCard
          title="Donors vs Patients (Bar)"
          data={donorPatientData}
          className="w-full" // ✅ dynamic width
          height={350}
        />
      </div>
    </section>
  );
}
