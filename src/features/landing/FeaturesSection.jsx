/** @format */
import { Search, Clock, ShieldCheck, Users, FileText, Heart } from 'lucide-react';

const FeaturesSection = () => {
    const features = [
        {
            icon: <Clock className="w-10 h-10 text-highlight mb-4 group-hover:scale-110 transition-transform duration-300" />,
            title: 'Controlled Match Flow',
            description:
                'Patients send emergency requests directly to compatible donors. The donor retains absolute control to accept or reject the matching request.',
        },
        {
            icon: <ShieldCheck className="w-10 h-10 text-highlight mb-4 group-hover:scale-110 transition-transform duration-300" />,
            title: 'Data Privacy Shield',
            description:
                'Critical details like contact phone numbers, exact locations, and hospital destinations remain strictly hidden until the donor accepts the request.',
        },
        {
            icon: <Heart className="w-10 h-10 text-highlight mb-4 group-hover:scale-110 transition-transform duration-300" />,
            title: 'OTP Email Verification',
            description:
                'Every new user registration requires dynamic email OTP validation, ensuring a high-integrity community with zero duplicate or fake profiles.',
        },
        {
            icon: <Users className="w-10 h-10 text-highlight mb-4 group-hover:scale-110 transition-transform duration-300" />,
            title: 'Role-Based Isolation',
            description:
                'Strict three-tier system access privileges isolate patient, donor, and admin modules, securing all restricted data from unauthorized actions.',
        },
        {
            icon: <FileText className="w-10 h-10 text-highlight mb-4 group-hover:scale-110 transition-transform duration-300" />,
            title: 'Administrative Oversight',
            description:
                'Super Admins possess full dashboard controls to assign operational roles, audit donor profiles, and safely delete accounts for complete moderating.',
        },
        {
            icon: <Search className="w-10 h-10 text-highlight mb-4 group-hover:scale-110 transition-transform duration-300" />,
            title: 'Filtered Directory Search',
            description:
                'Advanced search utilities let patients find compatible donors, and let administrators search, filter, and track all records by city, blood type, and status.',
        },
    ];

    return (
        <section id="features" className="bg-bg py-32 relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-[radial-gradient(circle_at_center,rgba(var(--donor-hex),0.03),transparent_70%)] blur-3xl pointer-events-none"></div>

            <div className="container mx-auto px-6 relative z-10 max-w-7xl">
                <div className="text-center mb-20 space-y-4">
                    <span className="text-highlight font-semibold tracking-wider uppercase text-xs block">Our Features</span>
                    <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight leading-tight">
                        Built to <span className="text-donor">Save Lives</span>
                    </h2>
                    <p className="text-lg text-text-dim mt-4 max-w-2xl mx-auto">
                        A fast, reliable platform designed carefully to help you during medical emergencies with total privacy.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="group bg-surface-2 rounded-xl p-8 border border-white/5 hover:border-white/20 transition-all duration-300 flex flex-col"
                        >
                            <div className="mb-6 flex items-center">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3 tracking-tight group-hover:text-highlight transition-colors">
                                {feature.title}
                            </h3>
                            <p className="text-text-muted leading-relaxed text-sm">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturesSection;
