/** @format */

'use client';

import React from 'react';

export default function PatientRequestCard({ request, onUpdateStatus }) {
  const { patientId, status } = request;

  return (
    <div className="p-4 border rounded shadow hover:shadow-md flex justify-between items-center">
      <div>
        <p className="font-semibold">{patientId.fullName}</p>
        <p className="text-sm text-gray-500">{patientId.email}</p>
        <p className="text-sm mt-1">
          Status:{' '}
          <span
            className={`font-bold ${
              status === 'Approved'
                ? 'text-green-600'
                : status === 'Rejected'
                ? 'text-red-600'
                : 'text-yellow-600'
            }`}
          >
            {status || 'Pending'}
          </span>
        </p>
      </div>

      {status === 'Pending' && (
        <div className="flex gap-2">
          <button
            className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
            onClick={() => onUpdateStatus(request._id, 'Approved')}
          >
            Approve
          </button>
          <button
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            onClick={() => onUpdateStatus(request._id, 'Rejected')}
          >
            Reject
          </button>
        </div>
      )}
    </div>
  );
}
