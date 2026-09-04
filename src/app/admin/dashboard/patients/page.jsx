
'use client';

import { useEffect, useState } from 'react';
import { useAdminAuthStore } from '@/store/auth/authAdminStore';
import Pagination from '@/components/common/Pagination';
import {
  Users, Search, MapPin, Droplets, Trash2, Eye, Activity, ShieldCheck,
  User, Phone, Mail, Clock, AlertCircle, X, Hospital, Map, CheckCircle, XCircle
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogClose
} from '@/components/ui/dialog';
import DeleteAccountModal from '@/components/common/delete-account/DeleteAccountModal';
import { GenericSpinner as MiniSpinner } from '@/components/ui/Skeletons';
import InfoDetailBox from '@/components/common/InfoDetailBox';
import { fmtDate } from '@/lib/fmtDate';

function ModernInput({ id, label, placeholder, value, onChange, icon: Icon }) {
  return (
    <div className="space-y-2 flex-grow group">
      <label htmlFor={id} className="text-[10px] font-black uppercase text-white/80 tracking-[0.2em] ml-1 group-focus-within:text-donor transition-colors uppercase leading-none cursor-pointer">{label}</label>
      <div className="relative">
        <input
          id={id}
          type="text"
          autoComplete="off"
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
export default function PatientList() {
  const {
    getPatients,
    getPatientById,
    deletePatientById,
    tableLoading,
    AdminCaught,
  } = useAdminAuthStore();

  const [mounted, setMounted] = useState(false);
  const [patients, setPatients] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [bloodGroup, setBloodGroup] = useState('');
  const [location, setLocation] = useState('');
  const [name, setName] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const canDelete = AdminCaught?.isSuperAdmin === true || AdminCaught?.canDelete === true;

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchPatients = async (page = 1) => {
    const filters = { bloodGroup, location, name };
    const data = await getPatients(page, 10, filters);
    if (data) {
      setPatients(data.patients);
      setPageCount(data.totalPages);
      setCurrentPage(data.currentPage);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
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

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    const ok = await deletePatientById(deleteTarget.id);
    if (ok) {
      if (selectedPatient?._id === deleteTarget.id) {
        setIsViewOpen(false);
      }
      fetchPatients(currentPage);
    }
    setDeleting(false);
    setIsDeleteModalOpen(false);
    setDeleteTarget(null);
  };

  if (!mounted) return null;

  return (
    <>
      <div className="p-4 sm:p-8 space-y-8 animate-in fade-in duration-700">
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
        </div>

        <section className="bg-[#0f0f0f]/60 backdrop-blur-xl border border-white/10 p-8 rounded-xl space-y-8 shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <ModernInput id="search-name" label="Search by Name" placeholder="Patient name..." value={name} onChange={setName} icon={Search} />
            <div className="space-y-2">
              <label htmlFor="filter-blood" className="text-[10px] font-black uppercase text-white/80 tracking-[0.2em] ml-1 cursor-pointer">Blood Group</label>
              <select id="filter-blood" className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-5 text-sm text-white appearance-none cursor-pointer shadow-xl" value={bloodGroup} onChange={(e) => setBloodGroup(e.target.value)}>
                <option value="">All Blood Groups</option>
                {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(bg => <option key={bg} value={bg}>{bg}</option>)}
              </select>
            </div>
            <ModernInput id="search-city" label="Search by City" placeholder="City/Region..." value={location} onChange={setLocation} icon={MapPin} />
          </div>
        </section>

        <div className="relative bg-surface border border-white/5 rounded-xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.02]">
                  <th className="px-8 py-6 text-[10px] font-black text-text-dim uppercase tracking-[0.3em]">Full Name</th>
                  <th className="px-8 py-6 text-[10px] font-black text-text-dim uppercase tracking-[0.3em]">Blood Group</th>
                  <th className="px-8 py-6 text-[10px] font-black text-text-dim uppercase tracking-[0.3em]">Location</th>
                  <th className="px-8 py-6 text-[10px] font-black text-text-dim uppercase tracking-[0.3em]">Availability</th>
                  <th className="px-8 py-6 text-[10px] font-black text-text-dim uppercase tracking-[0.3em] text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.03]">
                {tableLoading ? (
                  <tr><td colSpan={5} className="py-24 text-center"><MiniSpinner size={40} className="text-donor mx-auto" /></td></tr>
                ) : patients.length > 0 ? (
                  patients.map((patient, idx) => (
                    <tr key={patient._id} style={{ animationDelay: `${idx * 30}ms` }} className="group hover:bg-white/[0.02] transition-colors animate-fade-up opacity-0">
                      <td className="px-8 py-5 text-xs font-black uppercase text-white">{patient.fullName}</td>
                      <td className="px-8 py-5"><span className="px-3 py-1 bg-donor/10 rounded-full text-donor text-[10px] font-black">{patient.bloodGroup}</span></td>
                      <td className="px-8 py-5 text-xs text-gray-400 font-bold uppercase tracking-tighter break-words whitespace-normal max-w-[220px] min-w-[150px]">
                        {patient.location || 'Not set'}
                      </td>
                      <td className="px-8 py-5">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${patient.availabilityStatus ? 'bg-green-500/10 border border-green-500/20 text-green-400' : 'bg-gray-500/10 border border-gray-500/20 text-gray-400'}`}>
                          {patient.availabilityStatus ? (
                            <><CheckCircle className="w-3.5 h-3.5" /> Available</>
                          ) : (
                            <><XCircle className="w-3.5 h-3.5" /> Unavailable</>
                          )}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-center flex justify-center gap-2">
                        <button onClick={() => handleView(patient._id)} className="p-2 bg-blue-500/10 rounded-lg text-blue-500"><Eye className="w-4 h-4" /></button>
                        {canDelete && <button onClick={() => { setDeleteTarget({ id: patient._id, name: patient.fullName }); setIsDeleteModalOpen(true); }} className="p-2 bg-red-500/10 rounded-lg text-red-400"><Trash2 className="w-4 h-4" /></button>}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan={5} className="py-24 text-center text-gray-500 text-[10px] uppercase font-black">No patients found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <Pagination pageCount={pageCount} currentPage={currentPage} onPageChange={fetchPatients} />
      </div>

      <Dialog open={isViewOpen} onOpenChange={(val) => { if (!val) setSelectedPatient(null); setIsViewOpen(val); }}>
        <DialogContent showCloseButton={false} className="max-w-5xl bg-surface/95 backdrop-blur-2xl border border-white/10 rounded-[3rem] p-0 overflow-hidden outline-none">
          <div className="relative max-h-[85vh] overflow-y-auto custom-scrollbar p-14">
            <DialogClose className="absolute right-8 top-8 p-3 bg-white/5 hover:bg-donor hover:text-black rounded-2xl transition-all border border-white/10 z-50">
              <X className="w-5 h-5" />
            </DialogClose>
            {selectedPatient && (
              <div className="space-y-10">
                <div className="flex items-center gap-6">
                  <div className="h-24 w-24 rounded-[2rem] bg-gradient-to-br from-red-600 to-orange-600 flex items-center justify-center shadow-2xl flex-shrink-0">
                    <User className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-white uppercase tracking-tighter">{selectedPatient.fullName}</h2>
                    <p className="text-donor font-black text-xs uppercase tracking-[0.2em] mt-1">Verified Patient</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 p-10 bg-white/[0.02] border border-white/5 rounded-[2rem]">
                  <InfoDetailBox icon={Droplets} label="Blood Group" value={selectedPatient.bloodGroup} color="text-donor" />
                  <InfoDetailBox icon={User} label="Gender" value={selectedPatient.gender} />
                  <InfoDetailBox icon={Mail} label="Email" value={selectedPatient.email} />
                  <InfoDetailBox
                    icon={selectedPatient?.emailVerified ? CheckCircle : XCircle}
                    label="Email Status"
                    value={selectedPatient?.emailVerified ? 'Verified' : 'Unverified'}
                    color={selectedPatient?.emailVerified ? 'text-green-400 font-bold' : 'text-highlight font-bold'}
                  />
                  <InfoDetailBox icon={Phone} label="Phone" value={selectedPatient.phone} />
                  <InfoDetailBox icon={MapPin} label="Location / City" value={selectedPatient.location} />
                  <InfoDetailBox icon={Clock} label="Account Created" value={fmtDate(selectedPatient.createdAt)} />
                  <InfoDetailBox
                    icon={selectedPatient?.availabilityStatus ? CheckCircle : XCircle}
                    label="Availability Status"
                    value={selectedPatient?.availabilityStatus ? 'Available' : 'Unavailable'}
                    color={selectedPatient?.availabilityStatus ? 'text-green-400 font-bold' : 'text-gray-400 font-bold'}
                  />
                  <InfoDetailBox icon={Map} label="Full Address" value={selectedPatient.address} span={3} />
                  <InfoDetailBox icon={Hospital} label="Hospital Name" value={selectedPatient.hospitalName} />
                  <InfoDetailBox icon={MapPin} label="Hospital Location" value={selectedPatient.hospitalLocation} />
                  <InfoDetailBox icon={Map} label="Hospital Address" value={selectedPatient.hospitalAddress} />
                  <InfoDetailBox icon={Activity} label="Last Updated" value={fmtDate(selectedPatient.updatedAt)} span={3} />
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
        roleName={`Patient "${deleteTarget?.name || ''}"`}
        description="Permanently delete this patient. This action cannot be reversed."
      />
    </>
  );
}