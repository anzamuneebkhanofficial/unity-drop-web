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
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { usePatientAuthStore } from '@/store/auth/authPatientStore';
import { GenericSpinner as MiniSpinner } from '@/components/ui/Skeletons';
import { Mail, MapPin, User, Activity, Droplets, Phone, ShieldAlert, X, ClipboardCheck, ShieldCheck, HeartPulse, Search } from 'lucide-react';


export default function PatientDonorsList() {
  const {
    donors,
    totalPages,
    currentPage,
    loading,
    fetchDonors,
    fetchDonorById,
    setFilters,
    filters,
    sendBloodRequest,
    error,
    success,
    resetMessages,

  } = usePatientAuthStore();



  const [selectedDonor, setSelectedDonor] = useState(null);
  const [donorStatus, setDonorStatus] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [requestDetails, setRequestDetails] = useState({
    message: '',
    patientAge: '',
    bottlesRequired: '',
    hospitalName: '',
    city: '',
    pickAndDrop: 'No',
    exchangePossibility: 'No',
    caseDescription: '',
    attendantName: '',
    attendantPhone: '',
  });
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
      fetchDonors(1, limit);
    }, 500);

    return () => clearTimeout(timer);
  }, [name, bloodGroup, location, limit, fetchDonors, setFilters]);


  // View donor details
  const handleView = async (id) => {
    try {

      // If allowed, fetch donor details
      setViewLoading(true);
      const result = await fetchDonorById(id);
      setViewLoading(false);

      if (result?.donor) {
        setSelectedDonor(result.donor);
        setDonorStatus(result.status);
        setIsDialogOpen(true);
      }
    } catch (err) {
      console.error('Error viewing donor:', err);
      toast.error('Something went wrong while fetching donor details.');
    }
  };

  // Send blood request
  const handleSendRequest = async () => {
    if (!requestDetails.message.trim()) return toast.error('Message is required');
    if (donorStatus === 'Pending' || donorStatus === 'Approved') {
      return toast.warning(`Action not allowed: Current status is ${donorStatus}`);
    }
    const request = await sendBloodRequest(selectedDonor._id, requestDetails);
    if (request) {
      setIsDialogOpen(false);
      setRequestDetails({
        message: '',
        patientAge: '',
        bottlesRequired: '',
        hospitalName: '',
        city: '',
        pickAndDrop: 'No',
        exchangePossibility: 'No',
        caseDescription: '',
        attendantName: '',
        attendantPhone: '',
      });
      setSelectedDonor(null);
    }
  };

  return (
    <div className="p-4 sm:p-8 space-y-8 animate-in fade-in duration-700">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-[#0f0f0f] border border-white/5 p-8 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-3">
            <div className="h-3 w-3 rounded-full bg-donor/80 animate-pulse shadow-[0_0_15px_rgba(var(--donor),0.5)]"></div>
            <h1 className="text-3xl font-black tracking-tighter text-white uppercase italic">Find a Donor</h1>
          </div>
          <p className="text-gray-500 text-sm font-bold uppercase tracking-widest flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-donor/80" /> Verified Donors List
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-3">
          <div className="flex flex-col items-end mr-4">
            <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest leading-none">Status</span>
            <span className="text-xs font-black text-green-500 uppercase">Platform</span>
          </div>
          <div className="h-14 w-14 bg-donor/80 rounded-xl flex items-center justify-center shadow-[0_10px_30px_rgba(var(--donor),0.2)] group-hover:rotate-12 transition-transform duration-500">
            <HeartPulse className="text-white w-7 h-7" />
          </div>
        </div>
      </div>

      {/* SEARCH & FILTERS */}
      <section className="bg-[#0f0f0f]/60 backdrop-blur-xl border border-white/10 p-8 rounded-xl space-y-8 shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <ModernInput
            label="Search by Name"
            placeholder="Donor name..."
            value={name}
            onChange={setName}
            icon={Search}
          />
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-white/80 tracking-[.25em] ml-1">Blood Group</label>
            <div className="relative group">
              <select
                className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-6 py-5 text-sm focus:outline-none focus:border-donor/50 focus:ring-1 focus:ring-donor/20 transition-all text-white appearance-none cursor-pointer placeholder:text-white/60 shadow-xl"
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
            <label className="text-[10px] font-black uppercase text-white/80 tracking-[.25em] ml-1">Show Per Page</label>
            <div className="relative group">
              <select
                className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-6 py-5 text-sm focus:outline-none focus:border-donor/50 focus:ring-1 focus:ring-donor/20 transition-all text-white appearance-none cursor-pointer placeholder:text-white/60 shadow-xl"
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
            <Activity className="w-4 h-4 text-donor animate-pulse" />
            <span>Loading total donors from network...</span>
          </div>
        </div>
      </section>

      {/* DONORS TABLE */}
      <div className="relative bg-[#0c0c0c] border border-white/5 rounded-xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-[#1a1a1a] text-gray-400">
              <tr>
                <th className="p-4 text-left font-bold uppercase tracking-widest text-[10px]">Donor</th>
                <th className="p-4 text-left font-bold uppercase tracking-widest text-[10px]">Blood Group</th>
                <th className="p-4 text-left font-bold uppercase tracking-widest text-[10px]">Location</th>
                <th className="p-4 text-center font-bold uppercase tracking-widest text-[10px]">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 relative">
              {donors.length === 0 && loading ? (
                <tr>
                  <td colSpan={4} className="p-24 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="relative">
                        <div className="absolute inset-0 bg-donor/20 blur-xl rounded-full animate-pulse"></div>
                        <MiniSpinner size={48} className="text-donor/80 relative z-10" />
                      </div>
                      <p className="text-xs font-black uppercase tracking-[0.2em] text-white">Loading donors...</p>
                    </div>
                  </td>
                </tr>
              ) : donors.length > 0 ? (
                <AnimatePresence mode="popLayout">
                  {donors.map((d, idx) => (
                    <motion.tr
                      key={d._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.3, delay: idx * 0.05 }}
                      className="group hover:bg-white/[0.04] transition-colors duration-300 border-b border-white/5 last:border-0"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-xl bg-neutral-900 border border-white/10 flex items-center justify-center text-donor group-hover:border-donor/50 group-hover:bg-donor/10 transition-all duration-500">
                            <User className="w-5 h-5" />
                          </div>
                          <div className="flex flex-col">
                            <span className="font-bold text-gray-200 group-hover:text-white transition-colors uppercase text-xs tracking-tight flex items-center gap-2">
                              {d.fullName}
                            </span>
                            <span className="text-[9px] text-gray-500 font-black uppercase tracking-tighter">Verified Donor</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="px-3 py-1 rounded-lg bg-donor/5 text-donor border border-donor/10 text-[10px] font-black uppercase tracking-widest group-hover:bg-donor/10 transition-colors">
                          {d.bloodGroup}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2 text-gray-400 group-hover:text-gray-300 transition-colors">
                          <div className="h-6 w-6 rounded-md bg-neutral-900 flex items-center justify-center border border-white/5">
                            <MapPin className="w-3 h-3 text-donor/50" />
                          </div>
                          <span className="text-xs font-bold uppercase tracking-tighter">{d.location}</span>
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => handleView(d._id)}
                          className="px-6 py-2.5 rounded-lg bg-white/[0.03] text-gray-400 border border-white/5 text-[10px] font-black uppercase tracking-widest hover:bg-donor/80 hover:text-white hover:border-donor transition-all duration-500 active:scale-95 group-hover:shadow-[0_0_20px_rgba(var(--donor),0.2)] flex items-center gap-2 mx-auto"
                        >
                          <Activity className="w-3 h-3" /> View Profile
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
                      <p className="text-xs font-black uppercase tracking-widest">No donors found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Background loading overlay */}
        {loading && donors.length > 0 && (
          <div className="absolute inset-0 bg-black/5 flex items-center justify-center pointer-events-none z-20">
            <div className="bg-black/80 backdrop-blur-md px-6 py-3 rounded-full border border-white/10 flex items-center gap-3 shadow-2xl">
              <MiniSpinner size={16} className="text-donor/80" />
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Updating...</span>
            </div>
          </div>
        )}
      </div>

      {/* PAGINATION */}
      <div className="mt-8 flex justify-center">
        <Pagination
          pageCount={totalPages}
          currentPage={currentPage}
          onPageChange={(page) => fetchDonors(page, limit)}
        />
      </div>

      {/* VIEW DONOR DETAILS DIALOG */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent
          showCloseButton={false}
          className="sm:max-w-4xl lg:max-w-[calc(100vw-320px)] xl:max-w-5xl lg:left-[calc(50%+140px)] bg-[#0f0f0f]/95 backdrop-blur-2xl border border-white/10 rounded-xl shadow-[0_0_100px_rgba(0,0,0,1)] p-0 overflow-hidden outline-none border-none"
        >
          <div className="relative max-h-[85vh] overflow-y-auto custom-scrollbar p-8 md:p-14">
            {/* Close Button */}
            <DialogClose className="absolute right-6 top-6 md:right-8 md:top-8 p-3 bg-white/5 hover:bg-donor hover:text-black rounded-lg transition-all border border-white/10 z-50">
              <X className="w-5 h-5" />
            </DialogClose>

            {!selectedDonor || viewLoading ? (
              <div className="flex flex-col items-center justify-center py-32 gap-4">
                <MiniSpinner size={48} className="text-donor" />
                <p className="text-xs font-black uppercase tracking-widest text-gray-400 animate-pulse">Loading donor details...</p>
              </div>
            ) : (
              <div className="space-y-10">
                {/* Donor Header */}
                <div className="flex flex-col md:flex-row md:items-center gap-6">
                  <div className="relative">
                    <div className="h-24 w-24 rounded-xl bg-gradient-to-br from-red-600 to-orange-600 flex items-center justify-center shadow-2xl border-2 border-donor/50">
                      <User className="w-10 h-10 text-white" />
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <h2 className="text-3xl font-black text-white uppercase tracking-tighter">{selectedDonor?.fullName}</h2>
                    <div className="flex items-center gap-3 pt-1">
                      <span className={`text-[10px] font-black px-4 py-1.5 rounded-full border uppercase tracking-widest ${donorStatus === 'Approved' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                          donorStatus === 'Pending' ? 'bg-donor/10 text-donor border-donor/20 animate-pulse' :
                            donorStatus === 'Rejected' ? 'bg-gray-500/10 text-gray-400 border-white/5' :
                              'bg-white/5 text-gray-500 border-white/5'
                        }`}>
                        {donorStatus || 'No Request'}
                      </span>
                      <p className="text-donor font-black text-xs uppercase tracking-[0.2em] flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4" /> Verified Donor
                      </p>
                    </div>
                  </div>
                </div>

                {/* Donor Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-10 bg-white/[0.02] border border-white/5 rounded-xl">
                  <DetailBox icon={Droplets} label="Blood Group" value={selectedDonor?.bloodGroup} color="text-donor" />
                  <DetailBox icon={User} label="Gender" value={selectedDonor?.gender} />
                  <DetailBox icon={Mail} label="Email" value={selectedDonor?.email} sensitive={donorStatus !== 'Approved'} />
                  <DetailBox icon={Phone} label="Phone" value={selectedDonor?.phone} sensitive={donorStatus !== 'Approved'} />
                  <DetailBox icon={MapPin} label="City" value={selectedDonor?.location} span={1} />
                </div>

                {/* Blood Request Form */}
                <div className="space-y-10">
                  <div className="flex items-center gap-4">
                    <div className="h-px bg-white/5 flex-grow"></div>
                    <span className="text-[10px] font-black uppercase text-gray-700 tracking-[0.5em] italic">Send Blood Request</span>
                    <div className="h-px bg-white/5 flex-grow"></div>
                  </div>

                  {donorStatus === 'Approved' ? (
                    <div className="bg-green-500/5 border border-green-500/10 p-10 rounded-xl text-center space-y-6">
                      <div className="h-20 w-20 bg-green-500 rounded-lg flex items-center justify-center mx-auto shadow-[0_15px_40px_rgba(34,197,94,0.3)]">
                        <ClipboardCheck className="w-10 h-10 text-black" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-2xl font-black text-white uppercase tracking-tighter italic">Request Approved</h3>
                        <p className="text-sm text-gray-500 max-w-sm mx-auto font-medium">Your request was accepted. You can now contact this donor directly.</p>
                      </div>
                    </div>
                  ) : donorStatus === 'Pending' ? (
                    <div className="bg-donor/5 border border-donor/10 p-10 rounded-xl text-center space-y-6">
                      <div className="h-20 w-20 bg-donor/20 rounded-lg flex items-center justify-center mx-auto border border-donor/30 shadow-[0_0_50px_rgba(231,77,42,0.1)] transition-all">
                        <Activity className="w-10 h-10 text-donor animate-pulse" />
                      </div>
                      <div className="space-y-3">
                        <h3 className="text-2xl font-black text-white uppercase tracking-tighter italic">Request Under Review</h3>
                        <p className="text-sm text-gray-400 max-w-md mx-auto font-medium leading-relaxed">
                          Your blood request has been sent successfully and is currently <span className="text-donor italic font-black uppercase tracking-tighter">Pending</span>. Please wait for the donor to review your case.
                        </p>
                      </div>
                      <div className="pt-4 flex flex-col items-center gap-4">
                        <div className="inline-flex items-center gap-2 px-6 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
                          <ShieldAlert className="w-3.5 h-3.5 text-donor/50" /> Multiple requests are not allowed
                        </div>
                        <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">You will be updated via email once the donor responds.</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <ModernRequestInput label="Reason for Blood" placeholder="Medical case / surgery reason..." value={requestDetails.caseDescription} onChange={(val) => setRequestDetails({ ...requestDetails, caseDescription: val })} />
                        <div className="grid grid-cols-2 gap-4">
                          <ModernRequestInput label="Patient Age" type="number" placeholder="Years" value={requestDetails.patientAge} onChange={(val) => setRequestDetails({ ...requestDetails, patientAge: val })} />
                          <ModernRequestInput label="Bottles Needed" type="number" placeholder="Bottles" value={requestDetails.bottlesRequired} onChange={(val) => setRequestDetails({ ...requestDetails, bottlesRequired: val })} />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <ModernRequestInput label="Hospital Name" placeholder="Hospital / Clinic name" value={requestDetails.hospitalName} onChange={(val) => setRequestDetails({ ...requestDetails, hospitalName: val })} icon={ShieldCheck} />
                        <ModernRequestInput label="City" placeholder="City / Area" value={requestDetails.city} onChange={(val) => setRequestDetails({ ...requestDetails, city: val })} icon={MapPin} />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <ModernRequestInput label="Attendant Name" placeholder="Guardian / Attendant name" value={requestDetails.attendantName} onChange={(val) => setRequestDetails({ ...requestDetails, attendantName: val })} icon={User} />
                        <ModernRequestInput label="Attendant Phone" placeholder="Phone number" value={requestDetails.attendantPhone} onChange={(val) => setRequestDetails({ ...requestDetails, attendantPhone: val })} icon={Phone} />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <label className="text-[10px] font-black uppercase text-white/60 tracking-[.2em] ml-1">Pick & Drop Available?</label>
                          <select
                            className="w-full bg-[#121212] border border-white/10 rounded-lg px-6 py-5 text-sm focus:outline-none focus:border-red-500/50 transition-all text-white appearance-none cursor-pointer shadow-xl"
                            value={requestDetails.pickAndDrop}
                            onChange={(e) => setRequestDetails({ ...requestDetails, pickAndDrop: e.target.value })}
                          >
                            <option value="No">No</option>
                            <option value="Yes">Yes</option>
                          </select>
                        </div>
                        <div className="space-y-3">
                          <label className="text-[10px] font-black uppercase text-white/60 tracking-[.2em] ml-1">Blood Exchange Possible?</label>
                          <select
                            className="w-full bg-[#121212] border border-white/10 rounded-lg px-6 py-5 text-sm focus:outline-none focus:border-red-500/50 transition-all text-white appearance-none cursor-pointer shadow-xl"
                            value={requestDetails.exchangePossibility}
                            onChange={(e) => setRequestDetails({ ...requestDetails, exchangePossibility: e.target.value })}
                          >
                            <option value="No">No</option>
                            <option value="Yes">Yes</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase text-white/60 tracking-[.2em] ml-1">Your Message</label>
                        <textarea
                          className="w-full bg-[#121212] border border-white/10 rounded-xl px-8 py-7 text-sm focus:outline-none focus:border-red-500/50 transition-all text-white min-h-[160px] resize-none placeholder:text-white/40 shadow-2xl"
                          placeholder="Describe your situation and why you need blood..."
                          value={requestDetails.message}
                          onChange={(e) => setRequestDetails({ ...requestDetails, message: e.target.value })}
                        />
                      </div>

                      <button
                        onClick={handleSendRequest}
                        disabled={!requestDetails.message.trim() || loading}
                        className="w-full py-7 rounded-lg bg-gradient-to-br from-red-600 via-red-500 to-orange-600 text-white font-black uppercase tracking-[0.4em] shadow-[0_20px_60px_rgba(220,38,38,0.4)] hover:shadow-[0_25px_80px_rgba(220,38,38,0.6)] hover:scale-[1.01] active:scale-[0.98] transition-all disabled:opacity-30 disabled:grayscale disabled:scale-100 italic border border-white/20"
                      >
                        {loading ? <MiniSpinner size={24} className="mx-auto" /> :
                          donorStatus === 'Rejected' ? 'Send Request Again' :
                            'Send Blood Request'}
                      </button>
                    </div>
                  )}

                  <div className="flex justify-end pt-4">
                    <DialogClose asChild>
                      <button className="px-8 py-3 bg-white/5 hover:bg-white/10 text-white font-black uppercase text-[10px] tracking-widest rounded-lg transition-all shadow-lg active:scale-95 border border-white/10">
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

function DetailBox({ icon: Icon, label, value, color = 'text-white/90', span = 1, sensitive = false }) {
  const spanClass = span === 3 ? 'md:col-span-3' : span === 2 ? 'md:col-span-2' : '';
  return (
    <div className={`space-y-3 ${spanClass} group`}>
      <div className="flex items-center gap-2">
        <Icon className="w-4 h-4 text-white/40 group-hover:text-red-500 transition-colors" />
        <span className="text-[10px] font-black text-white/50 uppercase tracking-[.25em] leading-none">{label}</span>
      </div>
      <div className={`p-6 bg-white/[0.03] border border-white/10 rounded-lg font-black text-xs uppercase tracking-tight break-all whitespace-normal ${sensitive ? 'text-gray-600 italic' : color} group-hover:bg-white/[0.06] group-hover:border-white/20 transition-all duration-300 shadow-lg shadow-black/40`}>
        {sensitive ? 'Hidden until approved' : (value || 'Not available')}
      </div>
    </div>
  );
}

function ModernInput({ label, type = "text", placeholder, value, onChange, icon: Icon = null, disabled = false }) {
  return (
    <div className="space-y-3 flex-grow">
      <label className="text-[10px] font-black uppercase text-white/80 tracking-[0.2em] ml-1">{label}</label>
      <div className="relative group">
        {Icon && <Icon className="absolute left-6 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-white/20 group-focus-within:text-red-500 transition-all" />}
        <input
          type={type}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full bg-white/[0.04] border border-white/10 rounded-lg px-6 py-5 text-sm focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/20 transition-all text-white ${Icon ? 'pl-16' : ''} placeholder:text-white/60 shadow-xl shadow-black/20 ${disabled ? 'opacity-40 cursor-not-allowed grayscale' : ''}`}
          value={value}
          onChange={(e) => !disabled && onChange(e.target.value)}
        />
      </div>
    </div>
  );
}

function ModernRequestInput({ label, type = "text", placeholder, value, onChange, icon: Icon = null, disabled = false }) {
  return (
    <div className="space-y-3 flex-grow">
      <label className="text-[10px] font-black uppercase text-white/80 tracking-[0.2em] ml-1">{label}</label>
      <div className="relative group">
        {Icon && <Icon className="absolute left-7 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-white/20 group-focus-within:text-red-500 transition-all z-10" />}
        <input
          type={type}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full bg-[#121212] border border-white/10 rounded-lg ${Icon ? 'pl-16' : 'px-8'} py-5 text-sm focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/20 transition-all text-white placeholder:text-white/60 shadow-2xl shadow-inner scrollbar-hide ${disabled ? 'opacity-40 cursor-not-allowed grayscale' : ''}`}
          value={value}
          onChange={(e) => !disabled && onChange(e.target.value)}
        />
      </div>
    </div>
  );
}