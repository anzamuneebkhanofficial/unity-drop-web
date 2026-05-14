/** @format */
'use client';

import { useEffect, useState } from 'react';
import { useAdminAuthStore } from '@/store/auth/authAdminStore';
import Pagination from '@/components/common/Pagination';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  Trash2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  AlertCircle,
  Lock,
  Eye,
  X,
  CheckCircle,
  XCircle,
  Clock,
  Shield,
  ShieldOff,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogClose
} from '@/components/ui/dialog';
import DeleteAccountModal from '@/components/common/delete-account/DeleteAccountModal';
import { GenericSpinner as MiniSpinner } from '@/components/ui/Skeletons';
import { toast } from 'sonner';

// ─── Approval Badge ─────────────────────────────────────────────────────────
function ApprovalBadge({ status }) {
  if (status === 'approved') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-green-500/10 border border-green-500/20 text-green-400">
        <CheckCircle className="w-3 h-3" /> Approved
      </span>
    );
  }
  if (status === 'rejected') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-red-500/10 border border-red-500/20 text-red-400">
        <XCircle className="w-3 h-3" /> Rejected
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-yellow-500/10 border border-yellow-500/20 text-yellow-400">
      <Clock className="w-3 h-3" /> Pending
    </span>
  );
}

export default function AdminManagementList() {
  const {
    getAllAdmins,
    deleteAdminById,
    updateAdminApproval,
    updateAdminPrivileges,
    AdminCaught,
  } = useAdminAuthStore();

  const [admins, setAdmins] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [tableLoading, setTableLoading] = useState(false);

  // Modal states
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Approval action state
  const [approvalLoading, setApprovalLoading] = useState(null); // admin id being acted on
  const [privilegeLoading, setPrivilegeLoading] = useState(null);

  const isSuperAdmin = AdminCaught?.isSuperAdmin === true;

  const fetchAdmins = async (page = 1) => {
    try {
      setTableLoading(true);
      const data = await getAllAdmins(page, 10);
      setAdmins(data.admins || []);
      setPageCount(data.totalPages || 0);
      setCurrentPage(data.currentPage || 1);
    } finally {
      setTableLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins(1);
  }, []);

  const openDeleteModal = (admin) => {
    if (admin._id === AdminCaught?._id) return;
    setDeleteTarget({ id: admin._id, name: admin.fullName });
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const ok = await deleteAdminById(deleteTarget.id);
      if (ok) fetchAdmins(currentPage);
    } finally {
      setDeleting(false);
      setIsDeleteModalOpen(false);
      setDeleteTarget(null);
    }
  };

  // ─── Approve / Reject ──────────────────────────────────────────────────────
  const handleApproval = async (adminId, status) => {
    setApprovalLoading(adminId);
    try {
      const ok = await updateAdminApproval(adminId, status);
      if (ok) {
        toast.success(status === 'approved' ? 'Admin approved!' : 'Admin rejected and removed.');
        // Close view modal if open for this admin
        if (selectedAdmin?._id === adminId) {
          setIsViewOpen(false);
          setSelectedAdmin(null);
        }
        fetchAdmins(currentPage);
      }
    } finally {
      setApprovalLoading(null);
    }
  };

  // ─── Toggle Delete Privilege ───────────────────────────────────────────────
  const handlePrivilege = async (adminId, currentCanDelete) => {
    setPrivilegeLoading(adminId);
    try {
      const newVal = !currentCanDelete;
      const ok = await updateAdminPrivileges(adminId, newVal);
      if (ok) {
        toast.success(newVal ? 'Delete privilege granted!' : 'Delete privilege removed.');
        // Update locally without full refetch for snappiness
        setAdmins((prev) =>
          prev.map((a) => (a._id === adminId ? { ...a, canDelete: newVal } : a))
        );
        if (selectedAdmin?._id === adminId) {
          setSelectedAdmin((prev) => ({ ...prev, canDelete: newVal }));
        }
      }
    } finally {
      setPrivilegeLoading(null);
    }
  };

  return (
    <>
      <div className="p-4 sm:p-8 space-y-8 animate-in fade-in duration-700">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-surface border border-highlight/20 p-8 rounded-xl relative overflow-hidden shadow-[0_20px_50px_rgba(var(--highlight-hex),0.1)]">
          <div className="absolute inset-0 bg-gradient-to-br from-highlight/5 to-transparent" />
          <div className="space-y-2 relative z-10">
            <div className="flex items-center gap-3">
              <div className="h-3 w-3 rounded-full bg-highlight animate-pulse shadow-[0_0_15px_rgba(var(--highlight-hex),0.8)]" />
              <h1 className="text-3xl font-black tracking-tighter text-white uppercase italic">Admin Management</h1>
            </div>
            <p className="text-text-dim text-sm font-bold uppercase tracking-widest flex items-center gap-2">
              <Lock className="w-4 h-4 text-highlight" />
              {isSuperAdmin ? 'Manage all admins — Approval & Privileges' : 'View all admins'}
            </p>
          </div>
          <div className="flex items-center gap-3 relative z-10">
            <div className="flex flex-col items-end mr-4">
              <span className="text-[10px] font-black text-text-dim uppercase tracking-widest leading-none">Your Role</span>
              <span className="text-xs font-black text-highlight uppercase">{isSuperAdmin ? 'Super Admin' : 'Admin'}</span>
            </div>
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-highlight to-highlight/60 flex items-center justify-center shadow-lg transform hover:rotate-6 transition-transform">
              <ShieldCheck className="text-black w-7 h-7" />
            </div>
          </div>
        </div>

        {/* LEGEND (Super Admin only) */}
        {isSuperAdmin && (
          <div className="flex flex-wrap items-center gap-4 px-2 text-[10px] font-black uppercase tracking-widest text-text-dim">
            <span className="text-white">Approval Controls:</span>
            <ApprovalBadge status="pending" />
            <ApprovalBadge status="approved" />
            <span className="text-white ml-4">Privilege Controls:</span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400"><Shield className="w-3 h-3" /> View Only</span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400"><ShieldCheck className="w-3 h-3" /> View + Delete</span>
          </div>
        )}

        {/* ADMINS TABLE */}
        <div className="relative bg-surface border border-white/5 rounded-xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.02]">
                  <th className="px-6 py-6 text-[10px] font-black text-text-dim uppercase tracking-[0.3em]">Name</th>
                  <th className="px-6 py-6 text-[10px] font-black text-text-dim uppercase tracking-[0.3em]">Role</th>
                  <th className="px-6 py-6 text-[10px] font-black text-text-dim uppercase tracking-[0.3em]">Approval</th>
                  {isSuperAdmin && (
                    <th className="px-6 py-6 text-[10px] font-black text-text-dim uppercase tracking-[0.3em]">Privilege</th>
                  )}
                  <th className="px-6 py-6 text-[10px] font-black text-text-dim uppercase tracking-[0.3em] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.03]">
                {tableLoading ? (
                  <tr>
                    <td colSpan={isSuperAdmin ? 5 : 4} className="py-24 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <MiniSpinner size={40} className="text-highlight" />
                        <p className="text-[10px] font-black text-text-dim uppercase tracking-widest animate-pulse">Loading admins...</p>
                      </div>
                    </td>
                  </tr>
                ) : admins.length > 0 ? (
                  admins.map((admin, idx) => (
                    <motion.tr
                      key={admin._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className={`group hover:bg-white/[0.02] transition-colors ${admin._id === AdminCaught?._id ? 'bg-highlight/[0.02]' : ''}`}
                    >
                      {/* Name */}
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className={`h-10 w-10 rounded-xl bg-neutral-900 border ${admin.isSuperAdmin ? 'border-highlight' : 'border-white/5'} flex items-center justify-center font-black ${admin.isSuperAdmin ? 'text-highlight' : 'text-text-dim'} text-sm`}>
                            {admin.fullName.charAt(0)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-sm font-black text-white uppercase tracking-tight">{admin.fullName}</span>
                              {admin._id === AdminCaught?._id && <span className="text-[8px] px-1.5 py-0.5 bg-highlight text-black rounded font-black uppercase">You</span>}
                            </div>
                            <span className="text-[9px] text-text-dim lowercase tracking-tighter block">{admin.email}</span>
                          </div>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="px-6 py-5">
                        <div className={`inline-block px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${admin.isSuperAdmin ? 'bg-highlight/10 border border-highlight/20 text-highlight' : 'bg-blue-500/10 border border-blue-500/20 text-blue-500'}`}>
                          {admin.isSuperAdmin ? 'Super Admin' : 'Admin'}
                        </div>
                      </td>

                      {/* Approval Status */}
                      <td className="px-6 py-5">
                        {admin.isSuperAdmin ? (
                          <span className="text-[9px] text-highlight font-black uppercase tracking-widest">Auto-Approved</span>
                        ) : (
                          <ApprovalBadge status={admin.approvalStatus || 'pending'} />
                        )}
                      </td>

                      {/* Privilege (Super Admin view only) */}
                      {isSuperAdmin && (
                        <td className="px-6 py-5">
                          {admin.isSuperAdmin ? (
                            <span className="text-[9px] text-highlight font-black uppercase tracking-widest">All Privileges</span>
                          ) : admin.approvalStatus !== 'approved' ? (
                            <span className="text-[9px] text-text-dim font-black uppercase tracking-widest">Approve First</span>
                          ) : (
                            <button
                              onClick={() => handlePrivilege(admin._id, admin.canDelete)}
                              disabled={privilegeLoading === admin._id}
                              title={admin.canDelete ? 'Click to remove delete privilege' : 'Click to grant delete privilege'}
                              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all hover:opacity-80 ${
                                admin.canDelete
                                  ? 'bg-purple-500/10 border-purple-500/20 text-purple-400'
                                  : 'bg-blue-500/10 border-blue-500/20 text-blue-400'
                              }`}
                            >
                              {privilegeLoading === admin._id ? (
                                <MiniSpinner size={12} />
                              ) : admin.canDelete ? (
                                <><ShieldCheck className="w-3 h-3" /> View + Delete</>
                              ) : (
                                <><Shield className="w-3 h-3" /> View Only</>
                              )}
                            </button>
                          )}
                        </td>
                      )}

                      {/* Actions */}
                      <td className="px-6 py-5">
                        <div className="flex items-center justify-end gap-2 flex-wrap">
                          {/* VIEW */}
                          <button
                            onClick={() => { setSelectedAdmin(admin); setIsViewOpen(true); }}
                            className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-500 hover:bg-blue-500 hover:text-black transition-all"
                            title="View Admin"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* APPROVE (Super Admin, pending admins only) */}
                          {isSuperAdmin && !admin.isSuperAdmin && admin.approvalStatus === 'pending' && (
                            <>
                              <button
                                onClick={() => handleApproval(admin._id, 'approved')}
                                disabled={approvalLoading === admin._id}
                                className="p-2.5 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 hover:bg-green-500 hover:text-black transition-all"
                                title="Approve Admin"
                              >
                                {approvalLoading === admin._id ? <MiniSpinner size={16} /> : <CheckCircle className="w-4 h-4" />}
                              </button>
                              <button
                                onClick={() => handleApproval(admin._id, 'rejected')}
                                disabled={approvalLoading === admin._id}
                                className="p-2.5 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 hover:bg-orange-500 hover:text-black transition-all"
                                title="Reject Admin"
                              >
                                {approvalLoading === admin._id ? <MiniSpinner size={16} /> : <XCircle className="w-4 h-4" />}
                              </button>
                            </>
                          )}

                          {/* DELETE (hidden for self) */}
                          {admin._id !== AdminCaught?._id && (
                            <button
                              onClick={() => openDeleteModal(admin)}
                              className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-all"
                              title="Delete Admin"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={isSuperAdmin ? 5 : 4} className="py-24 text-center">
                      <div className="flex flex-col items-center gap-4 opacity-50">
                        <AlertCircle className="w-12 h-12 text-gray-700" />
                        <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.4em]">No admins found</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* PAGINATION */}
        <Pagination
          pageCount={pageCount}
          currentPage={currentPage}
          onPageChange={(page) => fetchAdmins(page)}
        />
      </div>

      {/* VIEW ADMIN PROFILE MODAL */}
      <Dialog
        open={isViewOpen}
        onOpenChange={(val) => {
          if (!val) setSelectedAdmin(null);
          setIsViewOpen(val);
        }}
      >
        <DialogContent
          showCloseButton={false}
          className="sm:max-w-3xl lg:max-w-[calc(100vw-320px)] xl:max-w-3xl lg:left-[calc(50%+140px)] bg-surface/95 backdrop-blur-2xl border border-white/10 rounded-xl shadow-[0_0_100px_rgba(0,0,0,1)] p-0 overflow-hidden outline-none border-none"
        >
          <div className="relative max-h-[85vh] overflow-y-auto custom-scrollbar p-8 md:p-14">
            <DialogClose className="absolute right-6 top-6 md:right-8 md:top-8 p-3 bg-white/5 hover:bg-highlight hover:text-black rounded-2xl transition-all border border-white/10 z-50">
              <X className="w-5 h-5" />
            </DialogClose>

            {selectedAdmin && (
              <div className="space-y-10">
                {/* Header */}
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <div className={`h-24 w-24 rounded-xl bg-gradient-to-br ${selectedAdmin.isSuperAdmin ? 'from-yellow-600 to-yellow-900 border-highlight' : 'from-blue-600 to-blue-900 border-blue-500'} flex items-center justify-center shadow-2xl border-2`}>
                      <ShieldCheck className="w-10 h-10 text-white" />
                    </div>
                    <div className={`absolute -bottom-2 -right-2 h-8 w-8 ${selectedAdmin.isSuperAdmin ? 'bg-highlight' : 'bg-blue-500'} border-4 border-bg rounded-full shadow-lg`} />
                  </div>
                  <div className="space-y-1">
                    <h2 className="text-3xl font-black text-white uppercase tracking-tighter">{selectedAdmin?.fullName}</h2>
                    <p className="text-gray-400 font-black text-xs uppercase tracking-[0.2em] flex items-center gap-2">
                      <Lock className={`w-4 h-4 ${selectedAdmin?.isSuperAdmin ? 'text-highlight' : 'text-blue-500'}`} />
                      {selectedAdmin?.isSuperAdmin ? 'Super Admin' : 'Admin'}
                    </p>
                    {!selectedAdmin.isSuperAdmin && (
                      <div className="flex items-center gap-2 mt-1">
                        <ApprovalBadge status={selectedAdmin.approvalStatus || 'pending'} />
                      </div>
                    )}
                  </div>
                </div>

                {/* Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-10 bg-white/[0.02] border border-white/5 rounded-xl">
                  <DetailBox icon={Mail} label="Email" value={selectedAdmin?.email} />
                  <DetailBox icon={Phone} label="Phone" value={selectedAdmin?.phone} />
                  <DetailBox icon={MapPin} label="Location" value={selectedAdmin?.location || 'Not set'} />
                  <DetailBox icon={Calendar} label="Joined On" value={selectedAdmin?.createdAt ? new Date(selectedAdmin.createdAt).toLocaleDateString() : '—'} />
                </div>

                {/* Super Admin Controls */}
                {isSuperAdmin && !selectedAdmin.isSuperAdmin && (
                  <div className="p-6 bg-white/[0.02] border border-white/5 rounded-xl space-y-4">
                    <p className="text-[10px] font-black text-text-dim uppercase tracking-widest">Super Admin Controls</p>

                    {/* Approval controls */}
                    {selectedAdmin.approvalStatus === 'pending' && (
                      <div className="flex flex-wrap gap-3">
                        <button
                          onClick={() => handleApproval(selectedAdmin._id, 'approved')}
                          disabled={approvalLoading === selectedAdmin._id}
                          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-black bg-green-400 hover:bg-green-300 transition-all shadow-lg active:scale-95"
                        >
                          {approvalLoading === selectedAdmin._id ? <MiniSpinner size={14} /> : <CheckCircle className="w-4 h-4" />}
                          Approve Admin
                        </button>
                        <button
                          onClick={() => handleApproval(selectedAdmin._id, 'rejected')}
                          disabled={approvalLoading === selectedAdmin._id}
                          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-white bg-orange-600/80 hover:bg-orange-500 transition-all shadow-lg active:scale-95"
                        >
                          {approvalLoading === selectedAdmin._id ? <MiniSpinner size={14} /> : <XCircle className="w-4 h-4" />}
                          Reject Admin
                        </button>
                      </div>
                    )}

                    {/* Privilege controls */}
                    {selectedAdmin.approvalStatus === 'approved' && (
                      <div>
                        <p className="text-[10px] text-text-dim font-black uppercase tracking-widest mb-2">Delete Privilege</p>
                        <button
                          onClick={() => handlePrivilege(selectedAdmin._id, selectedAdmin.canDelete)}
                          disabled={privilegeLoading === selectedAdmin._id}
                          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg active:scale-95 ${
                            selectedAdmin.canDelete
                              ? 'bg-purple-500/20 border border-purple-500/30 text-purple-300 hover:bg-red-500/20 hover:border-red-500/30 hover:text-red-300'
                              : 'bg-blue-500/20 border border-blue-500/30 text-blue-300 hover:bg-purple-500/20 hover:border-purple-500/30 hover:text-purple-300'
                          }`}
                        >
                          {privilegeLoading === selectedAdmin._id ? (
                            <MiniSpinner size={14} />
                          ) : selectedAdmin.canDelete ? (
                            <><ShieldOff className="w-4 h-4" /> Remove Delete Privilege</>
                          ) : (
                            <><ShieldCheck className="w-4 h-4" /> Grant Delete Privilege</>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Footer Actions */}
                <div className="flex flex-col sm:flex-row justify-between gap-3">
                  {selectedAdmin?._id !== AdminCaught?._id ? (
                    <button
                      onClick={() => { setIsViewOpen(false); openDeleteModal(selectedAdmin); }}
                      className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white bg-red-600/80 hover:bg-red-500 border border-red-500/30 transition-all shadow-lg active:scale-95"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete Admin
                    </button>
                  ) : <div />}

                  <DialogClose asChild>
                    <button className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white font-black uppercase text-[10px] tracking-widest rounded-2xl transition-all shadow-lg active:scale-95 border border-white/10">
                      Close
                    </button>
                  </DialogClose>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* DELETE CONFIRMATION MODAL */}
      <DeleteAccountModal
        isOpen={isDeleteModalOpen}
        onClose={() => !deleting && setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        loading={deleting}
        roleName={`Admin "${deleteTarget?.name || ''}"`}
        description="The selected administrative account will be permanently deactivated and removed. All platform privileges for this user will be revoked immediately."
      />
    </>
  );
}

// Helper component
function DetailBox({ icon: Icon, label, value, color = 'text-gray-300', span = 1 }) {
  const spanClass = span === 3 ? 'md:col-span-3' : span === 2 ? 'md:col-span-2' : '';
  return (
    <div className={`space-y-2 ${spanClass} group`}>
      <div className="flex items-center gap-2">
        <Icon className="w-3.5 h-3.5 text-gray-600 group-hover:text-highlight transition-colors" />
        <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">{label}</span>
      </div>
      <div className={`p-5 bg-surface-2/60 border border-white/5 rounded-lg font-black text-xs uppercase tracking-tight break-all whitespace-normal ${color} group-hover:bg-surface-2 transition-colors`}>
        {value || 'Not available'}
      </div>
    </div>
  );
}