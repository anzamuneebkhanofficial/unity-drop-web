
'use client';

import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import DeleteAccountModal from '@/components/common/delete-account/DeleteAccountModal';

export default function DangerZone({ roleName = 'User', onDelete, description }) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDeleteCallback = async () => {
    setDeleting(true);
    try {
      await onDelete();
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const safeRoleName = roleName || 'User';
  const defaultDescription = `Permanently delete your ${safeRoleName.toLowerCase()} account. This will remove all your data, session, and access rights from the system. This action `;

  return (
    <>
      <div className="bg-[#0c0c0c] border border-red-500/20 rounded-[2rem] p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-700 to-red-500 opacity-60" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center flex-shrink-0">
              <Trash2 className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-white uppercase tracking-wider mb-1">
                Danger Zone
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed max-w-md">
                {description || defaultDescription}
                <span className="text-red-400 font-semibold">cannot be undone</span>.
              </p>
            </div>
          </div>
          <button
            type="button"
            id={`${safeRoleName.toLowerCase()}-delete-account-btn`}
            onClick={() => setShowDeleteModal(true)}
            className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-extrabold uppercase tracking-wider text-white bg-red-600/90 hover:bg-red-500 border border-red-500/30 hover:border-red-400/50 shadow-[0_4px_20px_rgba(239,68,68,0.2)] hover:shadow-[0_4px_30px_rgba(239,68,68,0.4)] transition-all duration-200 whitespace-nowrap"
          >
            <Trash2 className="w-4 h-4" />
            Delete My Account
          </button>
        </div>
      </div>

      <DeleteAccountModal
        isOpen={showDeleteModal}
        onClose={() => !deleting && setShowDeleteModal(false)}
        onConfirm={handleDeleteCallback}
        loading={deleting}
        roleName={safeRoleName}
      />
    </>
  );
}