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
import { usePatientAuthStore } from '@/store/auth/auth-patient-store';

export default function PatientDonorsList() {
  const {
    donors,
    totalPages,
    currentPage,
    loading,
    fetchDonors,
    fetchDonorById,
    setFilters,
    filters,
    sendBloodRequest,
    error,
    success,
    resetMessages,
  } = usePatientAuthStore();

  const [selectedDonor, setSelectedDonor] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [message, setMessage] = useState('');

  const [name, setName] = useState(filters.name || '');
  const [bloodGroup, setBloodGroup] = useState(filters.bloodGroup || '');
  const [location, setLocation] = useState(filters.location || '');
  const [limit, setLimit] = useState(5);

  // Fetch donors whenever filters or limit change
  useEffect(() => {
    setFilters({ name, bloodGroup, location });
    fetchDonors(1, limit);
  }, [name, bloodGroup, location, limit]);

  // Show toast for success/error
  useEffect(() => {
    if (success) toast.success(success);
    if (error) toast.error(error);
    if (success || error) resetMessages();
  }, [success, error, resetMessages]);

  const handleView = async (id) => {
    const donor = await fetchDonorById(id);
    if (donor) {
      setSelectedDonor(donor);
      setMessage(''); // reset message
      setIsDialogOpen(true);
    }
  };

  const handleSendRequest = async () => {
    if (!message.trim()) return toast.error('Message is required');
    const request = await sendBloodRequest(selectedDonor._id, message);
    if (request) {
      toast.success('Request sent successfully');
      setIsDialogOpen(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4 text-highlight">Donors</h2>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by name"
          className="px-3 py-2 border rounded-md bg-neutral-900 text-gray-200"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
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
        <select
          className="px-3 py-2 border rounded-md bg-neutral-900 text-gray-200"
          value={limit}
          onChange={(e) => setLimit(Number(e.target.value))}
        >
          <option value={5}>5 per page</option>
          <option value={2}>2 per page</option>
          <option value={10}>10 per page</option>
        </select>
      </div>

      {/* Donors Table */}
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
            ) : donors.length > 0 ? (
              donors.map((d) => (
                <tr
                  key={d._id}
                  className="hover:bg-neutral-800 transition-colors"
                >
                  <td className="p-3 border-t border-gray-700">{d.fullName}</td>
                  <td className="p-3 border-t border-gray-700">
                    {d.bloodGroup}
                  </td>
                  <td className="p-3 border-t border-gray-700">{d.location}</td>
                  <td className="p-3 border-t border-gray-700 text-center">
                    <Dialog
                      open={isDialogOpen && selectedDonor?._id === d._id}
                      onOpenChange={setIsDialogOpen}
                    >
                      <DialogTrigger asChild>
                        <Button onClick={() => handleView(d._id)}>View</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Donor Details</DialogTitle>
                          <DialogDescription>
                            Info about {selectedDonor?.fullName}
                          </DialogDescription>
                        </DialogHeader>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 text-gray-200">
                          <p>
                            <strong>Name:</strong> {selectedDonor?.fullName}
                          </p>
                          <p>
                            <strong>Email:</strong> {selectedDonor?.email}
                          </p>
                          <p>
                            <strong>Gender:</strong> {selectedDonor?.gender}
                          </p>
                          <p>
                            <strong>Blood Group:</strong>{' '}
                            {selectedDonor?.bloodGroup}
                          </p>
                          <p>
                            <strong>Location:</strong> {selectedDonor?.location}
                          </p>
                          <p>
                            <strong>Availability:</strong>{' '}
                            {selectedDonor?.availabilityStatus}
                          </p>
                        </div>

                        {/* Send Request Section */}
                        <div className="mt-4">
                          <textarea
                            placeholder="Enter your message"
                            className="w-full p-2 rounded bg-neutral-900 text-white border border-gray-700"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                          />
                          <Button className="mt-2" onClick={handleSendRequest}>
                            Send Request
                          </Button>
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
                  No donors found
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
        onPageChange={(page) => fetchDonors(page, limit)}
      />
    </div>
  );
}
