
export default function InfoDetailBox({
  icon: Icon,
  label,
  value,
  color,
  span = 1,
  sensitive = false,
  variant = 'admin',
}) {
  const spanClass =
    span === 3 ? 'md:col-span-3' : span === 2 ? 'md:col-span-2' : '';

  if (variant === 'dashboard') {
    return (
      <div className={`space-y-3 ${spanClass} group`}>
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-white/40 group-hover:text-donor transition-colors" />
          <span className="text-[10px] font-black text-white/50 uppercase tracking-[.25em] leading-none">
            {label}
          </span>
        </div>
        <div
          className={`p-6 bg-white/[0.03] border border-white/10 rounded-xl font-black text-xs uppercase tracking-tight break-words whitespace-normal ${sensitive
              ? 'text-gray-600 italic'
              : color || 'text-white/90'
            } group-hover:bg-white/[0.06] group-hover:border-white/20 transition-all duration-300 shadow-lg shadow-black/40`}
        >
          {sensitive ? 'Hidden until approved' : value || 'Not available'}
        </div>
      </div>
    );
  }
  return (
    <div className={`space-y-2 ${spanClass} group`}>
      <div className="flex items-center gap-2">
        <Icon className="w-3.5 h-3.5 text-gray-600 group-hover:text-donor transition-colors" />
        <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest leading-none">
          {label}
        </span>
      </div>
      <div
        className={`p-5 bg-surface-2/60 border border-white/5 rounded-lg font-black text-xs uppercase tracking-tight break-words whitespace-normal ${color || 'text-gray-300'
          } group-hover:bg-surface-2 transition-colors`}
      >
        {value || 'Not available'}
      </div>
    </div>
  );
}
