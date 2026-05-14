/** @format */
import Link from 'next/link';
import { Stethoscope, Droplet, HeartPulse, ExternalLink } from 'lucide-react';

const DonationProcessSection = () => {
    return (
        <section id="process" className="py-32 bg-surface relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(var(--highlight-hex),0.03),transparent_70%)] pointer-events-none"></div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-24 max-w-3xl mx-auto space-y-4">
                    <span className="text-highlight font-black tracking-[0.4em] uppercase text-xs block opacity-80 italic">The Blood Pathway</span>
                    <h2 className="text-4xl md:text-5xl font-black text-white italic tracking-tighter uppercase leading-none">
                        How <span className="text-donor">Donation</span> Works
                    </h2>
                    <p className="text-lg text-text-muted mt-6 font-medium">
                        Understand the exact medical steps involved in safely testing, extracting, and transferring blood to a hospital patient.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative max-w-6xl mx-auto">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden lg:block absolute top-[60px] left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none"></div>

                    {/* Step 1 */}
                    <div className="relative group bg-bg/50 backdrop-blur-xl p-8 rounded-3xl border border-white/5 hover:border-donor/30 transition-all duration-500 flex flex-col items-center text-center">
                        <div className="w-16 h-16 rounded-full bg-surface border border-white/10 flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(0,0,0,0.5)] group-hover:scale-110 transition-transform">
                            <Stethoscope className="w-6 h-6 text-donor" />
                        </div>
                        <h3 className="text-xl font-black text-white uppercase italic tracking-tighter mb-4">1. Mandatory Testing</h3>
                        <p className="text-text-muted font-medium text-sm leading-relaxed mb-6">
                            Before donation, medical staff will check your hemoglobin, blood pressure, and run rigorous tests for infectious diseases to guarantee 100% patient safety.
                        </p>
                    </div>

                    {/* Step 2 */}
                    <div className="relative group bg-bg/50 backdrop-blur-xl p-8 rounded-3xl border border-white/5 hover:border-highlight/30 transition-all duration-500 flex flex-col items-center text-center">
                        <div className="w-16 h-16 rounded-full bg-surface border border-white/10 flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(0,0,0,0.5)] group-hover:scale-110 transition-transform">
                            <Droplet className="w-6 h-6 text-highlight" />
                        </div>
                        <h3 className="text-xl font-black text-white uppercase italic tracking-tighter mb-4">2. The Collection</h3>
                        <p className="text-text-muted font-medium text-sm leading-relaxed mb-6">
                            Using highly sterile equipment, a skilled phlebotomist will extract approximately 1 pint (470ml) of blood. The extraction itself is practically painless and takes only 10 minutes.
                        </p>
                    </div>

                    {/* Step 3 */}
                    <div className="relative group bg-bg/50 backdrop-blur-xl p-8 rounded-3xl border border-white/5 hover:border-donor/30 transition-all duration-500 flex flex-col items-center text-center">
                        <div className="w-16 h-16 rounded-full bg-surface border border-white/10 flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(0,0,0,0.5)] group-hover:scale-110 transition-transform">
                            <HeartPulse className="w-6 h-6 text-donor" />
                        </div>
                        <h3 className="text-xl font-black text-white uppercase italic tracking-tighter mb-4">3. Transfusion Match</h3>
                        <p className="text-text-muted font-medium text-sm leading-relaxed mb-6">
                            Before entering the hospital receiver, the blood is immediately cross-matched against the patient's sample. Once confirmed safe, it is transfused via an IV line to restore life.
                        </p>
                    </div>
                </div>

                <div className="mt-16 text-center">
                    <Link href="/donation-process" className="inline-flex items-center gap-2 text-highlight hover:text-white transition-colors font-bold uppercase tracking-widest text-sm border-b-2 border-highlight/30 hover:border-highlight pb-1">
                        Read Full Medical Process
                        <ExternalLink className="w-4 h-4 ml-1" />
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default DonationProcessSection;
