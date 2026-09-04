/** @format */
'use client';

import { useEffect, useState } from 'react';
import { useAdminAuthStore } from '@/store/auth/authAdminStore';
import Pagination from '@/components/common/Pagination';
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
  Search,
  User,
  Activity,
} from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogClose
} from '@/components/ui/dialog';
import DeleteAccountModal from '@/components/common/delete-account/DeleteAccountModal';
import { GenericSpinner as MiniSpinner } from '@/components/ui/Skeletons';
import { toast } from 'sonner';
import InfoDetailBox from '@/components/common/InfoDetailBox';
import { fmtDate } from '@/lib/fmtDate';
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
  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
  const [approvalStatus, setApprovalStatus] = useState('');
  const [role, setRole] = useState('');
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [approvalLoading, setApprovalLoading] = useState(null);
  const [privilegeLoading, setPrivilegeLoading] = useState(null);

  const isSuperAdmin = AdminCaught?.isSuperAdmin === true;

  const fetchAdmins = async (page = 1) => {
    try {
      setTableLoading(true);
      const filters = {};
      if (name) filters.name = name;
      if (gender) filters.gender = gender;
      if (approvalStatus) filters.approvalStatus = approvalStatus;
      if (role) filters.role = role;

      const data = await getAllAdmins(page, 10, filters);
      setAdmins(data.admins || []);
      setPageCount(data.totalPages || 0);
      setCurrentPage(data.currentPage || 1);
    } finally {
      setTableLoading(false);
    }
  };

  // Debounced Search Logic
  useEffect(() => {
    const timer = setTimeout(() => {
      if (name && name.length < 2 && name !== '') return;
      fetchAdmins(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [name, gender, approvalStatus, role]);


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

  const handleApproval = async (adminId, status) => {
    setApprovalLoading(adminId);
    try {
      const ok = await updateAdminApproval(adminId, status);
      if (ok) {
        toast.success(status === 'approved' ? 'Admin approved!' : 'Admin rejected and removed.');
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

  const handlePrivilege = async (adminId, currentCanDelete) => {
    setPrivilegeLoading(adminId);
    try {
      const newVal = !currentCanDelete;
      const ok = await updateAdminPrivileges(adminId, newVal);
      if (ok) {
        toast.success(newVal ? 'Delete privilege granted!' : 'Delete privilege removed.');
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
      <div className="space-y-6 animate-in fade-in duration-700">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface border border-highlight/20 p-6 rounded-xl relative overflow-hidden shadow-[0_20px_50px_rgba(var(--highlight-hex),0.1)]">
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
        <section className="bg-[#0f0f0f]/60 backdrop-blur-xl border border-white/10 p-5 sm:p-6 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <ModernInput
              label="Search by Name"
              placeholder="Type admin name..."
              value={name}
              onChange={setName}
              icon={Search}
            />
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-white/80 tracking-[0.2em] ml-1">Role</label>
              <div className="relative group">
                <select
                  className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-5 text-sm focus:outline-none focus:border-highlight/50 transition-all text-white appearance-none cursor-pointer"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="">All Roles</option>
                  <option value="superadmin">Super Admin</option>
                  <option value="admin">Admin</option>
                </select>
                <ShieldCheck className="absolute right-4 top-1/2 -translate-y-1/2 text-highlight w-4 h-4 pointer-events-none" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-white/80 tracking-[0.2em] ml-1">Approval Status</label>
              <div className="relative group">
                <select
                  className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-5 text-sm focus:outline-none focus:border-highlight/50 transition-all text-white appearance-none cursor-pointer"
                  value={approvalStatus}
                  onChange={(e) => setApprovalStatus(e.target.value)}
                >
                  <option value="">All Statuses</option>
                  <option value="approved">Approved</option>
                  <option value="pending">Pending</option>
                  <option value="rejected">Rejected</option>
                </select>
                <Clock className="absolute right-4 top-1/2 -translate-y-1/2 text-highlight w-4 h-4 pointer-events-none" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-white/80 tracking-[0.2em] ml-1">Gender</label>
              <div className="relative group">
                <select
                  className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-5 text-sm focus:outline-none focus:border-highlight/50 transition-all text-white appearance-none cursor-pointer"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                >
                  <option value="">All Genders</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
                <User className="absolute right-4 top-1/2 -translate-y-1/2 text-highlight w-4 h-4 pointer-events-none" />
              </div>
            </div>
          </div>
        </section>
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
        <div className="relative bg-surface border border-white/5 rounded-xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.02]">
                  <th className="px-4 py-4 text-[10px] font-black text-text-dim uppercase tracking-[0.25em]">Name</th>
                  <th className="px-4 py-4 text-[10px] font-black text-text-dim uppercase tracking-[0.25em]">Role</th>
                  <th className="px-4 py-4 text-[10px] font-black text-text-dim uppercase tracking-[0.25em]">Email Status</th>
                  <th className="px-4 py-4 text-[10px] font-black text-text-dim uppercase tracking-[0.25em]">Approval</th>
                  <th className="px-4 py-4 text-[10px] font-black text-text-dim uppercase tracking-[0.25em]">Availability</th>
                  {isSuperAdmin && (
                    <th className="px-4 py-4 text-[10px] font-black text-text-dim uppercase tracking-[0.25em]">Privilege</th>
                  )}
                  <th className="px-4 py-4 text-[10px] font-black text-text-dim uppercase tracking-[0.25em] text-right w-[110px]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.03]">
                {tableLoading ? (
                  <tr>
                    <td colSpan={isSuperAdmin ? 7 : 6} className="py-24 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <MiniSpinner size={40} className="text-highlight" />
                        <p className="text-[10px] font-black text-text-dim uppercase tracking-widest animate-pulse">Loading admins...</p>
                      </div>
                    </td>
                  </tr>
                ) : admins.length > 0 ? (
                  admins.map((admin, idx) => (
                    <tr
                      key={admin._id}
                      style={{ animationDelay: `${idx * 50}ms` }}
                      className={`group hover:bg-white/[0.02] transition-colors animate-fade-up opacity-0 ${admin._id === AdminCaught?._id ? 'bg-highlight/[0.02]' : ''}`}
                    >
                      <td className="px-4 py-3 sm:py-3.5 max-w-[220px]">
                        <div className="flex items-center gap-3">
                          <div className={`h-9 w-9 rounded-xl bg-neutral-900 border ${admin.isSuperAdmin ? 'border-highlight' : 'border-white/5'} flex items-center justify-center font-black ${admin.isSuperAdmin ? 'text-highlight' : 'text-text-dim'} text-xs shrink-0`}>
                            {admin.fullName.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xs font-black text-white uppercase tracking-tight break-words whitespace-normal">{admin.fullName}</span>
                              {admin._id === AdminCaught?._id && <span className="text-[8px] px-1.5 py-0.5 bg-highlight text-black rounded font-black uppercase shrink-0">You</span>}
                            </div>
                            <span className="text-[9px] text-text-dim lowercase tracking-tighter block break-all">{admin.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 sm:py-3.5 whitespace-nowrap">
                        <div className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${admin.isSuperAdmin ? 'bg-highlight/10 border border-highlight/20 text-highlight' : 'bg-blue-500/10 border border-blue-500/20 text-blue-500'}`}>
                          {admin.isSuperAdmin ? 'Super Admin' : 'Admin'}
                        </div>
                      </td>
                      <td className="px-4 py-3 sm:py-3.5 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${admin.emailVerified ? 'bg-green-500/10 border border-green-500/20 text-green-400' : 'bg-red-500/10 border border-red-500/20 text-red-400'}`}>
                          {admin.emailVerified ? (
                            <><CheckCircle className="w-3 h-3" /> Verified</>
                          ) : (
                            <><XCircle className="w-3 h-3" /> Unverified</>
                          )}
                        </span>
                      </td>
                      <td className="px-4 py-3 sm:py-3.5 whitespace-nowrap">
                        {admin.isSuperAdmin ? (
                          <span className="text-[9px] text-highlight font-black uppercase tracking-widest">Auto-Approved</span>
                        ) : (
                          <ApprovalBadge status={admin.approvalStatus || 'pending'} />
                        )}
                      </td>
                      <td className="px-4 py-3 sm:py-3.5 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${admin.availabilityStatus ? 'bg-green-500/10 border border-green-500/20 text-green-400' : 'bg-gray-500/10 border border-gray-500/20 text-gray-400'}`}>
                          {admin.availabilityStatus ? (
                            <><CheckCircle className="w-3 h-3" /> Available</>
                          ) : (
                            <><XCircle className="w-3 h-3" /> Unavailable</>
                          )}
                        </span>
                      </td>
                      {isSuperAdmin && (
                        <td className="px-4 py-3 sm:py-3.5 whitespace-nowrap">
                          {admin.isSuperAdmin ? (
                            <span className="text-[9px] text-highlight font-black uppercase tracking-widest">All Privileges</span>
                          ) : admin.approvalStatus !== 'approved' ? (
                            <span className="text-[9px] text-text-dim font-black uppercase tracking-widest">Approve First</span>
                          ) : (
                            <button
                              onClick={() => handlePrivilege(admin._id, admin.canDelete)}
                              disabled={privilegeLoading === admin._id}
                              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all hover:opacity-80 ${admin.canDelete
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
                      <td className="px-4 py-3 sm:py-3.5">
                        <div className="grid grid-cols-2 gap-1.5 w-fit ml-auto">
                          <button
                            onClick={() => { setSelectedAdmin(admin); setIsViewOpen(true); }}
                            className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-500 hover:bg-blue-500 hover:text-black transition-all flex items-center justify-center"
                            title="View Admin"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          {isSuperAdmin && !admin.isSuperAdmin && admin.approvalStatus === 'pending' && (
                            <>
                              <button
                                onClick={() => handleApproval(admin._id, 'approved')}
                                disabled={approvalLoading === admin._id}
                                className="p-2 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 hover:bg-green-500 hover:text-black transition-all flex items-center justify-center"
                                title="Approve Admin"
                              >
                                {approvalLoading === admin._id ? <MiniSpinner size={14} /> : <CheckCircle className="w-3.5 h-3.5" />}
                              </button>
                              <button
                                onClick={() => handleApproval(admin._id, 'rejected')}
                                disabled={approvalLoading === admin._id}
                                className="p-2 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-400 hover:bg-orange-500 hover:text-black transition-all flex items-center justify-center"
                                title="Reject Admin"
                              >
                                {approvalLoading === admin._id ? <MiniSpinner size={14} /> : <XCircle className="w-3.5 h-3.5" />}
                              </button>
                            </>
                          )}
                          {admin._id !== AdminCaught?._id && (
                            <button
                              onClick={() => openDeleteModal(admin)}
                              className="p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center"
                              title="Delete Admin"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={isSuperAdmin ? 7 : 6} className="py-24 text-center">
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

        <Pagination
          pageCount={pageCount}
          currentPage={currentPage}
          onPageChange={(page) => fetchAdmins(page)}
        />
      </div>

      <Dialog
        open={isViewOpen}
        onOpenChange={(val) => {
          if (!val) setSelectedAdmin(null);
          setIsViewOpen(val);
        }}
      >
        <DialogContent
          showCloseButton={false}
          className="max-w-5xl bg-surface/95 backdrop-blur-2xl border border-white/10 rounded-[3rem] p-0 overflow-hidden outline-none"
        >
          <div className="relative max-h-[85vh] overflow-y-auto custom-scrollbar p-8 md:p-14">
            <DialogClose className="absolute right-6 top-6 md:right-8 md:top-8 p-3 bg-white/5 hover:bg-highlight hover:text-black rounded-2xl transition-all border border-white/10 z-50">
              <X className="w-5 h-5" />
            </DialogClose>

            {selectedAdmin && (
              <div className="space-y-10">
                <div className="flex items-center gap-6">
                  <div className="relative flex-shrink-0">
                    <div className={`h-24 w-24 rounded-[2rem] bg-gradient-to-br ${selectedAdmin.isSuperAdmin ? 'from-yellow-500 to-yellow-800' : 'from-blue-600 to-blue-900'} flex items-center justify-center shadow-2xl`}>
                      <ShieldCheck className="w-10 h-10 text-white" />
                    </div>
                    <div className={`absolute -bottom-2 -right-2 h-7 w-7 ${selectedAdmin.isSuperAdmin ? 'bg-highlight' : 'bg-blue-500'} border-4 border-bg rounded-full shadow-lg`} />
                  </div>
                  <div className="space-y-1">
                    <h2 className="text-3xl font-black text-white uppercase tracking-tighter">{selectedAdmin?.fullName}</h2>
                    <p className={`font-black text-xs uppercase tracking-[0.2em] flex items-center gap-2 ${selectedAdmin?.isSuperAdmin ? 'text-highlight' : 'text-blue-400'}`}>
                      <Lock className="w-3.5 h-3.5" />
                      {selectedAdmin?.isSuperAdmin ? 'Super Admin' : 'Admin'}
                    </p>
                    {!selectedAdmin.isSuperAdmin && (
                      <div className="flex items-center gap-2 mt-1">
                        <ApprovalBadge status={selectedAdmin.approvalStatus || 'pending'} />
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-10 bg-white/[0.02] border border-white/5 rounded-[2rem]">
                  <InfoDetailBox icon={Mail} label="Email" value={selectedAdmin?.email} />
                  <InfoDetailBox
                    icon={selectedAdmin?.emailVerified ? CheckCircle : XCircle}
                    label="Email Status"
                    value={selectedAdmin?.emailVerified ? 'Verified' : 'Unverified'}
                    color={selectedAdmin?.emailVerified ? 'text-green-500 font-black italic' : 'text-highlight font-black italic'}
                  />
                  <InfoDetailBox icon={Phone} label="Phone" value={selectedAdmin?.phone} />
                  <InfoDetailBox icon={MapPin} label="Location" value={selectedAdmin?.location} />
                  <InfoDetailBox icon={User} label="Gender" value={selectedAdmin?.gender} />
                  <InfoDetailBox icon={Clock} label="Account Created" value={fmtDate(selectedAdmin?.createdAt)} />
                  <InfoDetailBox
                    icon={selectedAdmin?.availabilityStatus ? CheckCircle : XCircle}
                    label="Availability Status"
                    value={selectedAdmin?.availabilityStatus ? 'Available' : 'Unavailable'}
                    color={selectedAdmin?.availabilityStatus ? 'text-green-400 font-bold' : 'text-gray-400 font-bold'}
                  />
                  <InfoDetailBox icon={Activity} label="Last Updated" value={fmtDate(selectedAdmin?.updatedAt)} />
                </div>

                {isSuperAdmin && !selectedAdmin.isSuperAdmin && (
                  <div className="p-6 bg-white/[0.02] border border-white/5 rounded-xl space-y-4">
                    <p className="text-[10px] font-black text-text-dim uppercase tracking-widest">Super Admin Controls</p>
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

                    {selectedAdmin.approvalStatus === 'approved' && (
                      <div>
                        <p className="text-[10px] text-text-dim font-black uppercase tracking-widest mb-2">Delete Privilege</p>
                        <button
                          onClick={() => handlePrivilege(selectedAdmin._id, selectedAdmin.canDelete)}
                          disabled={privilegeLoading === selectedAdmin._id}
                          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg active:scale-95 ${selectedAdmin.canDelete
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


function ModernInput({ label, placeholder, value, onChange, icon: Icon }) {
  return (
    <div className="space-y-2 flex-grow group">
      <label className="text-[10px] font-black uppercase text-white/80 tracking-[0.2em] ml-1 group-focus-within:text-highlight transition-colors uppercase leading-none">{label}</label>
      <div className="relative">
        <input
          type="text"
          placeholder={placeholder}
          className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-6 py-5 text-sm focus:outline-none focus:border-highlight/50 transition-all text-white placeholder:text-white/60 shadow-xl"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        {Icon && <Icon className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-700 w-4 h-4 pointer-events-none group-focus-within:text-highlight transition-colors" />}
      </div>
    </div>
  );
}