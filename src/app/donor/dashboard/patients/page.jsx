
'use client';

import { useEffect, useState } from 'react';
import Pagination from '@/components/common/Pagination';
import { Dialog, DialogContent, DialogClose } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { useDonorAuthStore } from '@/store/auth/authDonorStore';
import { GenericSpinner as MiniSpinner } from '@/components/ui/Skeletons';
import {
  Mail, MapPin, User, Activity, Droplets, Phone,
  ShieldAlert, X, ShieldCheck, Search, Clock, Map, Hospital,
} from 'lucide-react';
import InfoDetailBox from '@/components/common/InfoDetailBox';
import { fmtDate } from '@/lib/fmtDate';

function ModernInput({ id, label, placeholder, value, onChange, icon: Icon }) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-[10px] font-black uppercase text-white/80 tracking-[0.2em] ml-1 cursor-pointer">{label}</label>
      <div className="relative group">
        <Icon className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-highlight transition-all" />
        <input
          id={id}
          type="text"
          autoComplete="off"
          placeholder={placeholder}
          className="w-full bg-white/[0.04] border border-white/10 rounded-xl pl-16 pr-6 py-5 text-sm focus:outline-none focus:border-highlight/50 focus:ring-1 focus:ring-highlight/20 transition-all text-white placeholder:text-white/60 shadow-xl shadow-black/20"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </div>
  );
}
export default function PatientList() {
  const {
    patients,
    totalPages,
    currentPage,
    loading,
    fetchPatients,
    fetchPatientById,
    setFilters,
    filters,
  } = useDonorAuthStore();

  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientStatus, setPatientStatus] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [viewLoading, setViewLoading] = useState(false);

  const [name, setName] = useState(filters.name || '');
  const [bloodGroup, setBloodGroup] = useState(filters.bloodGroup || '');
  const [location, setLocation] = useState(filters.location || '');
  const [limit, setLimit] = useState(5);

  // Debounced Search Logic
  useEffect(() => {
    const timer = setTimeout(() => {
      if (name && name.length < 2 && name !== '') return;
      setFilters({ name, bloodGroup, location });
      fetchPatients(1, limit);
    }, 500);

    return () => clearTimeout(timer);
  }, [name, bloodGroup, location, limit, fetchPatients, setFilters]);

  const handleView = async (id) => {
    try {
      setViewLoading(true);
      const result = await fetchPatientById(id);
      setViewLoading(false);

      if (result?.patient) {
        setSelectedPatient(result.patient);
        setPatientStatus(result.status);
        setIsDialogOpen(true);
      }
    } catch (err) {
      console.error('Error viewing patient:', err);
      toast.error('Something went wrong while fetching patient details.');
      setViewLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-8 space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-[#0f0f0f] border border-white/5 p-8 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="h-3 w-3 rounded-full bg-highlight/80 animate-pulse shadow-[0_0_15px_rgba(234,179,8,0.5)]"></div>
            <h1 className="text-3xl font-black tracking-tighter text-white uppercase italic">Patients Needing Blood</h1>
          </div>
          <p className="text-gray-500 text-sm font-bold uppercase tracking-widest flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-highlight/80" /> Verified Patients List
          </p>
        </div>
      </div>
      <section className="bg-[#0f0f0f]/60 backdrop-blur-xl border border-white/10 p-8 rounded-xl space-y-8 shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <ModernInput id="search-name" label="Search by Name" placeholder="Patient name..." value={name} onChange={setName} icon={Search} />

          <div className="space-y-2">
            <label htmlFor="filter-blood" className="text-[10px] font-black uppercase text-white/80 tracking-[0.2em] ml-1 cursor-pointer">Blood Group</label>
            <div className="relative group">
              <select id="filter-blood" className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-6 py-5 text-sm focus:outline-none focus:border-highlight/50 transition-all text-white appearance-none cursor-pointer shadow-xl" value={bloodGroup} onChange={(e) => setBloodGroup(e.target.value)}>
                <option value="">All Blood Groups</option>
                {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(bg => <option key={bg} value={bg}>{bg}</option>)}
              </select>
              <Droplets className="absolute right-4 top-1/2 -translate-y-1/2 text-donor w-4 h-4 pointer-events-none" />
            </div>
          </div>

          <ModernInput id="search-city" label="Search by City" placeholder="City/Region..." value={location} onChange={setLocation} icon={MapPin} />

          <div className="space-y-2">
            <label htmlFor="filter-limit" className="text-[10px] font-black uppercase text-white/80 tracking-[0.2em] ml-1 cursor-pointer">Show Per Page</label>
            <div className="relative group">
              <select id="filter-limit" className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-6 py-5 text-sm focus:outline-none focus:border-highlight/50 transition-all text-white appearance-none cursor-pointer shadow-xl" value={limit} onChange={(e) => setLimit(Number(e.target.value))}>
                {[5, 10, 20].map(n => <option key={n} value={n}>{n} per page</option>)}
              </select>
              <Activity className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 w-4 h-4 pointer-events-none" />
            </div>
          </div>
        </div>
      </section>
      <div className="relative bg-[#0c0c0c] border border-white/5 rounded-xl overflow-hidden shadow-2xl">
        <table className="w-full border-collapse">
          <thead className="bg-[#1a1a1a] text-gray-400">
            <tr>
              <th className="p-4 text-left font-bold uppercase tracking-widest text-[10px]">Patient</th>
              <th className="p-4 text-left font-bold uppercase tracking-widest text-[10px]">Blood Group</th>
              <th className="p-4 text-left font-bold uppercase tracking-widest text-[10px]">Location</th>
              <th className="p-4 text-center font-bold uppercase tracking-widest text-[10px]">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {patients.length === 0 && loading ? (
              <tr>
                <td colSpan={4} className="p-24 text-center">
                  <MiniSpinner size={48} className="text-highlight/80 mx-auto" />
                </td>
              </tr>
            ) : patients.length > 0 ? (
              <AnimatePresence mode="popLayout">
                {patients.map((p) => (
                  <motion.tr key={p._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="group hover:bg-white/[0.04] transition-colors border-b border-white/5">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-neutral-900 border border-white/10 flex items-center justify-center text-highlight group-hover:border-highlight/50 group-hover:bg-highlight/10 transition-all duration-500">
                          <User className="w-5 h-5" />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-gray-200 group-hover:text-white transition-colors uppercase text-xs tracking-tight">{p.fullName}</span>
                          <span className="text-[9px] text-gray-500 font-black uppercase tracking-tighter">Verified Patient</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="px-3 py-1 rounded-lg bg-donor/5 text-donor border border-donor/10 text-[10px] font-black uppercase tracking-widest">{p.bloodGroup}</span>
                    </td>
                    <td className="p-4 text-xs text-gray-400 break-words whitespace-normal max-w-[220px] min-w-[150px] uppercase font-bold tracking-tighter">
                      {p.location || '—'}
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleView(p._id)}
                        disabled={viewLoading}
                        className="px-6 py-2.5 rounded-lg bg-white/[0.03] text-gray-400 border border-white/5 text-[10px] font-black uppercase tracking-widest hover:bg-highlight/80 hover:text-black hover:border-highlight transition-all duration-500 active:scale-95 flex items-center gap-2 mx-auto disabled:opacity-50"
                      >
                        {viewLoading ? <MiniSpinner size={14} /> : <Activity className="w-3 h-3" />}
                        View Profile
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            ) : (
              <tr>
                <td colSpan={4} className="p-20 text-center">
                  <div className="flex flex-col items-center gap-2 text-gray-500">
                    <ShieldAlert className="w-10 h-10 opacity-20" />
                    <p className="text-xs font-black uppercase tracking-widest">No patients found</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {loading && patients.length > 0 && (
          <div className="absolute inset-0 bg-black/5 flex items-center justify-center pointer-events-none z-20">
            <div className="bg-black/80 backdrop-blur-md px-6 py-3 rounded-full border border-white/10 flex items-center gap-3 shadow-2xl">
              <MiniSpinner size={16} className="text-highlight/80" />
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Updating...</span>
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 flex justify-center">
        <Pagination pageCount={totalPages} currentPage={currentPage} onPageChange={(page) => fetchPatients(page, limit)} />
      </div>
      <Dialog open={isDialogOpen} onOpenChange={(val) => { if (!val) setSelectedPatient(null); setIsDialogOpen(val); }}>
        <DialogContent
          showCloseButton={false}
          className="max-w-5xl bg-[#0f0f0f]/95 backdrop-blur-2xl border border-white/10 rounded-[3rem] p-0 overflow-hidden outline-none"
        >
          <div className="relative max-h-[85vh] overflow-y-auto custom-scrollbar p-14">
            <DialogClose className="absolute right-8 top-8 p-3 bg-white/5 hover:bg-highlight hover:text-black rounded-2xl transition-all border border-white/10 z-50">
              <X className="w-5 h-5" />
            </DialogClose>

            {!selectedPatient || viewLoading ? (
              <div className="flex flex-col items-center justify-center py-32 gap-4">
                <MiniSpinner size={48} className="text-highlight" />
                <p className="text-xs font-black uppercase tracking-widest text-gray-400 animate-pulse">Loading patient details...</p>
              </div>
            ) : (
              <div className="space-y-10">
                <div className="flex items-center gap-6">
                  <div className="h-24 w-24 rounded-[2rem] bg-gradient-to-br from-red-600 to-orange-600 flex items-center justify-center shadow-2xl flex-shrink-0">
                    <User className="w-10 h-10 text-white" />
                  </div>
                  <div className="space-y-1">
                    <h2 className="text-3xl font-black text-white uppercase tracking-tighter">{selectedPatient?.fullName}</h2>
                    <div className="flex items-center gap-3 pt-1">
                      <span className={`text-[10px] font-black px-4 py-1.5 rounded-full border uppercase tracking-widest ${patientStatus === 'Approved' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                          patientStatus === 'Pending' ? 'bg-highlight/10 text-highlight border-highlight/20 animate-pulse' :
                            'bg-white/5 text-gray-500 border-white/5'
                        }`}>
                        {patientStatus || 'No Request'}
                      </span>
                      <p className="text-donor font-black text-xs uppercase tracking-[0.2em] flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4" /> Verified Patient
                      </p>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 p-10 bg-white/[0.02] border border-white/5 rounded-[2rem]">
                  <InfoDetailBox variant="dashboard" icon={Droplets} label="Blood Group" value={selectedPatient?.bloodGroup} color="text-donor" />
                  <InfoDetailBox variant="dashboard" icon={User} label="Gender" value={selectedPatient?.gender} />
                  <InfoDetailBox variant="dashboard" icon={Mail} label="Email" value={selectedPatient?.email} sensitive={patientStatus !== 'Approved'} />
                  <InfoDetailBox
                    variant="dashboard"
                    icon={selectedPatient?.emailVerified ? ShieldCheck : ShieldAlert}
                    label="Email Status"
                    value={selectedPatient?.emailVerified ? 'Verified' : 'Unverified'}
                    color={selectedPatient?.emailVerified ? 'text-green-400 font-bold' : 'text-donor font-bold'}
                  />
                  <InfoDetailBox variant="dashboard" icon={Phone} label="Phone" value={selectedPatient?.phone} sensitive={patientStatus !== 'Approved'} />
                  <InfoDetailBox variant="dashboard" icon={MapPin} label="City / Location" value={selectedPatient?.location} />
                  <InfoDetailBox variant="dashboard" icon={Clock} label="Registered On" value={fmtDate(selectedPatient?.createdAt)} />
                  <InfoDetailBox variant="dashboard" icon={Map} label="Full Address" value={selectedPatient?.address} span={3} />
                  <InfoDetailBox variant="dashboard" icon={Hospital} label="Hospital Name" value={selectedPatient?.hospitalName} />
                  <InfoDetailBox variant="dashboard" icon={MapPin} label="Hospital Location" value={selectedPatient?.hospitalLocation} />
                  <InfoDetailBox variant="dashboard" icon={Map} label="Hospital Address" value={selectedPatient?.hospitalAddress} />
                  <InfoDetailBox variant="dashboard" icon={Activity} label="Last Updated" value={fmtDate(selectedPatient?.updatedAt)} span={3} />
                </div>

                <div className="flex justify-end pt-2">
                  <DialogClose asChild>
                    <button className="px-8 py-3 bg-white/5 hover:bg-white/10 text-white font-black uppercase text-[10px] tracking-widest rounded-2xl transition-all shadow-lg active:scale-95 border border-white/10">
                      Close
                    </button>
                  </DialogClose>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}