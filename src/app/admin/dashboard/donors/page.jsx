/** @format */

// /** @format */

// 'use client';

// import { useEffect, useState } from 'react';
// import { useAdminAuthStore } from '@/store/auth/auth-admin-store';
// import Pagination from '@/components/Pagination';
// import handleExport from '@/components/HandleExport';

// export default function DonorList() {
//   const { getDonors, exportDonors } = useAdminAuthStore();
//   const [donors, setDonors] = useState([]);
//   const [pageCount, setPageCount] = useState(0);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [tableLoading, setTableLoading] = useState(false);
//   const [exportFormat, setExportFormat] = useState('excel');

//   // Filters
//   const [bloodGroup, setBloodGroup] = useState('');
//   const [location, setLocation] = useState('');
//   const [name, setName] = useState(''); // ✅ Add name filter

//   const fetchDonors = async (page = 1) => {
//     try {
//       setTableLoading(true);
//       const filters = {};
//       if (bloodGroup) filters.bloodGroup = bloodGroup;
//       if (location) filters.location = location;
//       if (name) filters.name = name; // ✅ pass name to filters

//       const data = await getDonors(page, 2, filters);
//       setDonors(data.donors);
//       setPageCount(data.totalPages);
//       setCurrentPage(data.currentPage);
//     } finally {
//       setTableLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchDonors(1);
//   }, [bloodGroup, location, name]); // ✅ re-fetch when filters change

//   return (
//     <div className="p-6">
//       <h2 className="text-xl font-bold mb-4 text-highlight">Donors</h2>

//       {/* Filters */}
//       <div className="flex flex-wrap gap-4 mb-4">
//         <input
//           type="text"
//           placeholder="Search by name"
//           className="px-3 py-2 border rounded-md bg-neutral-900 text-gray-200"
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//         />
//         <select
//           className="px-3 py-2 border rounded-md bg-neutral-900 text-gray-200"
//           value={bloodGroup}
//           onChange={(e) => setBloodGroup(e.target.value)}
//         >
//           <option value="">All Blood Groups</option>
//           <option value="A+">A+</option>
//           <option value="A-">A-</option>
//           <option value="B+">B+</option>
//           <option value="B-">B-</option>
//           <option value="O+">O+</option>
//           <option value="O-">O-</option>
//           <option value="AB+">AB+</option>
//           <option value="AB-">AB-</option>
//         </select>

//         <input
//           type="text"
//           placeholder="Search by location (e.g. Lahore)"
//           className="px-3 py-2 border rounded-md bg-neutral-900 text-gray-200"
//           value={location}
//           onChange={(e) => setLocation(e.target.value)}
//         />
//       </div>

//       <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
//         <select
//           value={exportFormat}
//           onChange={(e) => setExportFormat(e.target.value)}
//           className="px-3 py-2 border rounded-md bg-neutral-900 text-gray-200"
//         >
//           <option value="excel">Export as Excel</option>
//           <option value="pdf">Export as PDF</option>
//         </select>

//         <button
//           onClick={() => exportDonors({ bloodGroup, location }, exportFormat)}
//           className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md"
//         >
//           Export
//         </button>
//       </div>

//       {/* Table */}
//       <div className="overflow-x-auto rounded-lg border border-gray-700">
//         <table className="w-full border-collapse">
//           <thead className="bg-neutral-800 text-gray-300">
//             <tr>
//               <th className="p-3 text-left">Name</th>
//               <th className="p-3 text-left">Blood Group</th>
//               <th className="p-3 text-center">Actions</th>
//               <th className="p-3 text-center">Location</th>
//             </tr>
//           </thead>
//           <tbody>
//             {tableLoading ? (
//               <tr>
//                 <td colSpan="3" className="p-6 text-center text-gray-400">
//                   <div className="flex items-center justify-center space-x-2">
//                     <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
//                     <span>Loading donors...</span>
//                   </div>
//                 </td>
//               </tr>
//             ) : donors.length > 0 ? (
//               donors.map((donor) => (
//                 <tr
//                   key={donor._id}
//                   className="hover:bg-neutral-800 transition-colors"
//                 >
//                   <td className="p-3 border-t border-gray-700">
//                     {donor.fullName}
//                   </td>
//                   <td className="p-3 border-t border-gray-700">
//                     {donor.bloodGroup}
//                   </td>
//                   <td className="p-3 border-t border-gray-700 text-center">
//                     {donor.location}
//                   </td>
//                   <td className="p-3 border-t border-gray-700 text-center space-x-2">
//                     <button className="px-3 py-1 text-sm rounded-md bg-blue-600 hover:bg-blue-700 text-white transition">
//                       View
//                     </button>
//                     <button className="px-3 py-1 text-sm rounded-md bg-red-600 hover:bg-red-700 text-white transition">
//                       Delete
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td
//                   colSpan="3"
//                   className="p-6 text-center text-gray-400 border-t border-gray-700"
//                 >
//                   No donors found
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Pagination */}
//       <Pagination
//         pageCount={pageCount}
//         currentPage={currentPage}
//         onPageChange={(page) => fetchDonors(page)}
//       />
//     </div>
//   );
// }
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
import MiniLoader from '@/components/MiniLoader';
import MiniSpinner from '@/components/MiniLoader/MiniLoader';

export default function DonorList() {
  const {
    getDonors,
    exportDonors,
    getDonorById,
    deleteDonorById,
    success,
    error,
    resetMessages,
  } = useAdminAuthStore();

  const [donors, setDonors] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [tableLoading, setTableLoading] = useState(false);
  const [exportFormat, setExportFormat] = useState('excel');

  // Filters
  const [bloodGroup, setBloodGroup] = useState('');
  const [location, setLocation] = useState('');
  const [name, setName] = useState('');

  // Modal states
  const [selectedDonor, setSelectedDonor] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteDonorId, setDeleteDonorId] = useState(null);

  const fetchDonors = async (page = 1) => {
    try {
      setTableLoading(true);
      const filters = {};
      if (bloodGroup) filters.bloodGroup = bloodGroup;
      if (location) filters.location = location;
      if (name) filters.name = name;

      const data = await getDonors(page, 2, filters); // 5 per page
      setDonors(data.donors);
      setPageCount(data.totalPages);
      setCurrentPage(data.currentPage);
    } finally {
      setTableLoading(false);
    }
  };

  useEffect(() => {
    fetchDonors(1);
  }, [bloodGroup, location, name]);

  const handleView = async (id) => {
    const donor = await getDonorById(id);
    // console.log('donor 100', donor);
    if (donor) {
      setSelectedDonor(donor);
      setIsDialogOpen(true);
    }
  };

  const handleDelete = async () => {
    if (deleteDonorId) {
      const successs = await deleteDonorById(deleteDonorId);
      if (successs) {
        fetchDonors(currentPage);
      }
      setDeleteDonorId(null);
    }
  };
  useEffect(() => {
    if (success) toast.success(success);
    if (error) toast.error(error);

    if (success || error) {
      resetMessages();
    }
  }, [success, error, resetMessages]);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4 text-highlight">Donors</h2>

      {/* Filters + Export */}
      <div className="grid grid-cols-1 sm:grid-cols-2  gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by name"
          className="px-3 py-2 border rounded-md bg-neutral-900 text-gray-200 w-full"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <select
          className="px-3 py-2 border rounded-md bg-neutral-900 text-gray-200 w-full"
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
          placeholder="Search by location (e.g. Lahore)"
          className="px-3 py-2 border rounded-md bg-neutral-900 text-gray-200 w-full"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        {/* Export controls sit in grid */}
        <div className="flex gap-2">
          <select
            value={exportFormat}
            onChange={(e) => setExportFormat(e.target.value)}
            className="flex-1 px-3 py-2 border rounded-md bg-neutral-900 text-gray-200"
          >
            <option value="excel">Export as Excel</option>
            <option value="pdf">Export as PDF</option>
          </select>
          <button
            onClick={() =>
              exportDonors({ bloodGroup, location, name }, exportFormat)
            }
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md"
          >
            Export
          </button>
        </div>
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
            {tableLoading ? (
              <tr>
                <td colSpan={4} className="p-6 text-center text-gray-400">
                  <MiniSpinner size={24} />
                </td>
              </tr>
            ) : donors.length > 0 ? (
              donors.map((donor) => (
                <tr
                  key={donor._id}
                  className="hover:bg-neutral-800 transition-colors"
                >
                  <td className="p-3 border-t border-gray-700">
                    {donor.fullName}
                  </td>
                  <td className="p-3 border-t border-gray-700">
                    {donor.bloodGroup}
                  </td>
                  <td className="p-3 border-t border-gray-700">
                    {donor.location}
                  </td>
                  <td className="p-3 border-t border-gray-700 text-center space-x-2">
                    {/* View */}
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                      <DialogTrigger asChild>
                        <Button
                          className="px-3 py-1 text-sm rounded-md bg-blue-600 hover:bg-blue-700 text-white"
                          onClick={() => handleView(donor._id)}
                        >
                          View
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-lg">
                        <DialogHeader>
                          <DialogTitle>Patient Details</DialogTitle>
                          <DialogDescription>
                            Information about {selectedDonor?.fullName}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-200 mt-4">
                          <p>
                            <strong>Name:</strong> {selectedDonor?.fullName}
                          </p>
                          <p>
                            <strong>Blood Group:</strong>{' '}
                            {selectedDonor?.bloodGroup}
                          </p>
                          <p>
                            <strong>Hospital:</strong>{' '}
                            {selectedDonor?.hospitalName}
                          </p>
                          <p>
                            <strong>Hospital Address:</strong>{' '}
                            {selectedDonor?.hospitalAddress}
                          </p>
                          <p>
                            <strong>Hospital Location:</strong>{' '}
                            {selectedDonor?.hospitalLocation}
                          </p>
                          <p>
                            <strong>Location:</strong> {selectedDonor?.location}
                          </p>
                          <p>
                            <strong>Phone:</strong>{' '}
                            {selectedDonor?.phone || '-'}
                          </p>
                          <p>
                            <strong>Email:</strong>{' '}
                            {selectedDonor?.email || '-'}
                          </p>
                          <p className="sm:col-span-2">
                            <strong>Address:</strong>{' '}
                            {selectedDonor?.address || '-'}
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
                          onClick={() => setDeleteDonorId(donor._id)}
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
        pageCount={pageCount}
        currentPage={currentPage}
        onPageChange={(page) => fetchDonors(page)}
      />
    </div>
  );
}
