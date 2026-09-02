
const faqs = [
    {
        question: "Is my personal contact and health information secure on Unity Drop?",
        answer:
            "Yes, completely. Unity Drop never shares your personal data with third parties. Your contact details are only revealed to a donor or patient after a mutual request is accepted. All data is encrypted and stored securely. You are in full control of your information at all times.",
    },
    {
        question: "How does the system match and notify donors when a patient sends a request?",
        answer:
            "When a patient submits a blood request, our system automatically identifies donors with a compatible blood type. Those donors receive an instant email notification with the request details. The donor can then choose to accept or decline — no pressure, no obligation. The patient is updated in real-time on any response.",
    },
    {
        question: "How does blood compatibility work, and which blood types are rare or hard to find?",
        answer:
            "Blood compatibility is based on your ABO group and Rh factor. O− is the universal donor (can give to everyone) and AB+ is the universal recipient (can receive from everyone). The rarest types are AB− (less than 1% of people), B− (less than 2%), and A− (about 6%). If you have a rare type, your registration on Unity Drop is especially valuable — you could be the only match for a patient in your area.",
    },
    {
        question: "Is there any fee or cost to use the Unity Drop platform?",
        answer:
            "No. Unity Drop is completely free for both donors and patients. There are no registration fees, no charges for sending or receiving requests, and no hidden costs. Our only goal is to connect people and save lives.",
    },
    {
        question: "How often can I safely donate blood, and who is eligible to register as a donor?",
        answer:
            "Anyone aged 18–65, weighing at least 50kg, and in good general health can register as a donor. Men can donate safely every 3 months, and women every 4 months. Unity Drop does not facilitate the physical donation — we connect you with the patient. The actual donation is coordinated between you and the patient or their hospital.",
    },
];

const FAQSection = () => {

    return (
        <section id="faq" className="bg-bg py-32 border-t border-white/5 relative overflow-hidden">
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-highlight/5 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="container mx-auto px-6 max-w-4xl relative z-10">
                <div className="text-center mb-16 space-y-4">
                    <span className="text-highlight font-semibold tracking-wider uppercase text-xs block">Information Hub</span>
                    <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight leading-tight">
                        Common <span className="text-donor">Questions</span>
                    </h2>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div key={index} className="bg-surface-2 border border-white/5 rounded-xl overflow-hidden transition-all hover:border-white/20 group">
                            <details className="group/details">
                                <summary className="flex justify-between items-center font-bold cursor-pointer list-none p-6 text-white text-lg focus:outline-none tracking-tight">
                                    <span>{faq.question}</span>
                                    <span className="transition-transform duration-300 group-open/details:rotate-180 text-text-dim group-hover/details:text-white">
                                        <svg fill="none" height="20" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="20"><path d="M6 9l6 6 6-6"></path></svg>
                                    </span>
                                </summary>
                                <div className="text-text-muted mt-0 px-6 pb-6 leading-relaxed text-sm animate-in fade-in slide-in-from-top-2 duration-300">
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
