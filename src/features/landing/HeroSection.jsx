/** @format */
import Link from 'next/link';
import { Users, Heart } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="bg-bg text-white relative overflow-hidden min-h-[90dvh] flex items-center justify-center">

      <div className="absolute top-0 left-1/4 w-[1000px] h-[700px] bg-donor/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[1000px] h-[700px] bg-highlight/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="container mx-auto px-6 py-32 relative z-10 flex flex-col items-center justify-center w-full max-w-5xl text-center">

        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-surface-2 border border-white/10 rounded-full text-xs font-semibold text-text-muted mb-8">
          <span className="w-2 h-2 rounded-full bg-donor"></span>
          Built to Save Lives
        </div>


        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight mb-6">
          Donate Blood. <br />
          <span className="text-donor">Save a Life</span> Today.
        </h1>


        <p className="text-lg md:text-xl text-text-dim max-w-2xl mx-auto leading-relaxed mb-10">
          Instantly connect patients with verified blood donors. No public phone
          numbers, 100% secure, and matched in under 60 seconds.
        </p>


        <div className="flex flex-col sm:flex-row justify-center gap-4 w-full sm:w-auto">
          <Link
            href="/patient/register"
            className="bg-highlight hover:bg-highlight/90 text-black font-semibold py-4 px-8 rounded-md transition-all min-w-[200px] shadow-sm"
          >
            Find a Donor
          </Link>
          <Link
            href="/donor/register"
            className="bg-surface-2 hover:bg-surface-3 text-white border border-white/10 font-semibold py-4 px-8 rounded-md transition-all min-w-[200px]"
          >
            Register as Donor
          </Link>
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl pt-10">
          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="text-3xl font-bold text-white">1,250+</div>
            <div className="text-sm font-medium text-text-dim">
              Live Connections
            </div>
          </div>
          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="text-3xl font-bold text-white">800+</div>
            <div className="text-sm font-medium text-text-dim">Lives Saved</div>
          </div>
          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="text-3xl font-bold text-white">&lt; 60s</div>
            <div className="text-sm font-medium text-text-dim">
              Average Match Time
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
