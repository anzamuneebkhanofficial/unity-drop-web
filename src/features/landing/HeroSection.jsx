/** @format */
import Link from 'next/link';
import { Users, Heart } from 'lucide-react';

const HeroSection = () => {
    return (
        <section className="bg-bg text-white relative overflow-hidden min-h-[90dvh] flex items-center">
            {/* Background Glow Effect - Cinematic */}
            <div className="absolute top-0 left-1/4 w-[1000px] h-[700px] bg-donor/5 rounded-full blur-[150px] pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-[1000px] h-[700px] bg-highlight/5 rounded-full blur-[150px] pointer-events-none" />

            <div className="container mx-auto px-6 pt-32 pb-24 relative z-10 flex flex-col lg:flex-row items-center gap-16 w-full max-w-[2000px]">
                {/* Left Side: Text Content */}
                <div className="lg:w-3/5 text-center lg:text-left space-y-10">
                    <div className="inline-flex items-center gap-3 px-6 py-2 bg-white/5 border border-white/10 rounded-full text-xs font-black tracking-[0.3em] uppercase text-highlight italic backdrop-blur-md">
                        <span className="w-2 h-2 rounded-full bg-donor animate-pulse"></span>
                        Ready to Help
                    </div>
                    <h1 className="text-[clamp(2.5rem,5vw+1rem,4rem)] font-black leading-none tracking-tighter italic uppercase">
                        Donate Blood. <br />
                        <span className="text-donor">Save a Life</span> <br />
                        <span className="text-white">Today.</span>
                    </h1>
                    <p className="text-lg md:text-xl text-text-muted max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium mb-2">
                        Finding blood fast in an emergency is very easy here. We connect blood donors directly with patients who need it right away. It is fast, free, and secure.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-6">
                        <Link href="/patient/register" className="bg-highlight hover:bg-highlight/80 text-black font-black uppercase tracking-[0.2em] py-5 px-10 rounded-lg text-xs transition-all transform hover:scale-105 shadow-[0_10px_40px_rgba(var(--highlight-hex),0.3)] text-center active:scale-95 min-h-[44px] flex items-center justify-center">
                            Find a Donor
                        </Link>
                        <Link href="/donor/register" className="bg-donor hover:bg-donor/80 text-white font-black uppercase tracking-[0.2em] py-5 px-10 rounded-lg text-xs transition-all transform hover:scale-105 shadow-[0_10px_40px_rgba(var(--donor-hex),0.3)] text-center active:scale-95 min-h-[44px] flex items-center justify-center">
                            Register as Donor
                        </Link>
                    </div>
                </div>

                {/* Right Side: Stats Cards */}
                <div className="lg:w-2/5 flex flex-col gap-6 w-full max-w-md relative">
                    {/* Decorative Elements */}
                    <div className="absolute -top-20 -right-20 w-64 h-64 bg-donor/10 rounded-full blur-3xl animate-pulse lg:block hidden" />

                    <div className="bg-surface/40 backdrop-blur-2xl border border-white/5 p-10 rounded-xl shadow-[0_30px_100px_rgba(0,0,0,0.6)] transform hover:-translate-y-2 transition-all duration-500 hover:border-highlight/30 group">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-text-dim group-hover:text-highlight transition-colors">Our Community</h3>
                            <div className="p-3 bg-highlight/10 rounded-lg group-hover:bg-highlight transition-all duration-500">
                                <Users className="w-6 h-6 text-highlight group-hover:text-black transition-colors" />
                            </div>
                        </div>
                        <p className="text-[clamp(2.5rem,4vw+1rem,3.75rem)] font-black text-white italic tracking-tighter">1,250+</p>
                        <p className="text-[10px] font-black uppercase tracking-widest text-text-dim mt-4 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Live Connections
                        </p>
                    </div>

                    <div className="bg-surface/40 backdrop-blur-2xl border border-white/5 p-10 rounded-xl shadow-[0_30px_100px_rgba(0,0,0,0.6)] transform hover:-translate-y-2 transition-all duration-500 hover:border-donor/30 group relative overflow-hidden">
                        <div className="absolute bottom-0 right-0 w-32 h-32 bg-donor/10 blur-3xl rounded-full"></div>
                        <div className="flex items-center justify-between mb-6 relative z-10">
                            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-text-dim group-hover:text-donor transition-colors">Lives Saved</h3>
                            <div className="p-3 bg-donor/10 rounded-lg group-hover:bg-donor transition-all duration-500">
                                <Heart className="w-6 h-6 text-donor group-hover:text-white transition-colors" />
                            </div>
                        </div>
                        <p className="text-[clamp(2.5rem,4vw+1rem,3.75rem)] font-black text-white italic tracking-tighter relative z-10">800+</p>
                        <p className="text-[10px] font-black uppercase tracking-widest text-text-dim mt-4 relative z-10 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-donor"></span> Lives Helped
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
