/** @format */
'use client';

import { useEffect, useState } from 'react';
import { useAdminAuthStore } from '@/store/auth/auth-admin-store';
import Pagination from '@/components/Pagination';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import MiniSpinner from '@/components/MiniLoader/MiniLoader';

export default function PatientList() {
  const {
    getPatients,
    exportPatients,
    getPatientById,
    deletePatientById,
    success,
    error,
    resetMessages,
  } = useAdminAuthStore();

  const [patients, setPatients] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [tableLoading, setTableLoading] = useState(false);
  const [exportFormat, setExportFormat] = useState('excel');

  // Filters
  const [bloodGroup, setBloodGroup] = useState('');
  const [location, setLocation] = useState('');
  const [name, setName] = useState('');
  const [hospitalName, setHospitalName] = useState('');

  // Modal states
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deletePatientId, setDeletePatientId] = useState(null);

  const fetchPatients = async (page = 1) => {
    try {
      setTableLoading(true);
      const filters = {};
      if (bloodGroup) filters.bloodGroup = bloodGroup;
      if (location) filters.location = location;
      if (name) filters.name = name;
      if (hospitalName) filters.hospitalName = hospitalName;

      const data = await getPatients(page, 10, filters);
      setPatients(data.patients);
      setPageCount(data.totalPages);
      setCurrentPage(data.currentPage);
    } finally {
      setTableLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients(1);
  }, [bloodGroup, location, name, hospitalName]);

  const handleView = async (id) => {
    const patient = await getPatientById(id);
    if (patient) {
      setSelectedPatient(patient);
      setIsDialogOpen(true);
    }
  };

  const handleDelete = async () => {
    if (deletePatientId) {
      const ok = await deletePatientById(deletePatientId);
      if (ok) fetchPatients(currentPage);
      setDeletePatientId(null);
    }
  };

  useEffect(() => {
    if (success) toast.success(success);
    if (error) toast.error(error);
    if (success || error) resetMessages();
  }, [success, error, resetMessages]);

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-semibold text-highlight">Patients</h2>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <input
          type="text"
          placeholder="Search by name"
          className="px-3 py-2 border rounded-lg bg-neutral-900 text-gray-200 w-full focus:ring-2 focus:ring-green-600"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <select
          className="px-3 py-2 border rounded-lg bg-neutral-900 text-gray-200 w-full focus:ring-2 focus:ring-green-600"
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
          className="px-3 py-2 border rounded-lg bg-neutral-900 text-gray-200 w-full focus:ring-2 focus:ring-green-600"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <input
          type="text"
          placeholder="Search by hospital name"
          className="px-3 py-2 border rounded-lg bg-neutral-900 text-gray-200 w-full focus:ring-2 focus:ring-green-600"
          value={hospitalName}
          onChange={(e) => setHospitalName(e.target.value)}
        />
      </div>

      {/* Export */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <select
          value={exportFormat}
          onChange={(e) => setExportFormat(e.target.value)}
          className="px-3 py-2 border rounded-lg bg-neutral-900 text-gray-200 w-full focus:ring-2 focus:ring-green-600"
        >
          <option value="excel">Export as Excel</option>
          <option value="pdf">Export as PDF</option>
        </select>
        <button
          onClick={() =>
            exportPatients(
              { bloodGroup, location, name, hospitalName },
              exportFormat
            )
          }
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg w-full font-medium"
        >
          Export
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-700 shadow-sm">
        <table className="w-full border-collapse text-sm sm:text-base">
          <thead className="bg-neutral-800 text-gray-300">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Blood Group</th>
              <th className="p-3 text-left">Hospital</th>
              <th className="p-3 text-left">Location</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tableLoading ? (
              <tr>
                <td colSpan="5" className="p-6 text-center text-gray-400">
                  <MiniSpinner size={24} />
                </td>
              </tr>
            ) : patients.length > 0 ? (
              patients.map((patient) => (
                <tr
                  key={patient._id}
                  className="hover:bg-neutral-800/60 transition-colors"
                >
                  <td className="p-3 border-t border-gray-700">
                    {patient.fullName}
                  </td>
                  <td className="p-3 border-t border-gray-700">
                    {patient.bloodGroup}
                  </td>
                  <td className="p-3 border-t border-gray-700">
                    {patient.hospitalName}
                  </td>
                  <td className="p-3 border-t border-gray-700">
                    {patient.location}
                  </td>
                  <td className="p-3 border-t border-gray-700 text-center space-x-2">
                    {/* View */}
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                      <DialogTrigger asChild>
                        <Button
                          className="px-3 py-1 text-sm rounded-md bg-blue-600 hover:bg-blue-700 text-white"
                          onClick={() => handleView(patient._id)}
                        >
                          View
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-lg">
                        <DialogHeader>
                          <DialogTitle>Patient Details</DialogTitle>
                          <DialogDescription>
                            Information about {selectedPatient?.fullName}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-200 mt-4">
                          <p>
                            <strong>Name:</strong> {selectedPatient?.fullName}
                          </p>
                          <p>
                            <strong>Blood Group:</strong>{' '}
                            {selectedPatient?.bloodGroup}
                          </p>
                          <p>
                            <strong>Hospital:</strong>{' '}
                            {selectedPatient?.hospitalName}
                          </p>
                          <p>
                            <strong>Hospital Address:</strong>{' '}
                            {selectedPatient?.hospitalAddress}
                          </p>
                          <p>
                            <strong>Hospital Location:</strong>{' '}
                            {selectedPatient?.hospitalLocation}
                          </p>
                          <p>
                            <strong>Location:</strong>{' '}
                            {selectedPatient?.location}
                          </p>
                          <p>
                            <strong>Phone:</strong>{' '}
                            {selectedPatient?.phone || '-'}
                          </p>
                          <p>
                            <strong>Email:</strong>{' '}
                            {selectedPatient?.email || '-'}
                          </p>
                          <p className="sm:col-span-2">
                            <strong>Address:</strong>{' '}
                            {selectedPatient?.address || '-'}
                          </p>
                        </div>
                        <DialogFooter>
                          <DialogClose asChild>
                            <Button variant="outline">Close</Button>
                          </DialogClose>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

                    {/* Delete */}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          className="px-3 py-1 text-sm rounded-md bg-red-600 hover:bg-red-700 text-white"
                          onClick={() => setDeletePatientId(patient._id)}
                        >
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action will permanently delete the patient and
                            cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={handleDelete}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
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
        pageCount={pageCount}
        currentPage={currentPage}
        onPageChange={(page) => fetchPatients(page)}
      />
    </div>
  );
}
