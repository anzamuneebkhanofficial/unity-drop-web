/** @format */
import Link from 'next/link';
import { Droplet, Info, Users, ShieldCheck } from 'lucide-react';

const BloodInfoSection = () => {
    return (
        <section id="blood-info" className="py-32 bg-bg relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_left,rgba(var(--donor-hex),0.03),transparent_50%)] pointer-events-none"></div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-24 max-w-3xl mx-auto space-y-4">
                    <span className="text-donor font-black tracking-[0.4em] uppercase text-xs block opacity-80 italic">Knowledge Base</span>
                    <h2 className="text-4xl md:text-5xl font-black text-white italic tracking-tighter uppercase leading-none">
                        Understanding <span className="text-highlight">Blood Types</span>
                    </h2>
                    <p className="text-lg text-text-muted mt-6 font-medium">
                        Knowing your blood type is the first step in saving a life. Learn who you can help and who can help you during a medical emergency.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-center">
                    {/* Left: General Info Cards */}
                    <div className="space-y-6">
                        <div className="bg-surface/40 backdrop-blur-xl p-8 rounded-[2rem] border border-white/5 hover:border-donor/30 transition-all duration-500 shadow-2xl group">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-3 bg-donor/10 rounded-xl group-hover:bg-donor transition-colors">
                                    <Droplet className="w-6 h-6 text-donor group-hover:text-white" />
                                </div>
                                <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">Universal Donors & Recipients</h3>
                            </div>
                            <p className="text-text-muted leading-relaxed font-medium">
                                People with <span className="text-white font-bold">O- (O Negative)</span> blood are universal donors, meaning their blood can be given to anyone. People with <span className="text-white font-bold">AB+ (AB Positive)</span> are universal recipients and can receive blood from any group.
                            </p>
                        </div>

                        <div className="bg-surface/40 backdrop-blur-xl p-8 rounded-[2rem] border border-white/5 hover:border-highlight/30 transition-all duration-500 shadow-2xl group">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-3 bg-highlight/10 rounded-xl group-hover:bg-highlight transition-colors">
                                    <ShieldCheck className="w-6 h-6 text-highlight group-hover:text-black" />
                                </div>
                                <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">Rare Blood Types</h3>
                            </div>
                            <p className="text-text-muted leading-relaxed font-medium">
                                Types like AB- and B- are among the rarest blood groups. If you have a rare blood type, your donation is exceptionally valuable as finding an exact match during emergencies is highly difficult.
                            </p>
                        </div>

                        <div className="bg-surface/40 backdrop-blur-xl p-8 rounded-[2rem] border border-white/5 hover:border-donor/30 transition-all duration-500 shadow-2xl group">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-3 bg-donor/10 rounded-xl group-hover:bg-donor transition-colors">
                                    <Users className="w-6 h-6 text-donor group-hover:text-white" />
                                </div>
                                <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">Who Can Donate?</h3>
                            </div>
                            <p className="text-text-muted leading-relaxed font-medium">
                                Anyone aged 18-65, weighing at least 50kg, and in good health can donate blood. Men can donate safely every 3 months, and women every 4 months.
                            </p>
                        </div>
                    </div>

                    {/* Right: Compatibility Table Call to Action */}
                    <div className="bg-gradient-to-br from-surface to-surface-2 p-1 relative rounded-[3rem] overflow-hidden shadow-2xl">
                        <div className="absolute inset-0 bg-donor/10 blur-3xl rounded-full mix-blend-screen mix-blend-overlay"></div>
                        <div className="bg-bg/90 backdrop-blur-3xl rounded-[2.9rem] p-10 md:p-14 relative z-10 flex flex-col items-center text-center h-full justify-center">
                            <div className="w-20 h-20 bg-highlight/10 rounded-2xl flex items-center justify-center mb-8 border border-highlight/20 shadow-[0_0_30px_rgba(var(--highlight-hex),0.2)]">
                                <Info className="w-10 h-10 text-highlight" />
                            </div>
                            <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-4">Full Compatibility Guide</h3>
                            <p className="text-text-muted leading-relaxed font-medium mb-10 max-w-sm">
                                Not sure who you can receive blood from or give blood to? View our comprehensive guidelines and make sure you have the right information before an emergency strikes.
                            </p>
                            <Link href="/guidelines" className="w-full sm:w-auto bg-highlight text-black font-black uppercase tracking-[0.2em] py-5 px-10 rounded-xl text-sm transition-all transform hover:scale-105 shadow-[0_10px_40px_rgba(var(--highlight-hex),0.3)] hover:bg-highlight/90 active:scale-95 flex items-center justify-center gap-3">
                                Read Full Guidelines
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default BloodInfoSection;
