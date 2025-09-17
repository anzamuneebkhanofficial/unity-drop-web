/** @format */

'use client';
import React, { useState, useEffect } from 'react';
import { useAdminAuthStore } from '@/store/auth/auth-admin-store';
import { toast } from 'sonner';

const SuperKeyGenerator = () => {
  const [keyInfo, setKeyInfo] = useState(null);
  const {
    generateSuperKey,
    getSuperKey,
    loading,
    success,
    error,
    resetMessages,
  } = useAdminAuthStore();
  const superAdminId = '68c84a8778121c4ddf86edc5';

  useEffect(() => {
    const fetchKey = async () => {
      const existingKey = await getSuperKey();

      // console.log('existingKey', existingKey);
      if (existingKey) setKeyInfo(existingKey);
    };
    fetchKey();
  }, [getSuperKey]);

  const handleGenerate = async () => {
    const result = await generateSuperKey(superAdminId);
    // console.log('result', result);
  };
  useEffect(() => {
    if (success) toast.success(success);
    if (error) toast.error(error);
    if (success || error) resetMessages();
  }, [success, error, resetMessages]);

  return (
    <div className="p-6 bg-neutral-900 text-white rounded-lg shadow-lg w-full max-w-md">
      <h2 className="text-xl font-bold mb-4">Super Key</h2>

      <button
        onClick={handleGenerate}
        disabled={loading}
        className="bg-yellow-400 text-black px-4 py-2 rounded-lg hover:bg-yellow-500 disabled:opacity-50"
      >
        {loading ? 'Processing...' : keyInfo ? 'Key Exists' : 'Generate Key'}
      </button>

      {keyInfo && (
        <div className="mt-4 p-4 bg-neutral-800 rounded-lg">
          <p>
            <strong>Key:</strong> {keyInfo.key}
          </p>
          <p>
            <strong>Expires At:</strong>{' '}
            {new Date(keyInfo.expiresAt).toLocaleString()}
          </p>
        </div>
      )}
    </div>
  );
};

export default SuperKeyGenerator;
