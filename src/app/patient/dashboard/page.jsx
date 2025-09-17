/** @format */

'use client';

import { useEffect } from 'react';
import { toast } from 'sonner';

import PieChartCard from '@/components/Charts/PieChartCard';
import BarChartCard from '@/components/Charts/BarChartCard';
import DeleteAccount from '@/components/DeleteAccount/DeleteAccount';
import PatientRequestsList from '@/components/Requests/PatientRequestsList';
import { useDonorAuthStore } from '@/store/auth/auth-donor-store';
import WarningsList from '@/components/Warnings/WarningsList';
import AISuggestions from '@/components/Suggestions/AISuggestions';
import { usePatientAuthStore } from '@/store/auth/auth-patient-store';
import AISuggestionsPatient from '@/components/Suggestions/AISuggestionsPatient';

export default function PatientDashboard() {
  const { totalDonors, fetchStats, loading, success, error, resetMessages } =
    usePatientAuthStore();

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    if (success) toast.success(success);
    if (error) toast.error(error);
    if (success || error) resetMessages();
  }, [success, error, resetMessages]);

  const donorPatientData = [{ name: 'Donors', value: totalDonors }];

  return (
    <section className="space-y-6 p-6">
      {/* Delete Account Button */}
      <div className="flex justify-end mb-4">
        <DeleteAccount />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-bg border border-highlight p-4 rounded shadow text-text">
          Total Donors:{' '}
          <strong className="text-highlight">
            {loading ? '...' : totalDonors}
          </strong>
        </div>
      </div>

      {/* Charts */}
      {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        <PieChartCard
          title="Patients Overview (Pie)"
          data={donorPatientData}
          height={350}
        />
        <BarChartCard
          title="Patients Overview (Bar)"
          data={donorPatientData}
          height={350}
        />
      </div> */}

      {/* Patient Requests List */}
      {/* <div className="mt-6">
        <h2 className="text-xl font-bold mb-4">Patient Requests</h2>
        <PatientRequestsList />
      </div> */}
      {/* Warnings Section */}
      {/* <WarningsList /> */}
      {/* AI Suggestions Section */}
      {/* <AISuggestions /> */}
      {/* AI Suggestions Section */}
      <AISuggestionsPatient />
    </section>
  );
}
