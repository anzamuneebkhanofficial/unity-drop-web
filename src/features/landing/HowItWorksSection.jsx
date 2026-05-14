/** @format */

const HowItWorksSection = () => {
    const steps = [
        {
            id: 1,
            title: 'Sign Up',
            description:
                'Register as a donor or a patient to get started on our network.',
        },
        {
            id: 2,
            title: 'Dashboard',
            description:
                'Log in to your dashboard to manage requests, check status, and talk to others.',
        },
        {
            id: 3,
            title: 'Find or Help',
            description:
                'Send blood requests or respond to donors instantly through our platform.',
        },
    ];

    return (
        <section id="howitworks" className="py-28 bg-bg border-t border-white/5 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(var(--donor-hex),0.03),transparent_60%)]"></div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-24">
                    <span className="text-donor font-black tracking-[0.3em] uppercase text-xs mb-3 block">Simple Steps</span>
                    <h2 className="text-4xl md:text-6xl font-black text-white mb-6 italic tracking-tighter uppercase">
                        How It <span className="text-highlight">Works</span>
                    </h2>
                    <p className="text-lg text-text-muted mt-4 max-w-2xl mx-auto font-medium">
                        A simple and fast way to connect donors and patients when it matters most.
                    </p>
                </div>

                <div className="relative max-w-6xl mx-auto">
                    {/* SVG Arrows for desktop */}
                    <div className="hidden lg:block absolute top-[40px] left-[15%] right-[15%] z-0">
                        <div className="flex justify-between items-center w-full">
                            <div className="flex-1 px-8">
                                <svg className="w-full h-8 text-white/10" viewBox="0 0 200 20" fill="none">
                                    <path d="M0 10 H180 M180 10 L170 5 M180 10 L170 15" stroke="currentColor" strokeWidth="2" strokeDasharray="8 8" className="animate-[shimmer_10s_infinite_linear]" />
                                </svg>
                            </div>
                            <div className="flex-1 px-8">
                                <svg className="w-full h-8 text-white/10" viewBox="0 0 200 20" fill="none">
                                    <path d="M0 10 H180 M180 10 L170 5 M180 10 L170 15" stroke="currentColor" strokeWidth="2" strokeDasharray="8 8" className="animate-[shimmer_10s_infinite_linear]" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="relative grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-20 z-10">
                        {steps.map((step) => (
                            <div key={step.id} className="text-center group">
                                <div className="relative mb-10 inline-block">
                                    <div className="w-20 h-20 bg-surface-2 border-2 border-white/10 rounded-3xl flex items-center justify-center text-white text-3xl font-black italic shadow-2xl group-hover:bg-donor group-hover:border-donor/50 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6">
                                        0{step.id}
                                    </div>
                                    <div className="absolute -inset-4 bg-donor/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                </div>
                                <h3 className="text-2xl font-black text-white mb-5 uppercase tracking-tighter italic group-hover:text-highlight transition-colors">
                                    {step.title}
                                </h3>
                                <p className="text-text-muted leading-relaxed font-medium">
                                    {step.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HowItWorksSection;
