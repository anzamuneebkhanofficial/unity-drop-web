/** @format */

'use client';

import { useAdminAuthStore } from '@/store/auth/auth-admin-store';
import { useRouter } from 'next/navigation';

export default function DeleteAccountButton() {
  const { deleteOurself, loading } = useAdminAuthStore();
  const router = useRouter();

  const handleDelete = async () => {
    const confirmed = confirm('Are you sure you want to delete your account?');
    if (!confirmed) return;
    const success = await deleteOurself();
    if (success) router.push('/');
  };

  return (
    <button
      onClick={handleDelete}
      className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700"
      disabled={loading}
    >
      {loading ? 'Deleting...' : 'Delete Account'}
    </button>
  );
}
