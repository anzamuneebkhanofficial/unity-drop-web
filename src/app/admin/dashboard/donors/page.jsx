
'use client';

import { useEffect, useState } from 'react';
import { useAdminAuthStore } from '@/store/auth/authAdminStore';
import Pagination from '@/components/common/Pagination';
import {
  Users,
  Search,
  MapPin,
  Droplets,
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
  Map,
  CheckCircle,
  XCircle
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
export default function DonorList() {
  const {
    getDonors,
    getDonorById,
    deleteDonorById,
    tableLoading,
    AdminCaught,
  } = useAdminAuthStore();

  const [mounted, setMounted] = useState(false);
  const canDelete = AdminCaught?.isSuperAdmin === true || AdminCaught?.canDelete === true;

  const [donors, setDonors] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const [bloodGroup, setBloodGroup] = useState('');
  const [location, setLocation] = useState('');
  const [name, setName] = useState('');

  const [selectedDonor, setSelectedDonor] = useState(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchDonors = async (page = 1) => {
    const filters = {};
    if (bloodGroup) filters.bloodGroup = bloodGroup;
    if (location) filters.location = location;
    if (name) filters.name = name;

    const data = await getDonors(page, 10, filters);
    if (data) {
      setDonors(data.donors);
      setPageCount(data.totalPages);
      setCurrentPage(data.currentPage);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (name && name.length < 2 && name !== '') return;
      fetchDonors(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [bloodGroup, location, name]);

  const handleView = async (id) => {
    const donor = await getDonorById(id);
    if (donor) {
      setSelectedDonor(donor);
      setIsViewOpen(true);
    }
  };

  const openDeleteModal = (donor) => {
    setDeleteTarget({ id: donor._id, name: donor.fullName });
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const ok = await deleteDonorById(deleteTarget.id);
      if (ok) {
        if (selectedDonor?._id === deleteTarget.id) {
          setIsViewOpen(false);
          setSelectedDonor(null);
        }
        fetchDonors(currentPage);
      }
    } finally {
      setDeleting(false);
      setIsDeleteModalOpen(false);
      setDeleteTarget(null);
    }
  };

  if (!mounted) return null;

  return (
    <>
      <div className="p-4 sm:p-8 space-y-8 animate-in fade-in duration-700">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-surface border border-white/5 p-8 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="h-3 w-3 rounded-full bg-donor/80 animate-pulse shadow-[0_0_15px_rgba(var(--donor-hex),0.5)]"></div>
              <h1 className="text-3xl font-black tracking-tighter text-white uppercase italic">All Donors</h1>
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
              <Users className="text-white w-7 h-7" />
            </div>
          </div>
        </div>
        <section className="bg-[#0f0f0f]/60 backdrop-blur-xl border border-white/10 p-8 rounded-xl space-y-8 shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ModernInput id="search-name" label="Search by Name" placeholder="Type donor name..." value={name} onChange={setName} icon={Search} />
            <div className="space-y-2">
              <label htmlFor="filter-blood" className="text-[10px] font-black uppercase text-white/80 tracking-[0.2em] ml-1 cursor-pointer">Blood Group</label>
              <div className="relative group">
                <select
                  id="filter-blood"
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
            <ModernInput id="search-city" label="Search by City" placeholder="Type city or area..." value={location} onChange={setLocation} icon={MapPin} />
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
                  <th className="px-8 py-6 text-[10px] font-black text-text-dim uppercase tracking-[0.3em] text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.03]">
                {tableLoading ? (
                  <tr>
                    <td colSpan={4} className="py-24 text-center">
                      <MiniSpinner size={40} className="text-donor mx-auto" />
                    </td>
                  </tr>
                ) : donors.length > 0 ? (
                  donors.map((donor, idx) => (
                    <tr
                      key={donor._id}
                      style={{ animationDelay: `${idx * 50}ms` }}
                      className="group hover:bg-white/[0.02] transition-colors animate-fade-up opacity-0"
                    >
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-xl bg-neutral-900 border border-white/5 flex items-center justify-center font-black text-donor text-sm group-hover:scale-110 transition-transform">
                            {donor.fullName.charAt(0)}
                          </div>
                          <span className="text-sm font-black text-white uppercase tracking-tight">{donor.fullName}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <div className="px-3 py-1 bg-donor/10 border border-donor/20 rounded-full w-fit text-[10px] font-black text-donor">
                          {donor.bloodGroup}
                        </div>
                      </td>
                      <td className="px-8 py-5 text-xs font-bold uppercase tracking-tighter text-text-muted break-words whitespace-normal max-w-[220px] min-w-[150px]">
                        {donor.location}
                      </td>
                      <td className="px-8 py-5 text-center flex justify-center gap-2">
                        <button onClick={() => handleView(donor._id)} className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-500 hover:bg-blue-500 hover:text-black transition-all">
                          <Eye className="w-4 h-4" />
                        </button>
                        {canDelete && (
                          <button onClick={() => openDeleteModal(donor)} className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-all">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-24 text-center text-gray-500 text-[10px] uppercase font-black">No donors found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <Pagination pageCount={pageCount} currentPage={currentPage} onPageChange={(page) => fetchDonors(page)} />
      </div>
      <Dialog open={isViewOpen} onOpenChange={(val) => { if (!val) setSelectedDonor(null); setIsViewOpen(val); }}>
        <DialogContent showCloseButton={false} className="max-w-5xl bg-surface/95 backdrop-blur-2xl border border-white/10 rounded-[3rem] p-0 overflow-hidden outline-none">
          <div className="relative max-h-[85vh] overflow-y-auto custom-scrollbar p-14">
            <DialogClose className="absolute right-8 top-8 p-3 bg-white/5 hover:bg-donor hover:text-black rounded-2xl transition-all border border-white/10 z-50">
              <X className="w-5 h-5" />
            </DialogClose>
            {selectedDonor && (
              <div className="space-y-10">
                <div className="flex items-center gap-6">
                  <div className="h-24 w-24 rounded-[2rem] bg-gradient-to-br from-red-600 to-orange-600 flex items-center justify-center shadow-2xl">
                    <User className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-white uppercase tracking-tighter">{selectedDonor.fullName}</h2>
                    <p className="text-donor font-black text-xs uppercase tracking-[0.2em]">Verified Donor</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 p-10 bg-white/[0.02] border border-white/5 rounded-[2rem]">
                  <InfoDetailBox icon={Droplets} label="Blood Group" value={selectedDonor.bloodGroup} color="text-donor" />
                  <InfoDetailBox icon={User} label="Gender" value={selectedDonor.gender} />
                  <InfoDetailBox icon={Mail} label="Email" value={selectedDonor.email} />
                  <InfoDetailBox
                    icon={selectedDonor?.emailVerified ? CheckCircle : XCircle}
                    label="Email Status"
                    value={selectedDonor?.emailVerified ? 'Verified' : 'Unverified'}
                    color={selectedDonor?.emailVerified ? 'text-green-400 font-bold' : 'text-highlight font-bold'}
                  />
                  <InfoDetailBox icon={Phone} label="Phone" value={selectedDonor.phone} />
                  <InfoDetailBox icon={MapPin} label="Location / City" value={selectedDonor.location} />
                  <InfoDetailBox icon={Clock} label="Registered On" value={fmtDate(selectedDonor.createdAt)} />
                  <InfoDetailBox icon={Map} label="Full Address" value={selectedDonor.address} span={3} />
                  <InfoDetailBox icon={Activity} label="Last Updated" value={fmtDate(selectedDonor.updatedAt)} span={3} />
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
        roleName={`Donor "${deleteTarget?.name || ''}"`}
        description="Permanently delete this donor account. This action cannot be reversed."
      />
    </>
  );
}