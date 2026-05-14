/** @format */


// We might need to ensure Accordion exists in components/ui, otherwise we can build a simple one.
// Checking file listing earlier, I didn't see accordion.jsx. 
// I will implement a custom simple accordion here to avoid dependency issues if the shadcn component is missing.
// Actually, let's just make a simple one with state or standard details/summary element for simplicity and robustness without verifying every UI component.

const FAQSection = () => {
    const faqs = [
        {
            question: "Is blood donation safe?",
            answer: "Yes, it is completely safe. We ensure all donors are verified and the process follows strict medical guidelines using sterile equipment."
        },
        {
            question: "Who can become a donor?",
            answer: "Anyone aged 18-65, weighing at least 50kg, and in good health can donate. Specific medical conditions may apply."
        },
        {
            question: "How long does the process take?",
            answer: "The actual donation takes about 10-15 minutes, but the entire process (registration, screening, refreshment) takes about 45 minutes."
        },
        {
            question: "Does it cost anything?",
            answer: "No, our platform is 100% free for both donors and patients. We are a non-profit initiative."
        }
    ];

    return (
        <section id="faq" className="bg-bg py-32 border-t border-white/5 relative overflow-hidden">
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-highlight/5 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="container mx-auto px-6 max-w-4xl relative z-10">
                <div className="text-center mb-24 space-y-4">
                    <span className="text-highlight font-black tracking-[0.4em] uppercase text-xs block opacity-80 italic">Information Hub</span>
                    <h2 className="text-4xl md:text-5xl font-black text-white italic tracking-tighter uppercase">
                        Protocol <span className="text-donor">FAQs</span>
                    </h2>
                </div>

                <div className="space-y-6">
                    {faqs.map((faq, index) => (
                        <div key={index} className="bg-surface/40 backdrop-blur-xl border border-white/5 rounded-[2rem] overflow-hidden transition-all hover:border-highlight/30 group shadow-lg">
                            <details className="group/details">
                                <summary className="flex justify-between items-center font-black cursor-pointer list-none p-8 text-white text-lg focus:outline-none uppercase tracking-tight italic">
                                    <span>{faq.question}</span>
                                    <span className="transition-transform duration-500 group-open/details:rotate-180 bg-white/5 p-2 rounded-xl group-hover/details:bg-highlight group-hover/details:text-black transition-colors">
                                        <svg fill="none" height="20" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="20"><path d="M6 9l6 6 6-6"></path></svg>
                                    </span>
                                </summary>
                                <div className="text-text-muted mt-0 px-8 pb-8 leading-relaxed font-medium text-base animate-in fade-in slide-in-from-top-2 duration-500">
                                    {faq.answer}
                                </div>
                            </details>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FAQSection;
