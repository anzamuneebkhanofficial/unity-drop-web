import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Stethoscope, TestTube2, Activity, HeartPulse, CheckCircle2, Hospital } from 'lucide-react';

export default function DonationProcessPage() {
    return (
        <div className="bg-bg min-h-screen text-white font-sans selection:bg-highlight selection:text-black pb-32">
            <div className="relative pt-32 pb-20 overflow-hidden border-b border-white/5">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(var(--donor-hex),0.05),transparent_60%)] pointer-events-none"></div>
                <div className="container mx-auto px-6 relative z-10 max-w-5xl">
                    <Link href="/#process" className="inline-flex items-center gap-2 text-text-muted hover:text-white transition-colors mb-12 group font-medium text-sm w-fit bg-surface-2 px-5 py-2.5 rounded-full border border-white/5 shadow-lg">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Process
                    </Link>

                    <span className="text-donor font-black tracking-[0.4em] uppercase text-xs block opacity-80 italic mb-4">Medical Procedure</span>
                    <h1 className="text-4xl md:text-6xl font-black text-white italic tracking-tighter uppercase leading-none mb-6">
                        The End-to-End <span className="text-highlight">Transfusion Process</span>
                    </h1>
                    <p className="text-lg md:text-xl text-text-muted font-medium max-w-2xl leading-relaxed">
                        An exhaustive guide explaining exactly what happens when you donate blood, what tests are run before donation, and how hospitals conduct safe transfusions for patients.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-6 mt-16 max-w-5xl space-y-16 relative z-10">
                
                {/* Step 1: Pre-Donation Tests */}
                <section className="bg-surface/40 backdrop-blur-xl p-8 md:p-12 rounded-[2rem] border border-white/5 shadow-2xl relative overflow-hidden group hover:border-white/10 transition-colors">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 bg-donor/10 rounded-xl relative">
                            <TestTube2 className="w-6 h-6 text-donor relative z-10" />
                        </div>
                        <h2 className="text-2xl md:text-3xl font-black italic uppercase tracking-tighter text-white">1. Pre-Donation Screening & Tests</h2>
                    </div>

                    <p className="text-text-muted font-medium leading-relaxed mb-8 max-w-3xl">
                        Before passing any blood to a patient, you must pass crucial medical checks. Hospitals and blood banks will naturally conduct these tests to guarantee the blood is entirely safe.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="border border-white/10 rounded-2xl p-6 bg-surface-2/50">
                            <h3 className="text-xl font-black text-white italic tracking-tighter mb-4">Hemoglobin & Vitals</h3>
                            <p className="text-text-muted text-sm font-medium leading-relaxed mb-4">
                                A quick finger-prick test is performed to measure your hemoglobin levels. Men must usually have &gt; 13.0 g/dL and women &gt; 12.5 g/dL to donate safely without risking anemia. Blood pressure and temperature are also thoroughly checked.
                            </p>
                        </div>
                        <div className="border border-white/10 rounded-2xl p-6 bg-surface-2/50">
                            <h3 className="text-xl font-black text-highlight italic tracking-tighter mb-4">Infectious Disease Testing</h3>
                            <p className="text-text-muted text-sm font-medium leading-relaxed">
                                Once your blood is drawn, sample tubes are immediately sent to a lab to test for infectious diseases including: Hepatitis B, Hepatitis C, HIV, and Syphilis. If any of these are strictly positive, the blood is immediately discarded.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Step 2: The Donation Collection */}
                <section className="bg-surface/40 backdrop-blur-xl p-8 md:p-12 rounded-[2rem] border border-white/5 shadow-2xl">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 bg-white/10 rounded-xl">
                            <Activity className="w-6 h-6 text-white" />
                        </div>
                        <h2 className="text-2xl md:text-3xl font-black italic uppercase tracking-tighter text-white">2. The Collection Process</h2>
                    </div>
                    
                    <p className="text-text-muted font-medium leading-relaxed mb-8 max-w-3xl">
                        The precise medical process takes only 10-15 minutes, overseen directly by a phlebotomist. 
                    </p>

                    <ul className="space-y-4">
                        <li className="flex items-start gap-4 p-4 rounded-xl bg-surface-2 border border-white/5">
                            <div className="w-8 h-8 rounded-full bg-highlight/20 text-highlight flex items-center justify-center font-black mt-0.5 flex-shrink-0">1</div>
                            <div>
                                <h4 className="font-bold text-white mb-1">Vein Selection & Sterilization</h4>
                                <p className="text-text-muted text-sm font-medium">The inner elbow is thoroughly cleaned with antiseptic to naturally prevent bacteria from mixing with the drawn blood.</p>
                            </div>
                        </li>
                        <li className="flex items-start gap-4 p-4 rounded-xl bg-surface-2 border border-white/5">
                            <div className="w-8 h-8 rounded-full bg-highlight/20 text-highlight flex items-center justify-center font-black mt-0.5 flex-shrink-0">2</div>
                            <div>
                                <h4 className="font-bold text-white mb-1">Blood Volume Drawn</h4>
                                <p className="text-text-muted text-sm font-medium">Approximately 470ml (1 pint) or roughly roughly 8-10% of total body blood volume is extracted via a sterile, single-use needle.</p>
                            </div>
                        </li>
                        <li className="flex items-start gap-4 p-4 rounded-xl bg-surface-2 border border-white/5">
                            <div className="w-8 h-8 rounded-full bg-highlight/20 text-highlight flex items-center justify-center font-black mt-0.5 flex-shrink-0">3</div>
                            <div>
                                <h4 className="font-bold text-white mb-1">Mandatory Recovery</h4>
                                <p className="text-text-muted text-sm font-medium">The donor must rest for 15 minutes, hydrating heavily to ensure their fluids are safely recovering. Fluids replenish entirely within 24 hours.</p>
                            </div>
                        </li>
                    </ul>
                </section>

                {/* Step 3: Hospital Transfusion */}
                <section className="bg-surface/40 backdrop-blur-xl p-8 md:p-12 rounded-[2rem] border border-white/5 shadow-2xl">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 bg-donor/10 rounded-xl">
                            <Hospital className="w-6 h-6 text-donor" />
                        </div>
                        <h2 className="text-2xl md:text-3xl font-black italic uppercase tracking-tighter text-white">3. How the Receiver is Transfused</h2>
                    </div>

                    <p className="text-text-muted font-medium leading-relaxed mb-8 max-w-3xl">
                        When the patient severely needs the blood, the hospital does not immediately inject it. Very strict, controlled procedures happen first to prevent fatalities due to incompatibility.
                    </p>

                    <div className="grid md:grid-cols-2 gap-12">
                        <ul className="space-y-4">
                            <li className="flex items-start gap-4 p-4 rounded-xl bg-surface-2 border border-white/5 transition-all hover:bg-white/5">
                                <Stethoscope className="w-6 h-6 text-donor mt-0.5 flex-shrink-0" />
                                <div>
                                    <h4 className="font-bold text-white mb-1">Cross-Matching in Labs</h4>
                                    <p className="text-text-muted text-sm font-medium">The recipient&apos;s blood sample is directly mixed with a microscopic sample of the donor blood. If clumping (agglutination) occurs, it is a mismatch and cannot be used.</p>
                                </div>
                            </li>
                            <li className="flex items-start gap-4 p-4 rounded-xl bg-surface-2 border border-white/5 transition-all hover:bg-white/5">
                                <Activity className="w-6 h-6 text-donor mt-0.5 flex-shrink-0" />
                                <div>
                                    <h4 className="font-bold text-white mb-1">Transfusion Infusion Rate</h4>
                                    <p className="text-text-muted text-sm font-medium">The donated blood is pushed through an IV line into the patient over 1 to 4 hours. Doctors highly monitor the first 15 minutes for adverse allergic reactions.</p>
                                </div>
                            </li>
                        </ul>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-4 p-4 rounded-xl bg-surface-2 border border-white/5 transition-all hover:bg-white/5">
                                <HeartPulse className="w-6 h-6 text-donor mt-0.5 flex-shrink-0" />
                                <div>
                                    <h4 className="font-bold text-white mb-1">Vital Stabilizations</h4>
                                    <p className="text-text-muted text-sm font-medium">Once the blood enters the receiver&apos;s body, the extra volume immediately raises blood pressure and restores crucial oxygen capacities in their struggling organs.</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </section>

                <div className="flex justify-center pt-8">
                     <Link href="/guidelines" className="bg-surface-2 text-white border border-white/10 font-black uppercase tracking-wider py-5 px-10 rounded-xl text-sm transition-all transform hover:scale-105 hover:bg-white/5 active:scale-95 text-center flex items-center gap-3">
                         Study Blood Group Matchings
                    </Link>
                </div>
            </div>
        </div>
    );
}
