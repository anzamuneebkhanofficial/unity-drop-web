/** @format */
import Link from 'next/link';
import { Heart } from 'lucide-react';

const Footer = () => {
    return (
        <footer id="contact" className="bg-[#050505] text-text-muted border-t border-white/5 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(var(--highlight-hex),0.02),transparent_70%)] pointer-events-none"></div>
            <div className="container mx-auto px-6 py-16 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                    <div className="md:col-span-1 space-y-4">
                        <Link href="/" className="flex items-center space-x-2 group w-fit">
                            <Heart className="w-7 h-7 text-donor group-hover:scale-110 transition-transform" />
                            <span className="text-xl font-black text-white italic tracking-tighter">UNITYDROP</span>
                        </Link>
                        <p className="text-sm leading-relaxed text-text-dim font-medium">
                            A professional digital platform dedicated to saving lives by
                            connecting blood donors and patients efficiently through technology.
                        </p>
                    </div>
                    <div className="space-y-4">
                        <h4 className="font-black text-white text-lg uppercase tracking-tight italic">Quick Links</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/donor/register" className="hover:text-highlight transition-colors flex items-center font-medium">
                                    Become a Donor
                                </Link>
                            </li>
                            <li>
                                <Link href="/patient/register" className="hover:text-highlight transition-colors flex items-center font-medium">
                                    Find Blood
                                </Link>
                            </li>
                            <li>
                                <Link href="/#features" className="hover:text-highlight transition-colors flex items-center font-medium">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link href="/#faq" className="hover:text-highlight transition-colors flex items-center font-medium">
                                    FAQs
                                </Link>
                            </li>
                            <li>
                                <Link href="/#contact" className="hover:text-highlight transition-colors flex items-center font-medium">
                                    Contact
                                </Link>
                            </li>
                            <li>
                                <Link href="/public-feedback" className="hover:text-highlight transition-colors flex items-center font-medium">
                                    System Feedback
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div className="space-y-4">
                        <h4 className="font-black text-white text-lg uppercase tracking-tight italic">Legal</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link href="#" className="hover:text-highlight transition-colors font-medium">
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-highlight transition-colors font-medium">
                                    Terms of Service
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div className="space-y-4">
                        <h4 className="font-black text-white text-lg uppercase tracking-tight italic">Support</h4>
                        <div className="space-y-1 text-sm text-text-dim font-medium">
                            <p>
                                <span className="text-white font-bold">WhatsApp:</span>{' '}
                                <a
                                    href="https://wa.me/923001234567"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-highlight transition-colors"
                                >
                                    +92 (300) 123-4567
                                </a>
                            </p>
                            <p><span className="text-white font-bold">Email:</span> support@unitydrop.com</p>
                            <p><span className="text-white font-bold">Office:</span> Lahore, Pakistan</p>
                        </div>
                    </div>
                </div>
                <div className="mt-12 border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center text-sm font-medium">
                    <p>
                        &copy; {new Date().getFullYear()} UnityDrop. All rights reserved.
                    </p>
                    <p className="mt-2 md:mt-0 flex items-center">
                        Made with <Heart className="w-3 h-3 text-donor mx-1 fill-current" /> for humanity
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
