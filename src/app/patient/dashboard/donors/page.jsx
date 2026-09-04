
'use client';

import { useEffect, useState } from 'react';
import Pagination from '@/components/common/Pagination';
import {
  Dialog,
  DialogContent,
  DialogClose,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { usePatientAuthStore } from '@/store/auth/authPatientStore';
import { GenericSpinner as MiniSpinner } from '@/components/ui/Skeletons';
import { Mail, MapPin, User, Activity, Droplets, Phone, ShieldAlert, X, ClipboardCheck, ShieldCheck, HeartPulse, Search, CheckCircle2, XCircle, Clock, ChevronUp, ChevronDown } from 'lucide-react';
import InfoDetailBox from '@/components/common/InfoDetailBox';
import { fmtDate } from '@/lib/fmtDate';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const requestSchema = yup.object().shape({
  caseDescription: yup.string().trim().required('Reason for blood is required'),
  patientAge: yup.number()
    .transform((value, originalValue) => (originalValue === '' || originalValue === null || originalValue === undefined) ? undefined : Number(originalValue))
    .typeError('Patient age must be an integer')
    .integer('Patient age must be an integer')
    .min(1, 'Patient age must be between 1 and 120')
    .max(120, 'Patient age must be between 1 and 120')
    .required('Patient age is required'),
  bottlesRequired: yup.number()
    .transform((value, originalValue) => (originalValue === '' || originalValue === null || originalValue === undefined) ? undefined : Number(originalValue))
    .typeError('Bottles required must be an integer')
    .integer('Bottles required must be an integer')
    .min(1, 'Bottles required must be between 1 and 20')
    .max(20, 'Bottles required must be between 1 and 20')
    .required('Bottles required is required'),
  hospitalName: yup.string().trim().required('Hospital name is required').min(2, 'Hospital name must be at least 2 characters'),
  city: yup.string().trim().required('City is required').min(2, 'City must be at least 2 characters'),
  attendantName: yup.string()
    .trim()
    .required('Attendant name is required')
    .min(2, 'Attendant name must be at least 2 characters')
    .max(50, 'Attendant name must not exceed 50 characters')
    .matches(/^[a-zA-Z\s]+$/, 'Attendant name must contain only alphabets and spaces'),
  attendantPhone: yup.string()
    .trim()
    .required('Attendant phone is required')
    .matches(/^(\+?[0-9]{10,15})$/, 'Attendant phone must contain between 10 and 15 digits only'),
  pickAndDrop: yup.string().required('Pick & Drop choice is required'),
  exchangePossibility: yup.string().required('Exchange choice is required'),
  message: yup.string()
    .trim()
    .required('Message is required')
    .min(10, 'Message must be at least 10 characters long'),
});
function ModernInput({ id, label, type = "text", placeholder, value, onChange, icon: Icon = null, disabled = false }) {
  return (
    <div className="space-y-3 flex-grow">
      <label htmlFor={id} className="text-[10px] font-black uppercase text-white/80 tracking-[0.2em] ml-1 cursor-pointer">{label}</label>
      <div className="relative group">
        {Icon && <Icon className="absolute left-6 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-white/20 group-focus-within:text-red-500 transition-all" />}
        <input
          id={id}
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

function ModernRequestInput({
  id,
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  onKeyDown,
  onPaste,
  icon: Icon = null,
  disabled = false,
  inputMode,
  maxLength,
  showStepper = false,
  onIncrement,
  onDecrement,
  className = "",
  ...rest
}) {
  return (
    <div className="space-y-3 flex-grow">
      <label htmlFor={id} className="text-[10px] font-black uppercase text-white/80 tracking-[0.2em] ml-1 cursor-pointer">{label}</label>
      <div className="relative group">
        {Icon && <Icon className="absolute left-7 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-white/20 group-focus-within:text-red-500 transition-all z-10 pointer-events-none" />}
        <input
          id={id}
          type={type}
          inputMode={inputMode}
          placeholder={placeholder}
          disabled={disabled}
          maxLength={maxLength}
          className={`w-full bg-[#121212] border border-white/10 rounded-lg ${Icon ? 'pl-16' : 'px-8'} ${showStepper ? 'pr-12' : ''} py-5 text-sm focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/20 transition-all text-white placeholder:text-white/60 shadow-2xl shadow-inner scrollbar-hide ${disabled ? 'opacity-40 cursor-not-allowed grayscale' : ''} ${className}`}
          value={value ?? ''}
          onChange={(e) => !disabled && onChange && onChange(e.target.value)}
          onKeyDown={(e) => !disabled && onKeyDown && onKeyDown(e)}
          onPaste={(e) => !disabled && onPaste && onPaste(e)}
          {...rest}
        />
        {showStepper && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col items-center justify-center gap-0.5 z-10">
            <button
              type="button"
              tabIndex={-1}
              onClick={onIncrement}
              disabled={disabled}
              className="p-1 rounded text-white/40 hover:text-white hover:bg-white/10 active:scale-90 transition-all cursor-pointer disabled:opacity-20"
              title="Increase"
            >
              <ChevronUp className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              tabIndex={-1}
              onClick={onDecrement}
              disabled={disabled}
              className="p-1 rounded text-white/40 hover:text-white hover:bg-white/10 active:scale-90 transition-all cursor-pointer disabled:opacity-20"
              title="Decrease"
            >
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
export default function PatientDonorsList() {
  const {
    donors,
    totalPages,
    currentPage,
    totalResults,
    loading,
    fetchDonors,
    fetchDonorById,
    setFilters,
    filters,
    sendBloodRequest,
  } = usePatientAuthStore();

  const [selectedDonor, setSelectedDonor] = useState(null);
  const [donorStatus, setDonorStatus] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [viewLoading, setViewLoading] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(requestSchema),
    defaultValues: {
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
    },
  });

  const formMessage = watch('message');

  const handleDialogChange = (isOpen) => {
    setIsDialogOpen(isOpen);
    if (!isOpen) {
      reset({
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

  const [name, setName] = useState(filters.name || '');
  const [bloodGroup, setBloodGroup] = useState(filters.bloodGroup || '');
  const [location, setLocation] = useState(filters.location || '');
  const [limit, setLimit] = useState(5);

  // Fetch Mount
  useEffect(() => {
    fetchDonors(1, limit);
  }, []);
  // Debounced Search Logic
  useEffect(() => {
    const timer = setTimeout(() => {
      if (name && name.length < 2 && name !== '') return;

      setFilters({ name, bloodGroup, location });
      fetchDonors(1, limit);
    }, 500);
    return () => clearTimeout(timer);
  }, [name, bloodGroup, location, limit, fetchDonors, setFilters]);
  const handleView = async (id) => {
    try {
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
  const onSubmit = async (data) => {
    if (donorStatus === 'Pending' || donorStatus === 'Approved') {
      return toast.warning(`Action not allowed: Current status is ${donorStatus}`);
    }

    const payload = {
      ...data,
      patientAge: Number(data.patientAge),
      bottlesRequired: Number(data.bottlesRequired),
    };

    const request = await sendBloodRequest(selectedDonor._id, payload);

    if (request) {
      setDonorStatus('Pending');
      reset({
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
    }
  };

  return (
    <div className="p-4 sm:p-8 space-y-8 animate-in fade-in duration-700">
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
      <section className="bg-[#0f0f0f]/60 backdrop-blur-xl border border-white/10 p-8 rounded-xl space-y-8 shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <ModernInput
            id="search-name"
            label="Search by Name"
            placeholder="Donor name..."
            value={name}
            onChange={setName}
            icon={Search}
          />
          <div className="space-y-2">
            <label htmlFor="filter-blood" className="text-[10px] font-black uppercase text-white/80 tracking-[.25em] ml-1 cursor-pointer">Blood Group</label>
            <div className="relative group">
              <select
                id="filter-blood"
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
            id="search-city"
            label="Search by City"
            placeholder="City/Region..."
            value={location}
            onChange={setLocation}
            icon={MapPin}
          />
          <div className="space-y-2">
            <label htmlFor="filter-limit" className="text-[10px] font-black uppercase text-white/80 tracking-[.25em] ml-1 cursor-pointer">Show Per Page</label>
            <div className="relative group">
              <select
                id="filter-limit"
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
            <span>{loading ? 'Searching donors...' : `Found ${totalResults || 0} donors matching criteria`}</span>
          </div>
        </div>
      </section>
      <div className="relative bg-[#0c0c0c] border border-white/5 rounded-xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-[#1a1a1a] text-gray-400">
              <tr>
                <th className="p-4 text-left font-bold uppercase tracking-widest text-[10px]">Donor</th>
                <th className="p-4 text-left font-bold uppercase tracking-widest text-[10px]">Blood Group</th>
                <th className="p-4 text-left font-bold uppercase tracking-widest text-[10px]">Location</th>
                <th className="p-4 text-left font-bold uppercase tracking-widest text-[10px]">Availability</th>
                <th className="p-4 text-center font-bold uppercase tracking-widest text-[10px]">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 relative">
              {donors.length === 0 && loading ? (
                <tr>
                  <td colSpan={5} className="p-24 text-center">
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
                        <div className="flex items-center gap-2 text-gray-400 group-hover:text-gray-300 transition-colors max-w-[220px]">
                          <div className="h-6 w-6 rounded-md bg-neutral-900 flex items-center justify-center border border-white/5 shrink-0">
                            <MapPin className="w-3 h-3 text-donor/50" />
                          </div>
                          <span className="text-xs font-bold uppercase tracking-tighter break-words whitespace-normal leading-relaxed">{d.location}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        {d.availabilityStatus ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-green-500/10 border border-green-500/20 text-green-400">
                            <CheckCircle2 className="w-3 h-3" /> Available
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-gray-500/10 border border-gray-500/20 text-gray-400">
                            <XCircle className="w-3 h-3" /> Unavailable
                          </span>
                        )}
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
                  <td colSpan={5} className="p-20 text-center">
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
        {loading && donors.length > 0 && (
          <div className="absolute inset-0 bg-black/5 flex items-center justify-center pointer-events-none z-20">
            <div className="bg-black/80 backdrop-blur-md px-6 py-3 rounded-full border border-white/10 flex items-center gap-3 shadow-2xl">
              <MiniSpinner size={16} className="text-donor/80" />
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Updating...</span>
            </div>
          </div>
        )}
      </div>
      <div className="mt-8 flex justify-center">
        <Pagination
          pageCount={totalPages}
          currentPage={currentPage}
          onPageChange={(page) => fetchDonors(page, limit)}
        />
      </div>
      <Dialog open={isDialogOpen} onOpenChange={handleDialogChange}>
        <DialogContent
          showCloseButton={false}
          className="sm:max-w-4xl lg:max-w-[calc(100vw-320px)] xl:max-w-5xl lg:left-[calc(50%+140px)] bg-[#0f0f0f]/95 backdrop-blur-2xl border border-white/10 rounded-xl shadow-[0_0_100px_rgba(0,0,0,1)] p-0 overflow-hidden outline-none border-none"
        >
          <div className="relative max-h-[85vh] overflow-y-auto custom-scrollbar p-8 md:p-14">
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-10 bg-white/[0.02] border border-white/5 rounded-[2rem]">
                  <InfoDetailBox variant="dashboard" icon={Droplets} label="Blood Group" value={selectedDonor?.bloodGroup} color="text-donor" />
                  <InfoDetailBox variant="dashboard" icon={User} label="Gender" value={selectedDonor?.gender} />
                  <InfoDetailBox variant="dashboard" icon={Mail} label="Email" value={selectedDonor?.email} sensitive={donorStatus !== 'Approved'} />
                  <InfoDetailBox
                    variant="dashboard"
                    icon={selectedDonor?.emailVerified ? ClipboardCheck : ShieldAlert}
                    label="Email Status"
                    value={selectedDonor?.emailVerified ? 'Verified' : 'Unverified'}
                    color={selectedDonor?.emailVerified ? 'text-green-400 font-bold' : 'text-donor font-bold'}
                  />
                  <InfoDetailBox variant="dashboard" icon={Phone} label="Phone" value={selectedDonor?.phone} sensitive={donorStatus !== 'Approved'} />
                  <InfoDetailBox variant="dashboard" icon={MapPin} label="City" value={selectedDonor?.location} span={1} />
                  <InfoDetailBox variant="dashboard" icon={Clock} label="Account Created" value={fmtDate(selectedDonor?.createdAt)} />
                  <InfoDetailBox
                    variant="dashboard"
                    icon={selectedDonor?.availabilityStatus ? CheckCircle2 : XCircle}
                    label="Availability Status"
                    value={selectedDonor?.availabilityStatus ? 'Available' : 'Unavailable'}
                    color={selectedDonor?.availabilityStatus ? 'text-green-400 font-bold' : 'text-gray-400 font-bold'}
                  />
                  <InfoDetailBox variant="dashboard" icon={Activity} label="Last Updated" value={fmtDate(selectedDonor?.updatedAt)} span={3} />
                </div>
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
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Controller
                            name="caseDescription"
                            control={control}
                            render={({ field }) => (
                              <ModernRequestInput
                                id="req-reason"
                                label="Reason for Blood"
                                placeholder="Medical case / surgery reason..."
                                value={field.value}
                                onChange={field.onChange}
                                disabled={loading}
                              />
                            )}
                          />
                          {errors.caseDescription && <p className="text-donor text-xs font-semibold mt-2">{errors.caseDescription.message}</p>}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Controller
                              name="patientAge"
                              control={control}
                              render={({ field }) => {
                                const handleInc = () => {
                                  const curr = parseInt(field.value, 10);
                                  const next = isNaN(curr) ? 1 : Math.min(120, curr + 1);
                                  field.onChange(String(next));
                                };
                                const handleDec = () => {
                                  const curr = parseInt(field.value, 10);
                                  const next = isNaN(curr) ? 1 : Math.max(1, curr - 1);
                                  field.onChange(String(next));
                                };
                                return (
                                  <ModernRequestInput
                                    id="req-age"
                                    label="Patient Age"
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={3}
                                    placeholder="Years (1-120)"
                                    value={field.value}
                                    showStepper={true}
                                    onIncrement={handleInc}
                                    onDecrement={handleDec}
                                    onKeyDown={(e) => {
                                      if (
                                        ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight'].includes(e.key) ||
                                        ((e.ctrlKey || e.metaKey) && ['a', 'c', 'v', 'x', 'z'].includes(e.key.toLowerCase()))
                                      ) {
                                        return;
                                      }
                                      if (e.key === 'ArrowUp') {
                                        e.preventDefault();
                                        handleInc();
                                        return;
                                      }
                                      if (e.key === 'ArrowDown') {
                                        e.preventDefault();
                                        handleDec();
                                        return;
                                      }
                                      if (!/^\d$/.test(e.key)) {
                                        e.preventDefault();
                                      }
                                    }}
                                    onChange={(val) => {
                                      const sanitized = val.replace(/\D/g, '').slice(0, 3);
                                      field.onChange(sanitized);
                                    }}
                                    onPaste={(e) => {
                                      e.preventDefault();
                                      const pasted = e.clipboardData.getData('text');
                                      const sanitized = pasted.replace(/\D/g, '').slice(0, 3);
                                      field.onChange(sanitized);
                                    }}
                                    disabled={loading}
                                  />
                                );
                              }}
                            />
                            {errors.patientAge && <p className="text-donor text-xs font-semibold mt-2">{errors.patientAge.message}</p>}
                          </div>
                          <div>
                            <Controller
                              name="bottlesRequired"
                              control={control}
                              render={({ field }) => {
                                const handleInc = () => {
                                  const curr = parseInt(field.value, 10);
                                  const next = isNaN(curr) ? 1 : Math.min(20, curr + 1);
                                  field.onChange(String(next));
                                };
                                const handleDec = () => {
                                  const curr = parseInt(field.value, 10);
                                  const next = isNaN(curr) ? 1 : Math.max(1, curr - 1);
                                  field.onChange(String(next));
                                };
                                return (
                                  <ModernRequestInput
                                    id="req-bottles"
                                    label="Bottles Needed"
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={2}
                                    placeholder="Bottles (1-20)"
                                    value={field.value}
                                    showStepper={true}
                                    onIncrement={handleInc}
                                    onDecrement={handleDec}
                                    onKeyDown={(e) => {
                                      if (
                                        ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight'].includes(e.key) ||
                                        ((e.ctrlKey || e.metaKey) && ['a', 'c', 'v', 'x', 'z'].includes(e.key.toLowerCase()))
                                      ) {
                                        return;
                                      }
                                      if (e.key === 'ArrowUp') {
                                        e.preventDefault();
                                        handleInc();
                                        return;
                                      }
                                      if (e.key === 'ArrowDown') {
                                        e.preventDefault();
                                        handleDec();
                                        return;
                                      }
                                      if (!/^\d$/.test(e.key)) {
                                        e.preventDefault();
                                      }
                                    }}
                                    onChange={(val) => {
                                      const sanitized = val.replace(/\D/g, '').slice(0, 2);
                                      field.onChange(sanitized);
                                    }}
                                    onPaste={(e) => {
                                      e.preventDefault();
                                      const pasted = e.clipboardData.getData('text');
                                      const sanitized = pasted.replace(/\D/g, '').slice(0, 2);
                                      field.onChange(sanitized);
                                    }}
                                    disabled={loading}
                                  />
                                );
                              }}
                            />
                            {errors.bottlesRequired && <p className="text-donor text-xs font-semibold mt-2">{errors.bottlesRequired.message}</p>}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Controller
                            name="hospitalName"
                            control={control}
                            render={({ field }) => (
                              <ModernRequestInput
                                id="req-hospital"
                                label="Hospital Name"
                                placeholder="Hospital / Clinic name"
                                value={field.value}
                                onChange={field.onChange}
                                icon={ShieldCheck}
                                disabled={loading}
                              />
                            )}
                          />
                          {errors.hospitalName && <p className="text-donor text-xs font-semibold mt-2">{errors.hospitalName.message}</p>}
                        </div>
                        <div>
                          <Controller
                            name="city"
                            control={control}
                            render={({ field }) => (
                              <ModernRequestInput
                                id="req-city"
                                label="City"
                                placeholder="City / Area"
                                value={field.value}
                                onChange={field.onChange}
                                icon={MapPin}
                                disabled={loading}
                              />
                            )}
                          />
                          {errors.city && <p className="text-donor text-xs font-semibold mt-2">{errors.city.message}</p>}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Controller
                            name="attendantName"
                            control={control}
                            render={({ field }) => (
                              <ModernRequestInput
                                id="req-attendant"
                                label="Attendant Name"
                                type="text"
                                inputMode="text"
                                maxLength={50}
                                placeholder="Guardian / Attendant name"
                                value={field.value}
                                onChange={(val) => {
                                  const sanitized = val.replace(/[^a-zA-Z\s]/g, '').slice(0, 50);
                                  field.onChange(sanitized);
                                }}
                                onKeyDown={(e) => {
                                  if (
                                    ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key) ||
                                    ((e.ctrlKey || e.metaKey) && ['a', 'c', 'v', 'x', 'z'].includes(e.key.toLowerCase()))
                                  ) {
                                    return;
                                  }
                                  // Block numbers strictly
                                  if (/^\d$/.test(e.key)) {
                                    e.preventDefault();
                                    return;
                                  }
                                  // Only allow alphabetic characters
                                  if (!/^[a-zA-Z]$/.test(e.key)) {
                                    e.preventDefault();
                                  }
                                }}
                                onPaste={(e) => {
                                  e.preventDefault();
                                  const pasted = e.clipboardData.getData('text');
                                  const sanitized = pasted.replace(/[^a-zA-Z\s]/g, '').slice(0, 50);
                                  field.onChange(sanitized);
                                }}
                                icon={User}
                                disabled={loading}
                              />
                            )}
                          />
                          {errors.attendantName && <p className="text-donor text-xs font-semibold mt-2">{errors.attendantName.message}</p>}
                        </div>
                        <div>
                          <Controller
                            name="attendantPhone"
                            control={control}
                            render={({ field }) => (
                              <ModernRequestInput
                                id="req-phone"
                                label="Attendant Phone"
                                type="tel"
                                inputMode="tel"
                                maxLength={16}
                                placeholder="+923001234567 or 03001234567"
                                value={field.value}
                                onChange={(val) => {
                                  let sanitized = val.replace(/[^\d+]/g, '');
                                  if (sanitized.startsWith('+')) {
                                    sanitized = '+' + sanitized.slice(1).replace(/\+/g, '');
                                  } else {
                                    sanitized = sanitized.replace(/\+/g, '');
                                  }
                                  field.onChange(sanitized.slice(0, 16));
                                }}
                                onKeyDown={(e) => {
                                  if (
                                    ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight'].includes(e.key) ||
                                    ((e.ctrlKey || e.metaKey) && ['a', 'c', 'v', 'x', 'z'].includes(e.key.toLowerCase()))
                                  ) {
                                    return;
                                  }
                                  // Allow '+' only at position 0 if not already present
                                  if (e.key === '+') {
                                    const input = e.target;
                                    if (input.selectionStart === 0 && !input.value.includes('+')) {
                                      return;
                                    }
                                    e.preventDefault();
                                    return;
                                  }
                                  // Block letters and non-digits
                                  if (!/^\d$/.test(e.key)) {
                                    e.preventDefault();
                                  }
                                }}
                                onPaste={(e) => {
                                  e.preventDefault();
                                  const pasted = e.clipboardData.getData('text');
                                  let sanitized = pasted.replace(/[^\d+]/g, '');
                                  if (sanitized.startsWith('+')) {
                                    sanitized = '+' + sanitized.slice(1).replace(/\+/g, '');
                                  } else {
                                    sanitized = sanitized.replace(/\+/g, '');
                                  }
                                  field.onChange(sanitized.slice(0, 16));
                                }}
                                icon={Phone}
                                disabled={loading}
                              />
                            )}
                          />
                          {errors.attendantPhone && <p className="text-donor text-xs font-semibold mt-2">{errors.attendantPhone.message}</p>}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Controller
                          name="pickAndDrop"
                          control={control}
                          render={({ field }) => (
                            <div className="space-y-3">
                              <label htmlFor="req-pickup" className="text-[10px] font-black uppercase text-white/60 tracking-[.2em] ml-1 cursor-pointer">Pick & Drop Available?</label>
                              <select
                                id="req-pickup"
                                className="w-full bg-[#121212] border border-white/10 rounded-lg px-6 py-5 text-sm focus:outline-none focus:border-red-500/50 transition-all text-white appearance-none cursor-pointer shadow-xl"
                                {...field}
                                disabled={loading}
                              >
                                <option value="No">No</option>
                                <option value="Yes">Yes</option>
                              </select>
                            </div>
                          )}
                        />
                        <Controller
                          name="exchangePossibility"
                          control={control}
                          render={({ field }) => (
                            <div className="space-y-3">
                              <label htmlFor="req-exchange" className="text-[10px] font-black uppercase text-white/60 tracking-[.2em] ml-1 cursor-pointer">Blood Exchange Possible?</label>
                              <select
                                id="req-exchange"
                                className="w-full bg-[#121212] border border-white/10 rounded-lg px-6 py-5 text-sm focus:outline-none focus:border-red-500/50 transition-all text-white appearance-none cursor-pointer shadow-xl"
                                {...field}
                                disabled={loading}
                              >
                                <option value="No">No</option>
                                <option value="Yes">Yes</option>
                              </select>
                            </div>
                          )}
                        />
                      </div>

                      <div className="space-y-3">
                        <Controller
                          name="message"
                          control={control}
                          render={({ field }) => (
                            <div className="space-y-3">
                              <label htmlFor="req-msg" className="text-[10px] font-black uppercase text-white/60 tracking-[.2em] ml-1 cursor-pointer">Your Message</label>
                              <textarea
                                id="req-msg"
                                className="w-full bg-[#121212] border border-white/10 rounded-xl px-8 py-7 text-sm focus:outline-none focus:border-red-500/50 transition-all text-white min-h-[160px] resize-none placeholder:text-white/40 shadow-2xl"
                                placeholder="Describe your situation and why you need blood..."
                                {...field}
                                disabled={loading}
                              />
                            </div>
                          )}
                        />
                        {errors.message && <p className="text-donor text-xs font-semibold mt-2">{errors.message.message}</p>}
                      </div>

                      <button
                        type="submit"
                        disabled={!formMessage || !formMessage.trim() || loading}
                        className="w-full py-7 rounded-lg bg-gradient-to-br from-red-600 via-red-500 to-orange-600 text-white font-black uppercase tracking-[0.4em] shadow-[0_20px_60px_rgba(220,38,38,0.4)] hover:shadow-[0_25px_80px_rgba(220,38,38,0.6)] hover:scale-[1.01] active:scale-[0.98] transition-all disabled:opacity-30 disabled:grayscale disabled:scale-100 italic border border-white/20"
                      >
                        {loading ? <MiniSpinner size={24} className="mx-auto" /> :
                          donorStatus === 'Rejected' ? 'Send Request Again' :
                            'Send Blood Request'}
                      </button>
                    </form>
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