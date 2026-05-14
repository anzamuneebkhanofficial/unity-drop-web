import { Mail, User, MessageSquare, Calendar, Activity, Droplets, Home, MapPin, Truck, Repeat, ClipboardList, UserCheck, Phone, CheckCircle, XCircle } from 'lucide-react';

export default function PatientRequestCard({
  request,
  onUpdateStatus,
  expanded,
  onToggleExpand,
}) {
  const patient = request.patientId ?? {};
  const requestMessage = request.message ?? '';
  const caseProfile = request.caseDescription ?? '';
  const status = request.status ?? 'Pending';

  const statusStyle = {
    Approved: 'text-green-400 bg-green-500/10 border-green-500/20 shadow-[0_0_15px_rgba(34,197,94,0.1)]',
    Rejected: 'text-donor bg-donor/10 border-donor/20 shadow-[0_0_15px_rgba(231,77,42,0.1)]',
    Pending: 'text-highlight bg-highlight/10 border-highlight/20 animate-pulse',
  };

  const InfoRow = ({ icon: Icon, label, value, color = "text-gray-300" }) => {
    if (!value) return null;
    return (
      <div className="flex items-center justify-between group/row py-1 transition-all">
        <div className="flex items-center gap-2.5">
          <Icon className="h-3.5 w-3.5 text-gray-600 group-hover/row:text-donor transition-colors" />
          <span className="text-[10px] font-black uppercase text-gray-600 tracking-widest">{label}</span>
        </div>
        <span className={`${color} text-xs font-bold tracking-tight text-right truncate max-w-[140px]`}>{value}</span>
      </div>
    );
  };

  return (
    <article className="relative bg-[#0c0c0c] border border-white/5 rounded-xl overflow-hidden flex flex-col h-full shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:border-white/10 transition-all duration-500 group/card">
      {/* CARD ACCENT LINE */}
      <div className={`h-1 w-full bg-gradient-to-r ${status === 'Approved' ? 'from-green-500 to-emerald-400' : status === 'Rejected' ? 'from-red-600 to-orange-600' : 'from-highlight to-yellow-600'}`}></div>

      <div className="p-6 space-y-6 flex-grow">
        {/* HEADER SECTION */}
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-[#121212] flex items-center justify-center border border-white/5 relative group-hover/card:border-donor/30 transition-all duration-500">
              <User className="h-6 w-6 text-gray-500 group-hover/card:text-donor transition-colors" />
              {status === 'Pending' && <div className="absolute -top-1 -right-1 h-3 w-3 bg-highlight rounded-full animate-ping"></div>}
            </div>
            <div className="space-y-0.5">
              <p className="text-sm font-black text-white uppercase tracking-tighter italic">{patient.fullName || 'Unknown Patient'}</p>
              <div className="flex items-center gap-2">
                <Mail className="h-3 w-3 text-gray-700" />
                <p className="text-[10px] font-bold text-gray-600 uppercase tracking-tighter">
                  {status === 'Approved' ? patient.email : '••••••••@••••.com'}
                </p>
              </div>
            </div>
          </div>
          <span className={`text-[9px] font-black px-3 py-1.5 rounded-lg border uppercase tracking-widest transition-all ${statusStyle[status] ?? statusStyle.Pending}`}>
            {status}
          </span>
        </div>

        {/* INFO GRID GRID - Now using 2 columns for better data density in wider cards */}
        <div className="space-y-4 bg-white/[0.02] p-5 rounded-xl border border-white/5 shadow-inner transition-all duration-500">
          <div className="grid grid-cols-2 gap-x-8 gap-y-3">
            <InfoRow icon={Droplets} label="Blood Group" value={patient.bloodGroup} color="text-donor" />
            <InfoRow icon={Activity} label="Patient Age" value={request.patientAge ? `${request.patientAge} Years` : 'N/A'} />
            <InfoRow icon={ClipboardList} label="Bottles Needed" value={request.bottlesRequired} color="text-white" />
            <InfoRow icon={Calendar} label="Needed On" value={new Date(request.createdAt).toLocaleDateString()} />
          </div>
          
          <div className="h-px bg-gradient-to-r from-transparent via-white/5 to-transparent my-2"></div>
          
          <div className="grid grid-cols-2 gap-x-8 gap-y-3">
            <InfoRow icon={Home} label="Hospital" value={request.hospitalName} color="text-gray-400" />
            <InfoRow icon={MapPin} label="City" value={request.city} color="text-gray-400" />
            <InfoRow icon={Truck} label="Pick & Drop" value={request.pickAndDrop} color={request.pickAndDrop === 'Yes' ? 'text-green-400' : 'text-highlight'} />
            <InfoRow icon={Repeat} label="Exchange" value={request.exchangePossibility} color="text-gray-400" />
          </div>
        </div>

        {/* ATTENDANT BRIEF */}
        <div className="bg-[#121212]/50 p-4 rounded-xl border border-white/5 space-y-3">
          <div className="flex items-center gap-2">
            <UserCheck className="h-3.5 w-3.5 text-gray-700" />
            <h4 className="text-[10px] font-black uppercase text-gray-600 tracking-widest">Attendant</h4>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-[9px] font-black text-white/20 uppercase tracking-tighter leading-none">Name</p>
              <p className="text-xs font-bold text-gray-300 truncate">{request.attendantName || 'N/A'}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[9px] font-black text-white/20 uppercase tracking-tighter leading-none">Contact</p>
              <p className={`text-xs font-black tracking-widest ${status === 'Approved' ? 'text-highlight' : 'text-gray-700 italic lowercase'}`}>
                {status === 'Approved' ? (request.attendantPhone || 'N/A') : 'Encrypted'}
              </p>
            </div>
          </div>
        </div>

        {/* CASE PROFILE & PERSONAL MESSAGE */}
        <div className="space-y-4">
          {caseProfile && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <ClipboardList className="h-3.5 w-3.5 text-donor/50" />
                <span className="text-[10px] font-black uppercase text-gray-700 tracking-widest">Case Profile</span>
              </div>
              <p className="text-[11px] text-gray-500/80 leading-relaxed bg-white/[0.01] p-3 rounded-xl border border-dashed border-white/5 italic">
                "{caseProfile}"
              </p>
            </div>
          )}
          
          {requestMessage && requestMessage !== caseProfile && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-3.5 w-3.5 text-highlight/50" />
                <span className="text-[10px] font-black uppercase text-gray-700 tracking-widest">Personal Message</span>
              </div>
              <p className="text-[11px] text-highlight/80 leading-relaxed bg-highlight/[0.02] p-3 rounded-xl border border-dashed border-highlight/10 italic font-medium">
                "{requestMessage}"
              </p>
            </div>
          )}
        </div>
      </div>

      {/* FOOTER ACTIONS */}
      <div className={`p-4 bg-[#0a0a0c] border-t border-white/5 flex items-center ${status === 'Pending' ? 'justify-between' : 'justify-center'}`}>
        {status === 'Pending' ? (
          <>
            <button
              onClick={() => onUpdateStatus(request._id, 'Rejected')}
              className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-white/[0.03] text-gray-500 border border-white/5 text-[10px] font-black uppercase tracking-widest hover:bg-donor/10 hover:text-donor hover:border-donor/20 transition-all active:scale-95"
            >
              <XCircle className="h-3.5 w-3.5" /> Reject
            </button>
            <button
              onClick={() => onUpdateStatus(request._id, 'Approved')}
              className="flex items-center gap-2 px-8 py-2.5 rounded-lg bg-green-500 text-black font-black uppercase tracking-widest text-[10px] shadow-lg shadow-green-500/10 hover:shadow-green-500/20 active:scale-95 transition-all"
            >
              <CheckCircle className="h-3.5 w-3.5" /> Approve
            </button>
          </>
        ) : (
          <div className="flex items-center gap-2 text-[10px] font-black text-gray-700 uppercase tracking-[0.3em]">
            <Activity className="h-3 w-3" />
            Operation Finalized
          </div>
        )}
      </div>
    </article>
  );
}
