/** @format */
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram, GraduationCap } from 'lucide-react';

const ContactSection = () => {
    return (
        <section id="contact" className="py-32 bg-surface relative break-words border-t border-white/5">
            <div className="container mx-auto px-6 max-w-7xl relative z-10">
                <div className="text-center mb-24 space-y-4 max-w-3xl mx-auto">
                    <span className="text-donor font-black tracking-[0.4em] uppercase text-xs block opacity-80 italic">Get In Touch</span>
                    <h2 className="text-4xl md:text-5xl font-black text-white italic tracking-tighter uppercase leading-none">
                        Our <span className="text-highlight">Contact</span> Information
                    </h2>
                    <p className="text-lg text-text-muted mt-6 font-medium">
                        Need help or have questions regarding Unity Drop? Read the information about the developer and get in touch with us at any time.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">
                    {/* Contact Info Developer */}
                    <div className="space-y-12 h-full flex flex-col justify-center">
                        <div className="flex gap-6 items-start">
                            <div className="bg-donor/10 p-5 rounded-2xl flex-shrink-0">
                                <GraduationCap className="w-8 h-8 text-donor" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase mb-2">Development Lead</h3>
                                <p className="text-text-muted font-medium leading-relaxed mb-4">
                                    Developed as a <span className="text-white">Final Year Design Project (FYDP)</span> under the supervision of <span className="text-white">Ms. Natasha Akram</span>.
                                </p>
                                <div className="space-y-1">
                                    <p className="font-bold text-white text-lg">Muhammad Anza Muneeb Khan (084598)</p>
                                    <p className="text-text-muted text-sm font-medium">Bachelor of Science in Information Technology</p>
                                    <p className="text-text-muted text-sm font-medium">Govt. M.A.O. Graduate College, Lahore</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-8">
                            <div className="flex flex-col gap-3 group">
                                <div className="bg-surface-2 w-14 h-14 rounded-2xl border border-white/10 flex flex-col items-center justify-center transition-colors group-hover:bg-donor/10 group-hover:border-donor/30">
                                    <Mail className="w-6 h-6 text-text-muted group-hover:text-donor transition-colors" />
                                </div>
                                <h4 className="text-white font-black italic uppercase tracking-wider text-lg">Email Us</h4>
                                <a href="mailto:support@unitydrop.com" className="text-text-muted hover:text-white transition-colors text-sm font-medium">anzamkhan396@gmail.com</a>
                            </div>

                            <div className="flex flex-col gap-3 group">
                                <div className="bg-surface-2 w-14 h-14 rounded-2xl border border-white/10 flex flex-col items-center justify-center transition-colors group-hover:bg-highlight/10 group-hover:border-highlight/30">
                                    <MapPin className="w-6 h-6 text-text-muted group-hover:text-highlight transition-colors" />
                                </div>
                                <h4 className="text-white font-black italic uppercase tracking-wider text-lg">Visit Us</h4>
                                <p className="text-text-muted text-sm font-medium">Lahore, Pakistan<br />Govt. M.A.O. Graduate College</p>
                            </div>
                        </div>
                    </div>

                    {/* Socials & Interactive Box */}
                    <div className="bg-bg p-10 md:p-14 rounded-[3rem] border border-white/5 relative overflow-hidden shadow-2xl flex flex-col justify-center">
                        <div className="absolute top-0 right-0 p-32 bg-[radial-gradient(circle_at_top_right,rgba(var(--highlight-hex),0.05),transparent)] rounded-full blur-3xl pointer-events-none"></div>

                        <h3 className="text-3xl font-black text-white italic tracking-tighter uppercase mb-6 z-10">Follow the Project</h3>
                        <p className="text-text-muted font-medium mb-10 z-10">
                            We are building this platform to serve humanity and save lives. Follow our progress on social media or reach out directly for volunteer opportunities.
                        </p>

                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 z-10">
                            <a href="#" className="flex flex-col items-center justify-center gap-3 bg-surface border border-white/5 p-6 rounded-2xl hover:border-donor/50 hover:bg-donor/5 transition-all duration-300 group shadow-lg">
                                <Facebook className="w-8 h-8 text-text-muted group-hover:text-donor transition-colors" />
                                <span className="text-xs font-bold text-white uppercase tracking-wider">Facebook</span>
                            </a>
                            <a href="#" className="flex flex-col items-center justify-center gap-3 bg-surface border border-white/5 p-6 rounded-2xl hover:border-highlight/40 hover:bg-highlight/5 transition-all duration-300 group shadow-lg">
                                <Twitter className="w-8 h-8 text-text-muted group-hover:text-highlight transition-colors" />
                                <span className="text-xs font-bold text-white uppercase tracking-wider">X / Twitter</span>
                            </a>
                            <a href="#" className="flex flex-col items-center justify-center gap-3 bg-surface border border-white/5 p-6 rounded-2xl hover:border-[#0a66c2]/50 hover:bg-[#0a66c2]/5 transition-all duration-300 group shadow-lg">
                                <Linkedin className="w-8 h-8 text-text-muted group-hover:text-[#0a66c2] transition-colors" />
                                <span className="text-xs font-bold text-white uppercase tracking-wider">LinkedIn</span>
                            </a>
                            <a href="#" className="flex flex-col items-center justify-center gap-3 bg-surface border border-white/5 p-6 rounded-2xl hover:border-[#E1306C]/50 hover:bg-[#E1306C]/5 transition-all duration-300 group shadow-lg">
                                <Instagram className="w-8 h-8 text-text-muted group-hover:text-[#E1306C] transition-colors" />
                                <span className="text-xs font-bold text-white uppercase tracking-wider">Instagram</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ContactSection;
