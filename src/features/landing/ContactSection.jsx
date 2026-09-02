/** @format */
import { Mail, MessageCircle, MapPin, Facebook, Twitter, Linkedin, Instagram, HeartPulse } from 'lucide-react';
const ContactSection = () => {
    return (
        <section id="contact" className="py-32 bg-surface relative break-words border-t border-white/5">
            <div className="container mx-auto px-6 max-w-7xl relative z-10">
                <div className="text-center mb-16 space-y-4 max-w-3xl mx-auto">
                    <span className="text-donor font-semibold tracking-wider uppercase text-xs block">Get In Touch</span>
                    <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight leading-tight">
                        Our <span className="text-highlight">Contact</span> Information
                    </h2>
                    <p className="text-lg text-text-dim mt-4">
                        Need help or have questions regarding Unity Drop? Reach out to our support team or browse our resources below. We are here to assist you 24/7.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">
                    <div className="space-y-12 h-full flex flex-col justify-center">
                        <div className="flex gap-6 items-start">
                            <div className="bg-donor/10 p-5 rounded-2xl flex-shrink-0">
                                <HeartPulse className="w-8 h-8 text-donor" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white tracking-tight mb-2">Our Life-Saving Mission</h3>
                                <p className="text-text-muted text-sm leading-relaxed mb-4">
                                    Unity Drop is dedicated to bridging the critical gap between voluntary blood donors and patients in urgent need.
                                </p>
                                <div className="space-y-1">
                                    <p className="font-semibold text-white text-base">Unity Drop platform</p>
                                    <p className="text-text-dim text-xs">24/7 Real-Time Notifications & Smart Matching</p>
                                    <p className="text-text-dim text-xs">100% Free, Secure & Confidential Channel</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            <div className="flex flex-col gap-3 group">
                                <div className="bg-surface-2 w-12 h-12 rounded-xl border border-white/10 flex flex-col items-center justify-center transition-colors group-hover:bg-donor/10 group-hover:border-donor/30">
                                    <Mail className="w-5 h-5 text-text-muted group-hover:text-donor transition-colors" />
                                </div>
                                <h4 className="text-white font-semibold tracking-wide text-sm">Email Us</h4>
                                <a href="mailto:support@unitydrop.com" className="text-text-dim hover:text-white transition-colors text-xs break-all">support@unitydrop.com</a>
                            </div>

                            <div className="flex flex-col gap-3 group">
                                <div className="bg-surface-2 w-12 h-12 rounded-xl border border-white/10 flex flex-col items-center justify-center transition-colors group-hover:bg-green-500/10 group-hover:border-green-500/30">
                                    <MessageCircle className="w-5 h-5 text-text-muted group-hover:text-green-400 transition-colors" />
                                </div>
                                <h4 className="text-white font-semibold tracking-wide text-sm">WhatsApp Support</h4>
                                <a href="https://wa.me/923001234567" target="_blank" rel="noopener noreferrer" className="text-text-dim hover:text-white transition-colors text-xs">+92 (300) 123-4567</a>
                            </div>

                            <div className="flex flex-col gap-3 group">
                                <div className="bg-surface-2 w-12 h-12 rounded-xl border border-white/10 flex flex-col items-center justify-center transition-colors group-hover:bg-highlight/10 group-hover:border-highlight/30">
                                    <MapPin className="w-5 h-5 text-text-muted group-hover:text-highlight transition-colors" />
                                </div>
                                <h4 className="text-white font-semibold tracking-wide text-sm">Visit Us</h4>
                                <p className="text-text-dim text-xs">Lahore, Pakistan</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-bg p-10 md:p-14 rounded-3xl border border-white/5 relative overflow-hidden flex flex-col justify-center">
                        <div className="absolute top-0 right-0 p-32 bg-[radial-gradient(circle_at_top_right,rgba(var(--highlight-hex),0.05),transparent)] rounded-full blur-3xl pointer-events-none"></div>

                        <h3 className="text-2xl font-bold text-white tracking-tight mb-4 z-10">Follow the Project</h3>
                        <p className="text-text-muted text-sm leading-relaxed mb-8 z-10">
                            We are building this platform to serve humanity and save lives. Follow our progress on social media or reach out directly for volunteer opportunities.
                        </p>

                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 z-10">
                            <a href="#" className="flex flex-col items-center justify-center gap-3 bg-surface border border-white/5 p-4 rounded-xl hover:border-donor/50 hover:bg-donor/5 transition-all duration-300 group">
                                <Facebook className="w-6 h-6 text-text-muted group-hover:text-donor transition-colors" />
                                <span className="text-[10px] font-semibold text-white uppercase tracking-wider">Facebook</span>
                            </a>
                            <a href="#" className="flex flex-col items-center justify-center gap-3 bg-surface border border-white/5 p-4 rounded-xl hover:border-highlight/40 hover:bg-highlight/5 transition-all duration-300 group">
                                <Twitter className="w-6 h-6 text-text-muted group-hover:text-highlight transition-colors" />
                                <span className="text-[10px] font-semibold text-white uppercase tracking-wider">X / Twitter</span>
                            </a>
                            <a href="#" className="flex flex-col items-center justify-center gap-3 bg-surface border border-white/5 p-4 rounded-xl hover:border-[#0a66c2]/50 hover:bg-[#0a66c2]/5 transition-all duration-300 group">
                                <Linkedin className="w-6 h-6 text-text-muted group-hover:text-[#0a66c2] transition-colors" />
                                <span className="text-[10px] font-semibold text-white uppercase tracking-wider">LinkedIn</span>
                            </a>
                            <a href="#" className="flex flex-col items-center justify-center gap-3 bg-surface border border-white/5 p-4 rounded-xl hover:border-[#E1306C]/50 hover:bg-[#E1306C]/5 transition-all duration-300 group">
                                <Instagram className="w-6 h-6 text-text-muted group-hover:text-[#E1306C] transition-colors" />
                                <span className="text-[10px] font-semibold text-white uppercase tracking-wider">Instagram</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ContactSection;
