/** @format */
import { Stethoscope, Droplet, HeartPulse } from 'lucide-react';

const DonationProcessSection = () => {
    return (
        <section id="process" className="py-32 bg-surface relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(var(--highlight-hex),0.03),transparent_70%)] pointer-events-none"></div>
            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-24 max-w-3xl mx-auto space-y-4">
                    <span className="text-highlight font-black tracking-[0.4em] uppercase text-xs block opacity-80 italic">Connecting Lives</span>
                    <h2 className="text-4xl md:text-5xl font-black text-white italic tracking-tighter uppercase leading-none">
                        How <span className="text-donor">Donation</span> Works
                    </h2>
                    <p className="text-lg text-text-muted mt-6 font-medium">
                        Our platform makes blood matching simple, safe, and direct. Follow these steps to participate in our saving network.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative max-w-6xl mx-auto">
                    <div className="hidden lg:block absolute top-[60px] left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none"></div>
                    <div className="relative group bg-bg/50 backdrop-blur-xl p-8 rounded-3xl border border-white/5 hover:border-donor/30 transition-all duration-500 flex flex-col items-center text-center">
                        <div className="w-16 h-16 rounded-full bg-surface border border-white/10 flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(0,0,0,0.5)] group-hover:scale-110 transition-transform">
                            <Stethoscope className="w-6 h-6 text-donor" />
                        </div>
                        <h3 className="text-xl font-black text-white uppercase italic tracking-tighter mb-4">1. Health & Safety First</h3>
                        <p className="text-text-muted font-medium text-sm leading-relaxed mb-6">
                            Before registering, ensure you are in good health, smoke-free, and tested clean of any active blood diseases. Maintaining pristine health standards is vital to guarantee that your gift of life is completely safe for the recipient patient.
                        </p>
                    </div>
                    <div className="relative group bg-bg/50 backdrop-blur-xl p-8 rounded-3xl border border-white/5 hover:border-highlight/30 transition-all duration-500 flex flex-col items-center text-center">
                        <div className="w-16 h-16 rounded-full bg-surface border border-white/10 flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(0,0,0,0.5)] group-hover:scale-110 transition-transform">
                            <Droplet className="w-6 h-6 text-highlight" />
                        </div>
                        <h3 className="text-xl font-black text-white uppercase italic tracking-tighter mb-4">2. Declare Your Profile</h3>
                        <p className="text-text-muted font-medium text-sm leading-relaxed mb-6">
                            Register securely as an active donor and list your specific blood group. By declaring your availability and location, your profile becomes searchable and ready for patients requiring immediate compatibility matches.
                        </p>
                    </div>
                    <div className="relative group bg-bg/50 backdrop-blur-xl p-8 rounded-3xl border border-white/5 hover:border-donor/30 transition-all duration-500 flex flex-col items-center text-center">
                        <div className="w-16 h-16 rounded-full bg-surface border border-white/10 flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(0,0,0,0.5)] group-hover:scale-110 transition-transform">
                            <HeartPulse className="w-6 h-6 text-donor" />
                        </div>
                        <h3 className="text-xl font-black text-white uppercase italic tracking-tighter mb-4">3. Patient Request & Match</h3>
                        <p className="text-text-muted font-medium text-sm leading-relaxed mb-6">
                            When a patient in urgent need identifies you as a compatible match, they will contact you directly through our platform. Once you accept the request, you can coordinate the donation location and save a life!
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default DonationProcessSection;
