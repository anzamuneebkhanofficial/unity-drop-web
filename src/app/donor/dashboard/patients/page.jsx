/** @format */
'use client';

import { useEffect, useState } from 'react';
import Pagination from '@/components/common/Pagination';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogClose,
} from '@/components/ui/dialog';
import { GenericSpinner as MiniSpinner } from '@/components/ui/Skeletons';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { useDonorAuthStore } from '@/store/auth/authDonorStore';
import { X, Mail, MapPin, User, Activity, Droplets, Phone, ShieldAlert, HeartPulse, ShieldCheck, ClipboardCheck, Search } from 'lucide-react';


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
    error,
    success,
    resetMessages,
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
    }
  };

  return (
    <div className="p-4 sm:p-8 space-y-8 animate-in fade-in duration-700">
      {/* HEADER */}
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

        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end mr-4">
            <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest leading-none">Status</span>
            <span className="text-xs font-black text-highlight/80 uppercase">Platform</span>
          </div>
          <div className="h-14 w-14 bg-highlight/80 rounded-xl flex items-center justify-center shadow-[0_10px_30px_rgba(234,179,8,0.2)]">
            <ClipboardCheck className="text-black w-7 h-7" />
          </div>
        </div>
      </div>

      {/* SEARCH & FILTERS */}
      <section className="bg-[#0f0f0f]/60 backdrop-blur-xl border border-white/10 p-8 rounded-xl space-y-8 shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
                className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-6 py-5 text-sm focus:outline-none focus:border-highlight/80/50 focus:ring-1 focus:ring-highlight/20 transition-all text-white appearance-none cursor-pointer placeholder:text-white/60 shadow-xl"
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
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-white/80 tracking-[0.2em] ml-1">Show Per Page</label>
            <div className="relative group">
              <select
                className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-6 py-5 text-sm focus:outline-none focus:border-highlight/80/50 focus:ring-1 focus:ring-highlight/20 transition-all text-white appearance-none cursor-pointer placeholder:text-white/60 shadow-xl"
                value={limit}
                onChange={(e) => setLimit(Number(e.target.value))}
              >
                {[5, 10, 20].map(n => (
                  <option key={n} value={n}>{n} per page</option>
                ))}
              </select>
              <Activity className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 w-4 h-4 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-white/5 text-[10px] font-black uppercase tracking-widest text-gray-500">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-highlight/80 animate-pulse" />
            <span>Loading total patients from network...</span>
          </div>
        </div>
      </section>

      {/* PATIENTS TABLE */}
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
          <tbody className="divide-y divide-white/5 relative">
            {patients.length === 0 && loading ? (
              <tr>
                <td colSpan={4} className="p-24 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <div className="relative">
                      <div className="absolute inset-0 bg-highlight/80/20 blur-xl rounded-full animate-pulse"></div>
                      <MiniSpinner size={48} className="text-highlight/80 relative z-10" />
                    </div>
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-white">Loading patients...</p>
                  </div>
                </td>
              </tr>
            ) : patients.length > 0 ? (
              <>
                <AnimatePresence mode="popLayout">
                  {patients.map((p, idx) => (
                    <motion.tr
                      key={p._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.3, delay: idx * 0.05 }}
                      className="group hover:bg-white/[0.04] transition-colors duration-300 border-b border-white/5 last:border-0"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-xl bg-neutral-900 border border-white/10 flex items-center justify-center text-highlight/80 group-hover:border-highlight/80/50 group-hover:bg-highlight/80/10 transition-all duration-500">
                            <User className="w-5 h-5" />
                          </div>
                          <div className="flex flex-col">
                            <span className="font-bold text-gray-200 group-hover:text-white transition-colors uppercase text-xs tracking-tight flex items-center gap-2">
                              {p.fullName}
                            </span>
                            <span className="text-[9px] text-gray-500 font-black uppercase tracking-tighter">Verified Patient</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="px-3 py-1 rounded-lg bg-donor/5 text-donor border border-donor/10 text-[10px] font-black uppercase tracking-widest group-hover:bg-donor/10 transition-colors">
                          {p.bloodGroup}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2 text-gray-400 group-hover:text-gray-300 transition-colors">
                          <div className="h-6 w-6 rounded-md bg-neutral-900 flex items-center justify-center border border-white/5">
                            <MapPin className="w-3 h-3 text-highlight/80/50" />
                          </div>
                          <span className="text-xs font-bold uppercase tracking-tighter">{p.location}</span>
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => handleView(p._id)}
                          className="px-6 py-2.5 rounded-lg bg-white/[0.03] text-gray-400 border border-white/5 text-[10px] font-black uppercase tracking-widest hover:bg-highlight/80 hover:text-black hover:border-highlight/80 transition-all duration-500 active:scale-95 group-hover:shadow-[0_0_20px_rgba(234,179,8,0.2)] flex items-center gap-2 mx-auto"
                        >
                          <Activity className="w-3 h-3" /> View Profile
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </>
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
      </div>

      {/* PAGINATION */}
      <div className="mt-8 flex justify-center">
        <Pagination
          pageCount={totalPages}
          currentPage={currentPage}
          onPageChange={(page) => fetchPatients(page, limit)}
        />
      </div>

      {/* VIEW PATIENT DETAILS DIALOG */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent
          showCloseButton={false}
          className="sm:max-w-4xl lg:max-w-[calc(100vw-320px)] xl:max-w-5xl lg:left-[calc(50%+140px)] bg-[#0f0f0f]/95 backdrop-blur-2xl border border-white/10 rounded-xl shadow-[0_0_100px_rgba(0,0,0,1)] p-0 overflow-hidden outline-none border-none"
        >
          <div className="relative max-h-[85vh] overflow-y-auto custom-scrollbar p-8 md:p-14">
            {/* Close Button */}
            <DialogClose className="absolute right-6 top-6 md:right-8 md:top-8 p-3 bg-white/5 hover:bg-highlight hover:text-black rounded-lg transition-all border border-white/10 z-50">
              <X className="w-5 h-5" />
            </DialogClose>

            {!selectedPatient || viewLoading ? (
              <div className="flex flex-col items-center justify-center py-32 gap-4">
                <MiniSpinner size={48} className="text-highlight/80" />
                <p className="text-xs font-black uppercase tracking-widest text-gray-400 animate-pulse">Loading patient details...</p>
              </div>
            ) : (
              <div className="space-y-10">
                {/* Patient Header */}
                <div className="flex flex-col md:flex-row md:items-center gap-6">
                  <div className="relative">
                    <div className="h-24 w-24 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center shadow-2xl border-2 border-highlight/50">
                      <User className="w-10 h-10 text-white" />
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <h2 className="text-3xl font-black text-white uppercase tracking-tighter">{selectedPatient?.fullName}</h2>
                    <div className="flex items-center gap-3 pt-1">
                      <span className={`text-[10px] font-black px-4 py-1.5 rounded-full border uppercase tracking-widest ${patientStatus === 'Approved' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                          patientStatus === 'Pending' ? 'bg-highlight/80/10 text-highlight border-highlight/80/20' :
                            'bg-white/5 text-gray-400 border-white/5'
                        }`}>
                        {patientStatus || 'No Request'}
                      </span>
                      <p className="text-highlight font-black text-xs uppercase tracking-[0.2em] flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4" /> Verified Patient
                      </p>
                    </div>
                  </div>
                </div>

                {/* Patient Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-10 bg-white/[0.02] border border-white/5 rounded-xl">
                  <DetailBox icon={Droplets} label="Blood Group" value={selectedPatient?.bloodGroup} color="text-donor" />
                  <DetailBox icon={User} label="Gender" value={selectedPatient?.gender} />
                  <DetailBox icon={Activity} label="Status" value={patientStatus || 'No Request'} color={patientStatus === 'Approved' ? 'text-green-400' : patientStatus === 'Pending' ? 'text-highlight' : 'text-gray-500'} />
                  <DetailBox icon={Mail} label="Email" value={selectedPatient?.email} sensitive={patientStatus !== 'Approved'} />
                  <DetailBox icon={Phone} label="Phone" value={selectedPatient?.phone} sensitive={patientStatus !== 'Approved'} />
                  <DetailBox icon={MapPin} label="City" value={selectedPatient?.location} span={1} />
                </div>

                {patientStatus !== 'Approved' && (
                  <div className="p-6 bg-highlight/10 rounded-xl border border-highlight/20 flex gap-5 items-start shadow-lg">
                    <ShieldAlert className="w-6 h-6 text-highlight flex-shrink-0 mt-1" />
                    <div className="space-y-2">
                      <p className="text-xs font-black text-highlight uppercase tracking-widest">Secure Communication Notice</p>
                      <p className="text-[12px] text-gray-400 font-medium leading-relaxed">
                        To protect privacy, sensitive contact details are hidden by default. 
                        Donors cannot initiate requests directly; please wait for the patient to reach out and approve the connection 
                        to unlock encrypted phone and email information.
                      </p>
                    </div>
                  </div>
                )}

                <div className="bg-white/[0.02] border border-white/5 rounded-xl p-8 text-center space-y-4">
                  {patientStatus === 'Approved' ? (
                    <>
                      <div className="h-16 w-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto border border-green-500/20 shadow-[0_0_30px_rgba(34,197,94,0.1)]">
                        <ClipboardCheck className="w-8 h-8 text-green-500" />
                      </div>
                      <h3 className="text-xl font-black text-white uppercase tracking-tighter">Request Approved</h3>
                      <p className="text-sm text-gray-400">You can now contact {selectedPatient?.fullName} directly.</p>
                    </>
                  ) : patientStatus === 'Pending' ? (
                    <>
                      <div className="h-16 w-16 bg-highlight/80/10 rounded-full flex items-center justify-center mx-auto border border-highlight/80/20 shadow-[0_0_30px_rgba(245,158,11,0.1)]">
                        <Activity className="w-8 h-8 text-highlight/80 animate-pulse" />
                      </div>
                      <h3 className="text-xl font-black text-white uppercase tracking-tighter">Request Sent</h3>
                      <p className="text-sm text-gray-400">Your request is pending. Go to the Requests page to manage it.</p>
                    </>
                  ) : (
                    <>
                      <div className="h-16 w-16 bg-highlight/80/10 rounded-full flex items-center justify-center mx-auto border border-white/5">
                        <ShieldAlert className="w-8 h-8 text-highlight/80" />
                      </div>
                      <h3 className="text-xl font-black text-white uppercase tracking-tighter">Not Yet Connected</h3>
                      <p className="text-sm text-gray-400">Contact details are hidden. Send a blood request to this patient to get access.</p>
                    </>
                  )}

                  <div className="flex justify-center pt-6">
                    <DialogClose asChild>
                      <button className="px-8 py-3 bg-white/5 hover:bg-white/10 text-white font-black uppercase text-[10px] tracking-widest rounded-lg transition-all active:scale-95 border border-white/10 shadow-lg">
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
    </div>
  );
}

// --- HELPER COMPONENTS ---

function DetailBox({ icon: Icon, label, value, color = 'text-white/90', span = 1, sensitive = false }) {
  const spanClass = span === 3 ? 'md:col-span-3' : span === 2 ? 'md:col-span-2' : '';
  return (
    <div className={`space-y-3 ${spanClass} group`}>
      <div className="flex items-center gap-2">
        <Icon className="w-4 h-4 text-white/40 group-hover:text-highlight transition-colors" />
        <span className="text-[10px] font-black text-white/50 uppercase tracking-[.25em] leading-none">{label}</span>
      </div>
      <div className={`p-6 bg-white/[0.03] border border-white/10 rounded-xl font-black text-xs uppercase tracking-tight break-all whitespace-normal ${sensitive ? 'text-gray-600 italic' : color} group-hover:bg-white/[0.06] group-hover:border-white/20 transition-all duration-300 shadow-lg shadow-black/40`}>
        {sensitive ? 'Hidden until approved' : (value || 'Not available')}
      </div>
    </div>
  );
}

function ModernInput({ label, placeholder, value, onChange, icon: Icon }) {
  return (
    <div className="space-y-3">
      <label className="text-[10px] font-black uppercase text-white/80 tracking-[0.2em] ml-1">{label}</label>
      <div className="relative group">
        <Icon className="absolute left-6 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-white/20 group-focus-within:text-highlight transition-all" />
        <input
          type="text"
          placeholder={placeholder}
          className="w-full bg-white/[0.04] border border-white/10 rounded-xl pl-16 pr-6 py-5 text-sm focus:outline-none focus:border-highlight/50 focus:ring-1 focus:ring-highlight/20 transition-all text-white placeholder:text-white/60 shadow-xl shadow-black/20"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </div>
  );
}