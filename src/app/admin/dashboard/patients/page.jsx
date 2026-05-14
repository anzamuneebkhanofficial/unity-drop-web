/** @format */
'use client';

import { useEffect, useState } from 'react';
import { useAdminAuthStore } from '@/store/auth/authAdminStore';
import Pagination from '@/components/common/Pagination';
import { motion } from 'framer-motion';
import {
  Users,
  Search,
  MapPin,
  Droplets,
  Download,
  Trash2,
  Eye,
  Activity,
  ShieldCheck,
  User,
  Phone,
  Mail,
  Clock,
  AlertCircle,
  X,
  Hospital,
  Map
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogClose
} from '@/components/ui/dialog';
import DeleteAccountModal from '@/components/common/delete-account/DeleteAccountModal';
import { GenericSpinner as MiniSpinner } from '@/components/ui/Skeletons';

export default function PatientList() {
  const {
    getPatients,
    exportPatients,
    getPatientById,
    deletePatientById,
    tableLoading,
    exportLoading,
    loading,
    AdminCaught,
  } = useAdminAuthStore();

  // 🔑 Privilege gate: Super Admin always can delete; normal admin only if canDelete=true
  const canDelete = AdminCaught?.isSuperAdmin === true || AdminCaught?.canDelete === true;

  const [patients, setPatients] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [exportFormat, setExportFormat] = useState('excel');

  // Filters
  const [bloodGroup, setBloodGroup] = useState('');
  const [location, setLocation] = useState('');
  const [name, setName] = useState('');

  // Modal states
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null); // { id, name }
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchPatients = async (page = 1) => {
    const filters = {};
    if (bloodGroup) filters.bloodGroup = bloodGroup;
    if (location) filters.location = location;
    if (name) filters.name = name;

    const data = await getPatients(page, 10, filters);
    if (data) {
      setPatients(data.patients);
      setPageCount(data.totalPages);
      setCurrentPage(data.currentPage);
    }
  };

  // Debounced Search Logic
  useEffect(() => {
    const timer = setTimeout(() => {
      // Avoid fetching if search terms are too short (optional, but good for performance)
      if (name && name.length < 2 && name !== '') return;
      fetchPatients(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [bloodGroup, location, name]);

  const handleView = async (id) => {
    const patient = await getPatientById(id);
    if (patient) {
      setSelectedPatient(patient);
      setIsViewOpen(true);
    }
  };

  // Opens the delete modal for a given patient
  const openDeleteModal = (patient) => {
    setDeleteTarget({ id: patient._id, name: patient.fullName });
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const ok = await deletePatientById(deleteTarget.id);
      if (ok) {
        // Close view dialog if the deleted patient was open
        if (selectedPatient?._id === deleteTarget.id) {
          setIsViewOpen(false);
          setSelectedPatient(null);
        }
        fetchPatients(currentPage);
      }
    } finally {
      setDeleting(false);
      setIsDeleteModalOpen(false);
      setDeleteTarget(null);
    }
  };

  return (
    <>
      <div className="p-4 sm:p-8 space-y-8 animate-in fade-in duration-700">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-surface border border-white/5 p-8 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="h-3 w-3 rounded-full bg-donor/80 animate-pulse shadow-[0_0_15px_rgba(var(--donor-hex),0.5)]"></div>
              <h1 className="text-3xl font-black tracking-tighter text-white uppercase italic">All Patients</h1>
            </div>
            <p className="text-text-dim text-sm font-bold uppercase tracking-widest flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-donor/80" /> Admin Panel
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex flex-col items-end mr-4">
              <span className="text-[10px] font-black text-text-dim uppercase tracking-widest leading-none">Status</span>
              <span className="text-xs font-black text-donor uppercase">Platform</span>
            </div>
            <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-donor to-donor/60 flex items-center justify-center shadow-lg transform hover:rotate-6 transition-transform">
              <Droplets className="text-white w-7 h-7" />
            </div>
          </div>
        </div>

        {/* SEARCH & FILTERS */}
        <section className="bg-[#0f0f0f]/60 backdrop-blur-xl border border-white/10 p-8 rounded-xl space-y-8 shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <ModernInput
              label="Search by Name"
              placeholder="Patient name..."
              value={name}
              onChange={setName}
              icon={Search}
            />
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-white/80 tracking-[0.2em] ml-1">Blood Group</label>
              <div className="relative group">
                <select
                  className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-5 text-sm focus:outline-none focus:border-donor/50 transition-all text-white appearance-none cursor-pointer placeholder:text-white/60 shadow-xl"
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value)}
                >
                  <option value="">All Blood Groups</option>
                  {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(bg => (
                    <option key={bg} value={bg}>{bg}</option>
                  ))}
                </select>
                <Droplets className="absolute right-4 top-1/2 -translate-y-1/2 text-donor w-4 h-4 pointer-events-none" />
              </div>
            </div>
            <ModernInput
              label="Search by City"
              placeholder="City/Region..."
              value={location}
              onChange={setLocation}
              icon={MapPin}
            />
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-white/5">
            <div className="flex items-center gap-2 text-gray-500">
              <Activity className="w-4 h-4 animate-pulse text-donor" />
              <span className="text-[10px] font-black uppercase tracking-widest">Ready</span>
            </div>
            <div className="flex gap-3">
              <select
                value={exportFormat}
                onChange={(e) => setExportFormat(e.target.value)}
                className="bg-black border border-white/10 rounded-xl px-4 py-3.5 text-xs font-black uppercase text-gray-400 focus:outline-none focus:border-donor transition-all cursor-pointer disabled:opacity-50"
                disabled={exportLoading}
              >
                <option value="excel">Excel</option>
                <option value="pdf">PDF</option>
              </select>
              <button
                onClick={() => exportPatients({ bloodGroup, location, name }, exportFormat)}
                disabled={exportLoading}
                className="flex items-center gap-2 px-6 py-2.5 bg-green-600 hover:bg-green-500 disabled:bg-gray-700 disabled:text-gray-500 text-black font-black uppercase text-[10px] tracking-widest rounded-xl transition-all shadow-lg hover:shadow-green-500/20 active:scale-95 min-w-[120px] justify-center"
              >
                {exportLoading ? <MiniSpinner size={14} className="text-black" /> : <Download className="w-3.5 h-3.5" />}
                {exportLoading ? 'Exporting...' : 'Export'}
              </button>
            </div>
          </div>
        </section>

        {/* PATIENTS TABLE */}
        <div className="relative bg-surface border border-white/5 rounded-xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.02]">
                  <th className="px-8 py-6 text-[10px] font-black text-text-dim uppercase tracking-[0.3em]">Full Name</th>
                  <th className="px-8 py-6 text-[10px] font-black text-text-dim uppercase tracking-[0.3em]">Blood Group</th>
                  <th className="px-8 py-6 text-[10px] font-black text-text-dim uppercase tracking-[0.3em]">Hospital</th>
                  <th className="px-8 py-6 text-[10px] font-black text-text-dim uppercase tracking-[0.3em] text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.03]">
                {tableLoading ? (
                  <tr>
                    <td colSpan={4} className="py-24 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <MiniSpinner size={40} className="text-donor" />
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] animate-pulse">Loading patients...</p>
                      </div>
                    </td>
                  </tr>
                ) : patients.length > 0 ? (
                  patients.map((patient, idx) => (
                    <motion.tr
                      key={patient._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="group hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-xl bg-neutral-900 border border-white/5 flex items-center justify-center font-black text-donor text-sm group-hover:scale-110 transition-transform">
                            {patient.fullName.charAt(0)}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-black text-white uppercase">{patient.fullName}</span>
                            <span className="text-[10px] font-black text-text-dim uppercase tracking-tighter">{patient.location}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <div className="px-3 py-1 bg-donor/10 border border-donor/20 rounded-full w-fit text-[10px] font-black text-donor">
                          {patient.bloodGroup}
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-2 text-text-muted">
                          <Hospital className="w-3.5 h-3.5 text-text-dim" />
                          <span className="text-xs font-bold uppercase tracking-tighter truncate max-w-[200px]">{patient.hospitalName || 'Not set'}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center justify-center gap-3">
                          {/* VIEW BUTTON — always visible */}
                          <button
                            id={`view-patient-${patient._id}`}
                            onClick={() => handleView(patient._id)}
                            className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-500 hover:bg-blue-500 hover:text-black transition-all group/btn"
                            title="View Patient"
                          >
                            {tableLoading && selectedPatient?._id === patient._id
                              ? <MiniSpinner size={14} />
                              : <Eye className="w-4 h-4 group-hover/btn:scale-110" />}
                          </button>

                          {/* DELETE BUTTON — only shown if admin has delete privilege */}
                          {canDelete && (
                            <button
                              id={`delete-patient-row-${patient._id}`}
                              onClick={() => openDeleteModal(patient)}
                              className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-all group/btn"
                              title="Delete Patient"
                            >
                              <Trash2 className="w-4 h-4 group-hover/btn:scale-110" />
                            </button>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-24 text-center">
                      <div className="flex flex-col items-center gap-4 opacity-50">
                        <Activity className="w-12 h-12 text-gray-700" />
                        <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.4em]">No patients found</p>
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
          onPageChange={(page) => fetchPatients(page)}
        />
      </div>

      {/* VIEW PATIENT PROFILE MODAL */}
      <Dialog
        open={isViewOpen}
        onOpenChange={(val) => {
          if (!val) setSelectedPatient(null);
          setIsViewOpen(val);
        }}
      >
        <DialogContent
          showCloseButton={false}
          className="sm:max-w-4xl lg:max-w-[calc(100vw-320px)] xl:max-w-5xl lg:left-[calc(50%+140px)] bg-surface/95 backdrop-blur-2xl border border-white/10 rounded-[3rem] shadow-[0_0_100px_rgba(0,0,0,1)] p-0 overflow-hidden outline-none border-none"
        >
          <div className="relative max-h-[85vh] overflow-y-auto custom-scrollbar p-8 md:p-14">
            {/* Close Button */}
            <DialogClose className="absolute right-6 top-6 md:right-8 md:top-8 p-3 bg-white/5 hover:bg-donor hover:text-black rounded-2xl transition-all border border-white/10 z-50">
              <X className="w-5 h-5" />
            </DialogClose>

            {tableLoading && !selectedPatient ? (
              <div className="flex flex-col items-center justify-center py-32 gap-4">
                <MiniSpinner size={48} className="text-donor" />
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 animate-pulse">Loading patient details...</p>
              </div>
            ) : selectedPatient && (
              <div className="space-y-10">
                {/* Patient Header */}
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <div className="h-24 w-24 rounded-[2rem] bg-gradient-to-br from-red-600 to-orange-600 flex items-center justify-center shadow-2xl">
                      <Activity className="w-10 h-10 text-white" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <h2 className="text-3xl font-black text-white uppercase tracking-tighter">{selectedPatient.fullName}</h2>
                    <p className="text-donor font-black text-xs uppercase tracking-[0.2em] flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" /> Verified Patient
                    </p>
                  </div>
                </div>

                {/* Patient Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-10 bg-white/[0.02] border border-white/5 rounded-[2rem]">
                  <DetailBox icon={Droplets} label="Blood Group" value={selectedPatient.bloodGroup} color="text-donor" />
                  <DetailBox icon={User} label="Gender" value={selectedPatient.gender} />
                  <DetailBox icon={Mail} label="Email" value={selectedPatient.email} />
                  <DetailBox icon={Phone} label="Phone" value={selectedPatient.phone} />
                  <DetailBox icon={Hospital} label="Hospital Name" value={selectedPatient.hospitalName} />
                  <DetailBox icon={Map} label="Hospital City" value={selectedPatient.hospitalLocation} />
                  <DetailBox icon={MapPin} label="Hospital Address" value={selectedPatient.hospitalAddress} span={2} />
                  <DetailBox icon={Clock} label="Request Date" value={selectedPatient.createdAt ? new Date(selectedPatient.createdAt).toLocaleString() : '—'} />
                  <DetailBox icon={Map} label="Home Address" value={selectedPatient.address} span={3} />
                  <DetailBox icon={ShieldCheck} label="Account Access" value="Full Access" color="text-highlight" />
                </div>

                {/* Footer Actions */}
                <div className="flex flex-col sm:flex-row justify-between gap-3">
                  {/* Delete from inside view — only shown if admin has delete privilege */}
                  {canDelete ? (
                    <button
                      id={`delete-patient-from-view-${selectedPatient._id}`}
                      onClick={() => {
                        setIsViewOpen(false);
                        openDeleteModal(selectedPatient);
                      }}
                      className="flex items-center gap-2 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white bg-red-600/80 hover:bg-red-500 border border-red-500/30 transition-all shadow-lg hover:shadow-red-500/20 active:scale-95"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete Account
                    </button>
                  ) : (
                    <div className="flex items-center gap-2 px-4 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest text-yellow-500/70 bg-yellow-500/5 border border-yellow-500/10">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      View Only Access
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button
                      onClick={() => exportPatients({ id: selectedPatient._id }, 'pdf')}
                      disabled={loading}
                      className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-text-muted hover:text-white hover:bg-white/10 transition-all font-black flex items-center gap-2 disabled:opacity-50"
                    >
                      {loading ? <MiniSpinner size={12} /> : <Download className="w-3 h-3" />}
                      {loading ? 'Generating...' : 'Download PDF'}
                    </button>
                    <DialogClose asChild>
                      <button className="px-8 py-3 bg-donor/80 hover:bg-donor text-black font-black uppercase text-[10px] tracking-widest rounded-lg transition-all shadow-lg shadow-red-500/20 active:scale-95">
                        Close
                      </button>
                    </DialogClose>
                  </div>
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
        roleName={`Patient "${deleteTarget?.name || ''}"`}
        description="The selected patient account will be permanently removed from the system. This action cannot be reversed and all associated data will be purged."
      />
    </>
  );
}

function DetailBox({ icon: Icon, label, value, color = 'text-gray-300', span = 1 }) {
  const spanClass = span === 3 ? 'md:col-span-3' : span === 2 ? 'md:col-span-2' : '';
  return (
    <div className={`space-y-2 ${spanClass} group`}>
      <div className="flex items-center gap-2">
        <Icon className="w-3.5 h-3.5 text-gray-600 group-hover:text-donor transition-colors" />
        <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest leading-none">{label}</span>
      </div>
      <div className={`p-5 bg-surface-2/60 border border-white/5 rounded-lg font-black text-xs uppercase tracking-tight break-all whitespace-normal ${color} group-hover:bg-surface-2 transition-colors`}>
        {value || 'Not available'}
      </div>
    </div>
  );
}

function ModernInput({ label, placeholder, value, onChange, icon: Icon }) {
  return (
    <div className="space-y-2 flex-grow group">
      <label className="text-[10px] font-black uppercase text-white/80 tracking-[0.2em] ml-1 group-focus-within:text-donor transition-colors uppercase leading-none">{label}</label>
      <div className="relative">
        <input
          type="text"
          placeholder={placeholder}
          className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-6 py-5 text-sm focus:outline-none focus:border-donor/50 transition-all text-white placeholder:text-white/60 shadow-xl"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        {Icon && <Icon className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-700 w-4 h-4 pointer-events-none group-focus-within:text-donor transition-colors" />}
      </div>
    </div>
  );
}