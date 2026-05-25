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
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-[radial-gradient(circle_at_center,rgba(var(--donor-hex),0.05),transparent_70%)] blur-3xl pointer-events-none"></div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-24 space-y-4">
                    <span className="text-highlight font-black tracking-[0.4em] uppercase text-xs block opacity-80 italic">Our Mission</span>
                    <h2 className="text-4xl md:text-6xl font-black text-white italic tracking-tighter uppercase leading-none">
                        Built to <span className="text-donor">Save Lives</span>
                    </h2>
                    <p className="text-lg text-text-muted mt-6 max-w-2xl mx-auto font-medium">
                        A fast, reliable platform designed carefully to help you during medical emergencies.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="group bg-surface/40 backdrop-blur-xl rounded-xl p-10 border border-white/5 hover:border-donor/30 transition-all duration-500 shadow-2xl hover:shadow-donor/5"
                        >
                            <div className="bg-bg rounded-lg p-5 inline-block mb-8 border border-white/5 group-hover:border-donor/30 group-hover:scale-110 transition-all duration-500 shadow-inner">
                                {feature.icon}
                            </div>
                            <h3 className="text-2xl font-black text-white mb-4 uppercase tracking-tighter italic group-hover:text-donor transition-colors leading-none">
                                {feature.title}
                            </h3>
                            <p className="text-text-muted leading-relaxed font-medium text-sm">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturesSection;
