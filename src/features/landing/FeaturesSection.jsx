/** @format */
import { Search, Clock, ShieldCheck, Users, FileText, Heart } from 'lucide-react';

const FeaturesSection = () => {
    const features = [
        {
            icon: <Clock className="w-10 h-10 text-highlight mb-4 group-hover:scale-110 transition-transform duration-300" />,
            title: '< 1 Minute Response',
            description:
                'Unity Drop is very fast. It connects blood donors and patients in less than one minute.',
        },
        {
            icon: <Search className="w-10 h-10 text-highlight mb-4 group-hover:scale-110 transition-transform duration-300" />,
            title: 'Gemini AI Matching',
            description:
                "Our smart Google Gemini AI automatically finds the best and closest donors in your city. You don't have to wait or search manually.",
        },
        {
            icon: <ShieldCheck className="w-10 h-10 text-highlight mb-4 group-hover:scale-110 transition-transform duration-300" />,
            title: '100% True Security',
            description:
                'All accounts are safe because we use Email OTP verification. Donors only share their phone numbers when they choose to accept a request.',
        },
        {
            icon: <Heart className="w-10 h-10 text-highlight mb-4 group-hover:scale-110 transition-transform duration-300" />,
            title: 'No Random Spam',
            description:
                'To keep you safe from spam, our system automatically bans users who break rules or bother others.',
        },
        {
            icon: <Users className="w-10 h-10 text-highlight mb-4 group-hover:scale-110 transition-transform duration-300" />,
            title: 'Three-Tier Dashboards',
            description:
                'We offer different dashboards for patients, donors, and admins. It has advanced tools to track everything easily.',
        },
        {
            icon: <FileText className="w-10 h-10 text-highlight mb-4 group-hover:scale-110 transition-transform duration-300" />,
            title: 'Works on All Devices',
            description:
                'Our simple website works perfectly on all devices. Whether you use a mobile phone, tablet, or a large computer, it will always be fast and clean.',
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
