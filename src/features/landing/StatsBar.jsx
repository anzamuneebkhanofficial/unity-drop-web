/** @format */

const StatsBar = () => {
    const stats = [
        { value: '5 Mins', label: 'Average Connection Time' },
        { value: '48 Cities', label: 'Covered Nationwide' },
        { value: '24/7', label: 'Service Availability' },
        { value: '100% Free', label: 'For all users' },
    ];

    return (
        <div className="bg-bg border-y border-white/5 relative overflow-hidden">
            <div className="container mx-auto px-6 py-12 md:py-16">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center relative z-10">
                    {stats.map((stat, index) => (
                        <div key={index} className="flex flex-col items-center justify-center p-6 rounded-2xl transition-all duration-300 hover:bg-white/[0.02] border border-transparent hover:border-white/5 group">
                            <h4 className="text-3xl md:text-5xl font-black text-white italic tracking-tighter mb-2 group-hover:text-highlight transition-colors drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">{stat.value}</h4>
                            <p className="text-xs md:text-sm text-text-muted font-medium uppercase tracking-widest">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(var(--highlight-hex),0.02),transparent_70%)]"></div>
        </div>
    );
};

export default StatsBar;
