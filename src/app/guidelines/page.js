import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Droplet, Heart, Activity, CheckCircle2 } from 'lucide-react';

export default function GuidelinesPage() {
    return (
        <div className="bg-bg min-h-screen text-white font-sans selection:bg-highlight selection:text-black pb-32">
            {/* Header / Hero Area */}
            <div className="relative pt-32 pb-20 overflow-hidden border-b border-white/5">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(var(--donor-hex),0.05),transparent_60%)] pointer-events-none"></div>
                <div className="container mx-auto px-6 relative z-10 max-w-5xl">
                    <Link href="/" className="inline-flex items-center gap-2 text-text-muted hover:text-white transition-colors mb-12 group font-medium text-sm w-fit bg-surface-2 px-5 py-2.5 rounded-full border border-white/5 shadow-lg">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Home
                    </Link>

                    <span className="text-donor font-black tracking-[0.4em] uppercase text-xs block opacity-80 italic mb-4">Detailed Knowledge Base</span>
                    <h1 className="text-4xl md:text-6xl font-black text-white italic tracking-tighter uppercase leading-none mb-6">
                        Blood Donation <span className="text-highlight">Guidelines</span>
                    </h1>
                    <p className="text-lg md:text-xl text-text-muted font-medium max-w-2xl leading-relaxed">
                        A complete guide to understanding blood types, compatibility, and the donation process according to Unity Drop&apos;s Medical Network standards.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-6 mt-16 max-w-5xl space-y-16 relative z-10">
                
                {/* Section 1: Blood Types Explained */}
                <section className="bg-surface/40 backdrop-blur-xl p-8 md:p-12 rounded-[2rem] border border-white/5 shadow-2xl relative overflow-hidden group hover:border-white/10 transition-colors">
                    <div className="absolute -right-20 -top-20 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity pointer-events-none">
                        <Droplet className="w-96 h-96 text-white" />
                    </div>
                    
                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 bg-donor/10 rounded-xl relative">
                            <Droplet className="w-6 h-6 text-donor relative z-10" />
                        </div>
                        <h2 className="text-2xl md:text-3xl font-black italic uppercase tracking-tighter text-white">Blood Type Principles</h2>
                    </div>

                    <p className="text-text-muted font-medium leading-relaxed mb-8 max-w-3xl">
                        Your blood contains antigens on the surface of your red blood cells. These antigens determine your blood type. The presence or absence of the A and B antigens, along with the Rh factor (positive or negative), creates the 8 main blood groups.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="border border-white/10 rounded-2xl p-6 bg-surface-2/50 relative overflow-hidden">
                            <span className="text-donor text-xs font-black uppercase tracking-widest block mb-2 opacity-80">Universal Donor</span>
                            <h3 className="text-4xl font-black text-white italic tracking-tighter mb-4">Type O-</h3>
                            <p className="text-text-muted text-sm font-medium leading-relaxed">
                                People with O Negative blood are known as universal donors because their red blood cells can be transfused to patients of any blood type. It is routinely used in trauma situations when a patient&apos;s blood type is unknown.
                            </p>
                        </div>
                        <div className="border border-white/10 rounded-2xl p-6 bg-surface-2/50 relative overflow-hidden">
                            <span className="text-highlight text-xs font-black uppercase tracking-widest block mb-2 opacity-80">Universal Recipient</span>
                            <h3 className="text-4xl font-black text-white italic tracking-tighter mb-4">Type AB+</h3>
                            <p className="text-text-muted text-sm font-medium leading-relaxed">
                                People with AB Positive blood are known as universal recipients. This means they can receive blood transfers from any of the other blood types safely without severe immune reactions.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Section 2: Compatibility Chart */}
                <section className="bg-surface/40 backdrop-blur-xl p-8 md:p-12 rounded-[2rem] border border-white/5 shadow-2xl">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 bg-highlight/10 rounded-xl">
                            <Activity className="w-6 h-6 text-highlight" />
                        </div>
                        <h2 className="text-2xl md:text-3xl font-black italic uppercase tracking-tighter text-white">Compatibility Matrix</h2>
                    </div>
                    
                    <p className="text-text-muted font-medium leading-relaxed mb-8 max-w-3xl">
                        Matching the correct blood type is highly critical. A mismatch can cause severe reactions. Use this chart to see who can give and who can receive.
                    </p>

                    <div className="overflow-x-auto pb-4">
                        <table className="w-full text-left min-w-[600px] border-collapse">
                            <thead>
                                <tr className="border-b border-white/10 text-sm font-black uppercase tracking-wider text-text-muted">
                                    <th className="p-4 pl-0">Blood Type</th>
                                    <th className="p-4">Can Give Blood To</th>
                                    <th className="p-4">Can Receive Blood From</th>
                                </tr>
                            </thead>
                            <tbody className="font-medium text-sm">
                                <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                    <td className="p-4 pl-0 font-black text-white text-lg">A+</td>
                                    <td className="p-4 text-text-muted">A+, AB+</td>
                                    <td className="p-4 text-text-muted">A+, A-, O+, O-</td>
                                </tr>
                                <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                    <td className="p-4 pl-0 font-black text-white text-lg">O+</td>
                                    <td className="p-4 text-text-muted">O+, A+, B+, AB+</td>
                                    <td className="p-4 text-text-muted">O+, O-</td>
                                </tr>
                                <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                    <td className="p-4 pl-0 font-black text-white text-lg">B+</td>
                                    <td className="p-4 text-text-muted">B+, AB+</td>
                                    <td className="p-4 text-text-muted">B+, B-, O+, O-</td>
                                </tr>
                                <tr className="border-b border-white/5 hover:bg-white/5 transition-colors bg-highlight/5">
                                    <td className="p-4 pl-0 font-black text-highlight text-lg">AB+</td>
                                    <td className="p-4 text-text-muted">AB+</td>
                                    <td className="p-4 text-text-muted"><strong className="text-white">Everyone (Universal Recipient)</strong></td>
                                </tr>
                                <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                    <td className="p-4 pl-0 font-black text-white text-lg">A-</td>
                                    <td className="p-4 text-text-muted">A+, A-, AB+, AB-</td>
                                    <td className="p-4 text-text-muted">A-, O-</td>
                                </tr>
                                <tr className="border-b border-white/5 hover:bg-white/5 transition-colors bg-donor/5">
                                    <td className="p-4 pl-0 font-black text-donor text-lg">O-</td>
                                    <td className="p-4 text-text-muted"><strong className="text-white">Everyone (Universal Donor)</strong></td>
                                    <td className="p-4 text-text-muted">O- Only</td>
                                </tr>
                                <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                    <td className="p-4 pl-0 font-black text-white text-lg">B-</td>
                                    <td className="p-4 text-text-muted">B+, B-, AB+, AB-</td>
                                    <td className="p-4 text-text-muted">B-, O-</td>
                                </tr>
                                <tr className="hover:bg-white/5 transition-colors">
                                    <td className="p-4 pl-0 font-black text-white text-lg">AB-</td>
                                    <td className="p-4 text-text-muted">AB+, AB-</td>
                                    <td className="p-4 text-text-muted">AB-, A-, B-, O-</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Section 3: Eligibility & Post-Donation */}
                <section className="bg-surface/40 backdrop-blur-xl p-8 md:p-12 rounded-[2rem] border border-white/5 shadow-2xl">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 bg-white/10 rounded-xl">
                            <Heart className="w-6 h-6 text-white" />
                        </div>
                        <h2 className="text-2xl md:text-3xl font-black italic uppercase tracking-tighter text-white">Who Can Donate?</h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12">
                        <ul className="space-y-4">
                            <li className="flex items-start gap-4 p-4 rounded-xl bg-surface-2 border border-white/5 transition-all hover:bg-white/5">
                                <CheckCircle2 className="w-6 h-6 text-donor mt-0.5 flex-shrink-0" />
                                <div>
                                    <h4 className="font-bold text-white mb-1">Age Limits</h4>
                                    <p className="text-text-muted text-sm font-medium">You must be between 18 and 65 years old to donate blood.</p>
                                </div>
                            </li>
                            <li className="flex items-start gap-4 p-4 rounded-xl bg-surface-2 border border-white/5 transition-all hover:bg-white/5">
                                <CheckCircle2 className="w-6 h-6 text-donor mt-0.5 flex-shrink-0" />
                                <div>
                                    <h4 className="font-bold text-white mb-1">Weight Requirement</h4>
                                    <p className="text-text-muted text-sm font-medium">You should weigh at least 50 kg (110 lbs) and be in general good health.</p>
                                </div>
                            </li>
                        </ul>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-4 p-4 rounded-xl bg-surface-2 border border-white/5 transition-all hover:bg-white/5">
                                <CheckCircle2 className="w-6 h-6 text-donor mt-0.5 flex-shrink-0" />
                                <div>
                                    <h4 className="font-bold text-white mb-1">Impact of One Donation</h4>
                                    <p className="text-text-muted text-sm font-medium">A single unit of blood can be separated into red cells, plasma, and platelets, potentially saving up to three different lives.</p>
                                </div>
                            </li>
                            <li className="flex items-start gap-4 p-4 rounded-xl bg-surface-2 border border-white/5 transition-all hover:bg-white/5">
                                <CheckCircle2 className="w-6 h-6 text-donor mt-0.5 flex-shrink-0" />
                                <div>
                                    <h4 className="font-bold text-white mb-1">Recovery Time</h4>
                                    <p className="text-text-muted text-sm font-medium">Men can donate blood every 3 months. Women can donate safely every 4 months to allow iron levels to replenish.</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </section>

                <div className="flex justify-center pt-8">
                     <Link href="/patient" className="bg-donor text-white font-black uppercase tracking-[0.2em] py-5 px-10 rounded-xl text-sm transition-all transform hover:scale-105 shadow-[0_10px_40px_rgba(var(--donor-hex),0.3)] hover:bg-donor/90 active:scale-95 text-center">
                        Need Blood Right Now? Search Donors
                    </Link>
                </div>
            </div>
        </div>
    );
}
