/** @format */

const HowItWorksSection = () => {
    const steps = [
        {
            id: 1,
            title: 'Sign Up',
            description:
                'Create your verified account as a voluntary Donor or Patient in less than a minute.',
        },
        {
            id: 2,
            title: 'Access Dashboard',
            description:
                'Manage live matching requests, track compatibility, and update availability status in real-time.',
        },
        {
            id: 3,
            title: 'Find or Help',
            description:
                'Publish emergency requests or volunteer to donate, saving lives with immediate match coordination.',
        },
    ];

    return (
        <section id="howitworks" className="py-32 bg-bg border-t border-white/5 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(var(--donor-hex),0.02),transparent_60%)] pointer-events-none"></div>

            <div className="container mx-auto px-6 relative z-10 max-w-7xl">
                <div className="text-center mb-20">
                    <span className="text-donor font-semibold tracking-wider uppercase text-xs mb-4 block">Simple Steps</span>
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">
                        How It <span className="text-highlight">Works</span>
                    </h2>
                    <p className="text-lg text-text-dim mt-4 max-w-2xl mx-auto">
                        A simple and fast way to connect donors and patients when it matters most.
                    </p>
                </div>

                <div className="relative max-w-5xl mx-auto">
                    <div className="hidden lg:block absolute top-[40px] left-[20%] right-[20%] z-0">
                        <div className="flex justify-between items-center w-full">
                            <div className="flex-1 px-8">
                                <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                            </div>
                            <div className="flex-1 px-8">
                                <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                            </div>
                        </div>
                    </div>

                    <div className="relative grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16 z-10">
                        {steps.map((step) => (
                            <div key={step.id} className="text-center group flex flex-col items-center">
                                <div className="mb-8 relative">
                                    <div className="w-20 h-20 bg-surface-2 border border-white/10 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-sm transition-all duration-300 group-hover:border-donor/50 group-hover:bg-surface-3">
                                        0{step.id}
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-4 tracking-tight group-hover:text-highlight transition-colors">
                                    {step.title}
                                </h3>
                                <p className="text-text-muted leading-relaxed text-sm max-w-[280px]">
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
