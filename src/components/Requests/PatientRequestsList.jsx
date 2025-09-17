/** @format */

// /** @format */

// 'use client';

// import React, { useEffect } from 'react';

// import { toast } from 'sonner';
// import PatientRequestCard from './PatientRequestCard';
// import { useDonorAuthStore } from '@/store/auth/auth-donor-store';

// export default function PatientRequestsList() {
//   const {
//     requests,
//     fetchRequests,
//     updateRequestStatus,
//     loadingRequests,
//     errorRequests,
//     successRequests,
//     resetMessages,
//   } = useDonorAuthStore();

//   useEffect(() => {
//     fetchRequests();
//   }, []);

//   useEffect(() => {
//     if (errorRequests) toast.error(errorRequests);
//     if (successRequests) toast.success(successRequests);
//     resetMessages();
//   }, [errorRequests, successRequests]);

//   if (loadingRequests) return <p>Loading requests...</p>;
//   if (!loadingRequests && requests.length === 0)
//     return <p>No patient requests available.</p>;

//   return (
//     <div className="space-y-4">
//       {requests.map((req) => (
//         <PatientRequestCard
//           key={req._id}
//           request={req}
//           onUpdateStatus={updateRequestStatus}
//         />
//       ))}
//     </div>
//   );
// }
/** @format */

'use client';

import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import PatientRequestCard from './PatientRequestCard';
import { useDonorAuthStore } from '@/store/auth/auth-donor-store';
import Pagination from '@/components/Pagination'; // ReactPaginate wrapper

export default function PatientRequestsList() {
  const {
    requests,
    fetchRequests,
    updateRequestStatus,
    loadingRequests,
    errorRequests,
    successRequests,
    resetMessages,
  } = useDonorAuthStore();

  const [currentPage, setCurrentPage] = useState(1);
  const limit = 1; // 1 request per page

  useEffect(() => {
    fetchRequests();
  }, []);

  useEffect(() => {
    if (errorRequests) toast.error(errorRequests);
    if (successRequests) toast.success(successRequests);
    resetMessages();
  }, [errorRequests, successRequests]);

  if (loadingRequests) return <p>Loading requests...</p>;
  if (!loadingRequests && requests.length === 0)
    return <p>No patient requests available.</p>;

  const totalPages = Math.ceil(requests.length / limit);
  const startIndex = (currentPage - 1) * limit;
  const currentRequests = requests.slice(startIndex, startIndex + limit);

  return (
    <div className="space-y-4">
      {currentRequests.map((req) => (
        <PatientRequestCard
          key={req._id}
          request={req}
          onUpdateStatus={updateRequestStatus}
        />
      ))}

      {totalPages > 1 && (
        <Pagination
          pageCount={totalPages}
          currentPage={currentPage}
          onPageChange={(page) => setCurrentPage(page)}
        />
      )}
    </div>
  );
}
