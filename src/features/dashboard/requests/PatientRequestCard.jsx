import React, { useState } from 'react';
import { Mail, User, MessageSquare, Calendar, Activity, Droplets, Home, MapPin, Truck, Repeat, ClipboardList, UserCheck } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { fmtDate } from '@/lib/fmtDate';

const STATUS_STYLE = {
  Approved: 'text-green-400 bg-green-500/10 border-green-500/20 shadow-[0_0_15px_rgba(34,197,94,0.1)]',
  Rejected: 'text-donor bg-donor/10 border-donor/20 shadow-[0_0_15px_rgba(231,77,42,0.1)]',
  Pending: 'text-highlight bg-highlight/10 border-highlight/20 animate-pulse',
};

function InfoRow({ icon: Icon, label, value, color = 'text-gray-300', isFullWidth = false, className = '' }) {
  if (!value) return null;
  return (
    <div className={`flex items-center justify-between group/row py-1 transition-all gap-3 min-w-0 ${className}`}>
      <div className="flex items-center gap-2 shrink-0">
        <Icon className="h-3.5 w-3.5 text-gray-600 group-hover/row:text-donor transition-colors shrink-0" />
        <span className="text-[10px] font-black uppercase text-gray-600 tracking-widest whitespace-nowrap">{label}</span>
      </div>
      <span
        className={`${color} text-xs font-bold tracking-tight text-right ${isFullWidth ? 'whitespace-nowrap shrink-0' : 'truncate max-w-[140px]'}`}
        title={typeof value === 'string' ? value : undefined}
      >
        {value}
      </span>
    </div>
  );
}

export default function PatientRequestCard({ request, onUpdateStatus }) {
  const [activeFullText, setActiveFullText] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const {
    _id,
    status = 'Pending',
    patientAge,
    bottlesRequired,
    hospitalName,
    city,
    pickAndDrop = 'No',
    exchangePossibility = 'No',
    caseDescription,
    message,
    attendantName,
    attendantPhone,
    createdAt,
    patientId,
  } = request || {};

  const patientName = patientId?.fullName || 'Anonymous Patient';
  const rawEmail = patientId?.email || '';

  const handleStatusChange = async (newStatus) => {
    try {
      setActionLoading(true);
      await onUpdateStatus(_id, newStatus);
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  // Helper to email if not approved
  const getObscuredEmail = (email) => {
    if (!email) return 'no-email@unitydrop.com';
    if (status === 'Approved') return email;
    const [local, domain] = email.split('@');
    if (!domain) return '••••••••';
    return `••••••••@••••.${domain.split('.').pop().toUpperCase()}`;
  };

  // Format date
  const formattedDate = fmtDate(createdAt) || 'N/A';

  const hasLongCase = caseDescription && caseDescription.length > 120;
  const hasLongMessage = message && message.length > 120;

  return (
    <>
      <div className="relative border border-white/5 bg-[#0a0a0a]/90 backdrop-blur-md rounded-2xl p-6 transition-all duration-300 hover:border-white/10 hover:shadow-2xl flex flex-col justify-between h-full group before:absolute before:inset-x-0 before:top-0 before:h-[2px] before:bg-gradient-to-r before:from-donor/30 before:via-highlight/20 before:to-transparent">

        <div className="space-y-5">

          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-white/[0.02] border border-white/10 flex items-center justify-center relative overflow-hidden group-hover:border-donor/40 transition-colors duration-300">
                <User className="h-6 w-6 text-donor/80 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <div>
                <h3 className="text-white text-base font-black uppercase italic tracking-wide">
                  {patientName}
                </h3>
                <div className="flex items-center gap-1.5 mt-0.5 text-gray-500">
                  <Mail className="h-3 w-3" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">
                    {getObscuredEmail(rawEmail)}
                  </span>
                </div>
              </div>
            </div>

            <div
              className={`px-3 py-1 rounded-lg border text-[10px] font-black uppercase tracking-widest ${STATUS_STYLE[status] || STATUS_STYLE.Pending
                }`}
            >
              {status}
            </div>
          </div>


          <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-5 space-y-4 relative overflow-hidden">

            <div className="grid grid-cols-2 gap-x-6 gap-y-3.5">
              <InfoRow icon={Activity} label="Patient Age" value={patientAge ? `${patientAge} Years` : 'N/A'} color="text-white" />
              <InfoRow icon={Droplets} label="Bottles Needed" value={bottlesRequired} color="text-white font-black" />
              <div className="col-span-2 py-1.5 border-y border-white/5">
                <InfoRow icon={Calendar} label="Needed On" value={formattedDate} color="text-white" isFullWidth={true} />
              </div>
              <InfoRow icon={MapPin} label="City" value={city} color="text-white" />
              <InfoRow
                icon={Truck}
                label="Pick & Drop"
                value={pickAndDrop}
                color={pickAndDrop === 'Yes' ? 'text-green-400 font-bold' : 'text-gray-400'}
              />
              <InfoRow
                icon={Repeat}
                label="Exchange"
                value={exchangePossibility}
                color={exchangePossibility === 'Yes' ? 'text-green-400 font-bold' : 'text-gray-400'}
              />
            </div>


            <div className="pt-3 border-t border-white/5 flex flex-col gap-1.5">
              <div className="flex items-center gap-2 text-gray-600">
                <Home className="h-3.5 w-3.5 text-gray-600 group-hover:text-donor transition-colors duration-300" />
                <span className="text-[10px] font-black uppercase tracking-widest">Hospital</span>
              </div>
              <div className="text-xs font-bold text-white pl-5.5 leading-relaxed break-words bg-white/[0.02] border border-white/5 px-3 py-2 rounded-lg">
                {hospitalName || 'Not Specified'}
              </div>
            </div>
          </div>


          <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-5 space-y-3.5">
            <div className="flex items-center gap-2 text-gray-500 font-bold text-[10px] uppercase tracking-widest">
              <UserCheck className="h-3.5 w-3.5 text-gray-500" /> Attendant Details
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                <span className="text-[9px] font-black uppercase text-gray-600 tracking-widest mb-0.5">Name</span>
                <span className="text-white font-bold text-xs truncate">
                  {attendantName || 'N/A'}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] font-black uppercase text-gray-600 tracking-widest mb-0.5">Contact</span>
                {status === 'Approved' ? (
                  <span className="text-white font-bold text-xs tracking-wide">
                    {attendantPhone}
                  </span>
                ) : (
                  <span className="text-gray-500 italic text-xs font-semibold tracking-wide flex items-center gap-1">
                    encrypted
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-gray-500 font-bold text-[10px] uppercase tracking-widest">
              <div className="flex items-center gap-2">
                <ClipboardList className="h-3.5 w-3.5" /> Case Profile
              </div>
              {hasLongCase && (
                <button
                  onClick={() => setActiveFullText({ title: 'Case Profile Description', content: caseDescription, type: 'case' })}
                  className="text-[9px] font-black text-donor hover:text-donor/80 transition-colors uppercase tracking-widest underline decoration-donor/40 underline-offset-2"
                >
                  View Full
                </button>
              )}
            </div>
            <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3 relative overflow-hidden group">
              <p className="text-gray-400 text-xs italic leading-relaxed break-words">
                {caseDescription ? (
                  hasLongCase ? (
                    `"${caseDescription.slice(0, 120)}..."`
                  ) : (
                    `"${caseDescription}"`
                  )
                ) : (
                  <span className="text-gray-600 italic">"No case profile description provided."</span>
                )}
              </p>
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-gray-500 font-bold text-[10px] uppercase tracking-widest">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-3.5 w-3.5" /> Personal Message
              </div>
              {hasLongMessage && (
                <button
                  onClick={() => setActiveFullText({ title: 'Patient Personal Message', content: message, type: 'message' })}
                  className="text-[9px] font-black text-donor hover:text-donor/80 transition-colors uppercase tracking-widest underline decoration-donor/40 underline-offset-2"
                >
                  View Full
                </button>
              )}
            </div>
            <div className="bg-white/[0.02] border border-white/5 border-dashed rounded-xl p-3 relative overflow-hidden group">
              <p className="text-highlight/95 text-xs italic leading-relaxed break-words font-semibold">
                {message ? (
                  hasLongMessage ? (
                    `"${message.slice(0, 120)}..."`
                  ) : (
                    `"${message}"`
                  )
                ) : (
                  <span className="text-gray-600 italic">"No message provided."</span>
                )}
              </p>
            </div>
          </div>
        </div>

        {status === 'Pending' && (
          <div className="mt-6 pt-5 border-t border-white/5 flex gap-3">
            <button
              disabled={actionLoading}
              onClick={() => handleStatusChange('Rejected')}
              className="w-1/2 bg-white/[0.02] border border-white/5 text-gray-400 hover:text-white hover:bg-donor hover:border-donor font-black tracking-widest text-[10px] py-3.5 px-4 rounded-xl transition-all duration-300 disabled:opacity-50 cursor-pointer"
            >
              REJECT
            </button>
            <button
              disabled={actionLoading}
              onClick={() => handleStatusChange('Approved')}
              className="w-1/2 bg-green-500 hover:bg-green-600 text-black font-black tracking-widest text-[10px] py-3.5 px-4 rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(34,197,94,0.2)] hover:shadow-[0_0_30px_rgba(34,197,94,0.4)] disabled:opacity-50 cursor-pointer"
            >
              APPROVE
            </button>
          </div>
        )}
      </div>
      <Dialog open={!!activeFullText} onOpenChange={(open) => !open && setActiveFullText(null)}>
        <DialogContent className="sm:max-w-2xl max-h-[85vh] flex flex-col p-0 overflow-hidden bg-[#090909]/95 border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)] rounded-2xl">
          <div className="p-6 border-b border-white/5 bg-white/[0.02]">
            <DialogHeader>
              <DialogTitle className="text-xl font-black uppercase tracking-widest flex items-center gap-3 text-white">
                {activeFullText?.type === 'case' ? (
                  <ClipboardList className="w-5 h-5 text-donor" />
                ) : (
                  <MessageSquare className="w-5 h-5 text-highlight" />
                )}
                <span className="bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                  {activeFullText?.title}
                </span>
              </DialogTitle>
            </DialogHeader>
          </div>

          <div className="p-6 overflow-y-auto custom-scrollbar flex-1 min-h-[150px] max-h-[60vh]">
            <p className={`text-sm leading-relaxed font-semibold whitespace-pre-wrap break-words italic p-5 rounded-xl border ${activeFullText?.type === 'case'
                ? 'text-gray-300 bg-white/[0.01] border-white/5'
                : 'text-highlight/95 bg-white/[0.01] border-white/5 border-dashed'
              }`}>
              {activeFullText?.content ? `"${activeFullText.content}"` : ''}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}