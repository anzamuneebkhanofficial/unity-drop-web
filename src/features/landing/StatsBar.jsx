/** @format */

const StatsBar = () => {
  const stats = [
    { value: '5 Mins', label: 'Average Connection Time' },
    { value: '48 Cities', label: 'Covered Nationwide' },
    { value: '24/7', label: 'Service Availability' },
    { value: '100% Free', label: 'For all users' },
  ];

  return (
    <div className="bg-bg relative overflow-hidden">
      <div className="container mx-auto px-6 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center relative z-10">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center p-6 rounded-2xl transition-all duration-300 hover:bg-surface-2 border border-transparent group"
            >
              <h4 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-2 group-hover:text-highlight transition-colors">
                {stat.value}
              </h4>
              <p className="text-xs md:text-sm text-text-muted font-medium uppercase tracking-wider">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02),transparent_70%)] pointer-events-none"></div>
    </div>
  );
};

export default StatsBar;
