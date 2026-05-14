/** @format */
'use client';

import { useState } from 'react';
import { AlertTriangle, Trash2, X, Loader2, ShieldAlert } from 'lucide-react';

/**
 * A professional, reusable Delete Account confirmation modal.
 *
 * Props:
 *   isOpen      {boolean}   – controls visibility
 *   onClose     {function}  – called when the user cancels
 *   onConfirm   {function}  – called when the user confirms deletion (async)
 *   loading     {boolean}   – shows spinner while deletion is in-progress
 *   roleName    {string}    – e.g. "Donor", "Patient", "Admin" (used in copy)
 */
export default function DeleteAccountModal({
  isOpen,
  onClose,
  onConfirm,
  loading = false,
  roleName = 'Account',
  description = null,
}) {
  if (!isOpen) return null;

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      aria-modal="true"
      role="dialog"
      aria-labelledby="delete-modal-title"
    >
      {/* Dark overlay */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={!loading ? onClose : undefined}
      />

      {/* Modal card */}
      <div className="relative z-10 w-full max-w-md animate-fadeIn">
        <div className="bg-[#0d0d0d] border border-red-500/30 rounded-[1.5rem] shadow-[0_0_60px_rgba(239,68,68,0.15)] overflow-hidden">
          {/* Top danger stripe */}
          <div className="h-1 w-full bg-gradient-to-r from-red-600 via-red-500 to-orange-500" />

          {/* Content */}
          <div className="p-8">
            {/* Icon + Close */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center shadow-inner">
                  <ShieldAlert className="w-7 h-7 text-red-400" />
                </div>
                <div>
                  <h2
                    id="delete-modal-title"
                    className="text-xl font-extrabold text-white tracking-tight"
                  >
                    Delete {roleName} Account?
                  </h2>
                  <p className="text-xs text-red-400/80 font-semibold uppercase tracking-widest mt-0.5">
                    Permanent Action
                  </p>
                </div>
              </div>

              {/* Close (X) button */}
              <button
                id="delete-modal-cancel-x"
                onClick={onClose}
                disabled={loading}
                aria-label="Cancel"
                className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Warning message */}
            <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4 mb-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-gray-300 leading-relaxed space-y-1">
                  <p className="font-semibold text-white">
                    This action cannot be undone.
                  </p>
                  {description ? (
                    <p>{description}</p>
                  ) : (
                    <p>
                      Your account will be{' '}
                      <span className="text-red-400 font-bold">
                        permanently deleted
                      </span>{' '}
                      from our database. All your data, history, and session will
                      be removed immediately and you will be logged out.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Cancel */}
              <button
                id="delete-modal-cancel-btn"
                onClick={onClose}
                disabled={loading}
                className="flex-1 py-3 px-6 rounded-xl font-bold text-sm uppercase tracking-wider text-gray-300 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Cancel
              </button>

              {/* Confirm Delete */}
              <button
                id="delete-modal-confirm-btn"
                onClick={onConfirm}
                disabled={loading}
                className="flex-1 py-3 px-6 rounded-xl font-extrabold text-sm uppercase tracking-wider text-white bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 border border-red-500/50 shadow-[0_4px_20px_rgba(239,68,68,0.3)] hover:shadow-[0_4px_30px_rgba(239,68,68,0.5)] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Deleting…
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    Yes, Delete Account
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
