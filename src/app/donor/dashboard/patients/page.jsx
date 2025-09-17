/** @format */
'use client';

import { useEffect, useState } from 'react';

import Pagination from '@/components/Pagination';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
  DialogTrigger,
} from '@/components/ui/dialog';
import MiniSpinner from '@/components/MiniLoader';
import { toast } from 'sonner';
import { useDonorAuthStore } from '@/store/auth/auth-donor-store';

export default function PatientList() {
  const {
    patients,
    totalPages,
    currentPage,
    loading,
    fetchPatients,
    fetchPatientById,
    setFilters,
    filters,
    error,
    success,
    resetMessages,
  } = useDonorAuthStore();

  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [name, setName] = useState(filters.name || '');
  const [bloodGroup, setBloodGroup] = useState(filters.bloodGroup || '');
  const [location, setLocation] = useState(filters.location || '');
  const [limit, setLimit] = useState(1); // Dynamic limit

  // Fetch patients whenever filters or limit change
  useEffect(() => {
    setFilters({ name, bloodGroup, location });
    fetchPatients(1, limit);
  }, [name, bloodGroup, location, limit]);

  useEffect(() => {
    if (success) toast.success(success);
    if (error) toast.error(error);
    if (success || error) {
      resetMessages();
    }
  }, [success, error, resetMessages]);
  const handleView = async (id) => {
    const patient = await fetchPatientById(id);
    if (patient) {
      setSelectedPatient(patient);
      setIsDialogOpen(true);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4 text-highlight">Patients</h2>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-4">
        {/* <input
          type="text"
          placeholder="Search by name"
          className="px-3 py-2 border rounded-md bg-neutral-900 text-gray-200"
          value={name}
          onChange={(e) => setName(e.target.value)}
        /> */}
        <select
          className="px-3 py-2 border rounded-md bg-neutral-900 text-gray-200"
          value={bloodGroup}
          onChange={(e) => setBloodGroup(e.target.value)}
        >
          <option value="">All Blood Groups</option>
          <option value="A+">A+</option>
          <option value="A-">A-</option>
          <option value="B+">B+</option>
          <option value="B-">B-</option>
          <option value="O+">O+</option>
          <option value="O-">O-</option>
          <option value="AB+">AB+</option>
          <option value="AB-">AB-</option>
        </select>
        <input
          type="text"
          placeholder="Search by location"
          className="px-3 py-2 border rounded-md bg-neutral-900 text-gray-200"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        {/* Limit selector */}
        <select
          className="px-3 py-2 border rounded-md bg-neutral-900 text-gray-200"
          value={limit}
          onChange={(e) => setLimit(Number(e.target.value))}
        >
          <option value={5}>5 per page</option>
          <option value={1}>1 per page</option>
          <option value={10}>10 per page</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-700">
        <table className="w-full border-collapse">
          <thead className="bg-neutral-800 text-gray-300">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Blood Group</th>
              <th className="p-3 text-left">Location</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="p-6 text-center text-gray-400">
                  <MiniSpinner size={24} />
                </td>
              </tr>
            ) : patients.length > 0 ? (
              patients.map((p) => (
                <tr
                  key={p._id}
                  className="hover:bg-neutral-800 transition-colors"
                >
                  <td className="p-3 border-t border-gray-700">{p.fullName}</td>
                  <td className="p-3 border-t border-gray-700">
                    {p.bloodGroup}
                  </td>
                  <td className="p-3 border-t border-gray-700">{p.location}</td>
                  <td className="p-3 border-t border-gray-700 text-center">
                    <Dialog
                      open={isDialogOpen && selectedPatient?._id === p._id}
                      onOpenChange={setIsDialogOpen}
                    >
                      <DialogTrigger asChild>
                        <Button onClick={() => handleView(p._id)}>View</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Patient Details</DialogTitle>
                          <DialogDescription>
                            Info about {selectedPatient?.fullName}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 text-gray-200">
                          <p>
                            <strong>Name:</strong> {selectedPatient?.fullName}
                          </p>
                          <p>
                            <strong>Email:</strong> {selectedPatient?.email}
                          </p>
                          <p>
                            <strong>Gender:</strong> {selectedPatient?.gender}
                          </p>
                          <p>
                            <strong>Blood Group:</strong>{' '}
                            {selectedPatient?.bloodGroup}
                          </p>
                          <p>
                            <strong>Location:</strong>{' '}
                            {selectedPatient?.location}
                          </p>
                          <p>
                            <strong>Availability:</strong>{' '}
                            {selectedPatient?.availabilityStatus}
                          </p>
                        </div>
                        <DialogFooter>
                          <DialogClose asChild>
                            <Button variant="outline">Close</Button>
                          </DialogClose>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={4}
                  className="p-6 text-center text-gray-400 border-t border-gray-700"
                >
                  No patients found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <Pagination
        pageCount={totalPages}
        currentPage={currentPage}
        onPageChange={(page) => fetchPatients(page, limit)}
      />
    </div>
  );
}
