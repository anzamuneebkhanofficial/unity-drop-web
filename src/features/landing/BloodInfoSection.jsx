/** @format */
'use client';

import { useState } from 'react';
import { Droplet, ArrowRight, ArrowLeft, Info, HelpCircle } from 'lucide-react';
const bloodTypes = [
    {
        type: "O+",
        label: "Most Common",
        rarity: "38% of population",
        canDonateTo: ["O+", "A+", "B+", "AB+"],
        canReceiveFrom: ["O-", "O+"],
        note: "Most common blood type worldwide. In high demand by hospitals every day.",
        badge: "common",
    },
    {
        type: "O-",
        label: "Universal Donor",
        rarity: "Only 7% of population",
        canDonateTo: ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"],
        canReceiveFrom: ["O-"],
        note: "Can donate to ALL 8 blood types. First to run out in emergencies. Most critical type to donate.",
        badge: "universal-donor",
    },
    {
        type: "A+",
        label: "Very Common",
        rarity: "~33% of population",
        canDonateTo: ["A+", "AB+"],
        canReceiveFrom: ["O-", "O+", "A-", "A+"],
        note: "1 in 3 people have this type. Platelets from A+ are in high demand for chemotherapy patients.",
        badge: "common",
    },
    {
        type: "A-",
        label: "Rare",
        rarity: "~1 in 16 people (6%)",
        canDonateTo: ["A-", "A+", "AB-", "AB+"],
        canReceiveFrom: ["O-", "A-"],
        note: "Can donate to all A and AB types regardless of positive or negative. Rare and valuable.",
        badge: "rare",
    },
    {
        type: "B+",
        label: "Uncommon",
        rarity: "~9% of population",
        canDonateTo: ["B+", "AB+"],
        canReceiveFrom: ["O-", "O+", "B-", "B+"],
        note: "More prevalent in South Asian and African-American populations.",
        badge: "common",
    },
    {
        type: "B-",
        label: "Very Rare",
        rarity: "Less than 2% of population",
        canDonateTo: ["B-", "B+", "AB-", "AB+"],
        canReceiveFrom: ["O-", "B-"],
        note: "One of the rarest types. Both B- and O- are the only sources for B- patients.",
        badge: "rare",
    },
    {
        type: "AB+",
        label: "Universal Recipient",
        rarity: "Less than 4% of population",
        canDonateTo: ["AB+"],
        canReceiveFrom: ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"],
        note: "Can receive from ALL 8 blood types. But can only donate red cells to AB+ patients.",
        badge: "universal-recipient",
    },
    {
        type: "AB-",
        label: "Rarest Type",
        rarity: "Less than 1% of population",
        canDonateTo: ["AB-", "AB+"],
        canReceiveFrom: ["O-", "A-", "B-", "AB-"],
        note: "Rarest of all 8 types. Also the universal plasma donor — AB plasma can go to any blood type.",
        badge: "rare",
    },
];

const BloodInfoSection = () => {
    const [selectedType, setSelectedType] = useState('O-');

    const activeData = bloodTypes.find(t => t.type === selectedType) || bloodTypes[0];

    const getBadgeStyles = (badge) => {
        switch (badge) {
            case 'universal-donor':
                return 'bg-green-500/10 text-green-400 border-green-500/25';
            case 'universal-recipient':
                return 'bg-highlight/10 text-highlight border-highlight/25';
            case 'rare':
                return 'bg-donor/10 text-donor border-donor/25';
            default:
                return 'bg-white/5 text-text-muted border-white/10';
        }
    };

    return (
        <section id="blood-info" className="py-32 bg-bg relative overflow-hidden">

            <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[800px] h-[500px] bg-[radial-gradient(circle_at_center,rgba(var(--donor-hex),0.02),transparent_70%)] blur-3xl pointer-events-none"></div>
            <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[800px] h-[500px] bg-[radial-gradient(circle_at_center,rgba(var(--highlight-hex),0.02),transparent_70%)] blur-3xl pointer-events-none"></div>

            <div className="container mx-auto px-6 relative z-10 w-full max-w-[2000px]">
                <div className="text-center mb-24 max-w-3xl mx-auto space-y-4">
                    <span className="text-highlight font-black tracking-[0.4em] uppercase text-xs block opacity-80 italic">Compatibility Matrix</span>
                    <h2 className="text-4xl md:text-5xl font-black text-white italic tracking-tighter uppercase leading-none">
                        Interactive <span className="text-donor">Blood Matrix</span>
                    </h2>
                    <p className="text-lg text-text-muted mt-6 font-medium leading-relaxed">
                        Knowing your compatibility rules is critical in save life emergencies. Select any blood type below to explore its live donation potential, rarity profile, and receiving channels.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch max-w-[1400px] mx-auto">

                    <div className="lg:col-span-5 flex flex-col justify-between">
                        <div className="grid grid-cols-4 gap-4 w-full">
                            {bloodTypes.map((bt) => {
                                const isActive = bt.type === selectedType;
                                return (
                                    <button
                                        key={bt.type}
                                        onClick={() => setSelectedType(bt.type)}
                                        className={`relative group rounded-2xl p-6 border transition-all duration-300 flex flex-col items-center justify-center gap-2 aspect-square cursor-pointer active:scale-95 ${isActive
                                            ? 'bg-donor border-donor shadow-[0_0_30px_rgba(var(--donor-hex),0.3)] text-white'
                                            : 'bg-surface/40 hover:bg-surface border-white/5 hover:border-donor/30 text-text-muted hover:text-white'
                                            }`}
                                    >
                                        <span className="text-3xl font-black italic tracking-tighter leading-none">{bt.type}</span>
                                        <span className={`text-[8px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded border text-center ${isActive ? 'bg-white/10 border-white/20 text-white' : getBadgeStyles(bt.badge)
                                            }`}>
                                            {bt.type === 'O-' ? 'Donor' : bt.type === 'AB+' ? 'Recipient' : bt.badge}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                        <div className="mt-8 bg-surface/30 backdrop-blur-md rounded-3xl p-8 border border-white/5 space-y-4">
                            <h4 className="text-xs font-black uppercase tracking-[0.3em] text-highlight flex items-center gap-2">
                                <HelpCircle className="w-4 h-4" /> Quick Eligibility Rule
                            </h4>
                            <p className="text-xs text-text-dim leading-relaxed font-medium">
                                Active donors must weigh at least 50kg, be between 18–65 years of age, and test clean of transmissible diseases. Whole blood donations can be completed safely every 8 weeks (56 days) to allow iron levels to safely recover.
                            </p>
                        </div>
                    </div>

                    <div className="lg:col-span-7 bg-surface/40 backdrop-blur-2xl rounded-[2.5rem] border border-white/5 p-8 md:p-12 relative flex flex-col justify-between overflow-hidden shadow-2xl">
                        <div className="absolute -top-32 -right-32 w-96 h-96 bg-donor/5 rounded-full blur-3xl pointer-events-none"></div>

                        <div className="space-y-8 relative z-10">

                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/5">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-3">
                                        <span className="text-6xl font-black text-white italic tracking-tighter leading-none">{activeData.type}</span>
                                        <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest border ${getBadgeStyles(activeData.badge)}`}>
                                            {activeData.label}
                                        </span>
                                    </div>
                                    <p className="text-sm font-black uppercase tracking-widest text-text-dim">
                                        Rarity: <span className="text-white italic">{activeData.rarity}</span>
                                    </p>
                                </div>
                                <div className="w-16 h-16 rounded-2xl bg-donor/10 flex items-center justify-center border border-donor/20 shadow-inner">
                                    <Droplet className="w-8 h-8 text-donor animate-pulse" />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                                <div className="space-y-4">
                                    <h4 className="text-xs font-black uppercase tracking-[0.2em] text-highlight flex items-center gap-2">
                                        <ArrowRight className="w-4 h-4 text-highlight" /> Can Donate To
                                    </h4>
                                    <div className="flex flex-wrap gap-2.5">
                                        {activeData.canDonateTo.map((t) => (
                                            <span
                                                key={t}
                                                className="px-4 py-2 bg-donor/5 hover:bg-donor/10 border border-donor/10 text-white font-bold rounded-xl text-sm transition-colors cursor-default"
                                            >
                                                {t}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <h4 className="text-xs font-black uppercase tracking-[0.2em] text-highlight flex items-center gap-2">
                                        <ArrowLeft className="w-4 h-4 text-highlight" /> Can Receive From
                                    </h4>
                                    <div className="flex flex-wrap gap-2.5">
                                        {activeData.canReceiveFrom.map((t) => (
                                            <span
                                                key={t}
                                                className="px-4 py-2 bg-highlight/5 hover:bg-highlight/10 border border-highlight/10 text-white font-bold rounded-xl text-sm transition-colors cursor-default"
                                            >
                                                {t}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="bg-bg/40 border border-white/5 rounded-2xl p-6 flex gap-4 items-start">
                                <Info className="w-5 h-5 text-donor shrink-0 mt-0.5" />
                                <div className="space-y-1">
                                    <h5 className="text-xs font-black uppercase tracking-wider text-white">Clinical Profile Note</h5>
                                    <p className="text-sm text-text-muted leading-relaxed font-medium">{activeData.note}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default BloodInfoSection;
