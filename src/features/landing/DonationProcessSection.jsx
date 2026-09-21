/** @format */
import { Stethoscope, Droplet, HeartPulse } from 'lucide-react';

const DonationProcessSection = () => {
  return (
    <section id="process" className="py-32 bg-surface relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(var(--highlight-hex),0.02),transparent_70%)] pointer-events-none"></div>
      <div className="container mx-auto px-6 relative z-10 max-w-7xl">
        <div className="text-center mb-20 max-w-3xl mx-auto space-y-4">
          <span className="text-highlight font-semibold tracking-wider uppercase text-xs block">
            Connecting Lives
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight leading-tight">
            How <span className="text-donor">Donation</span> Works
          </h2>
          <p className="text-lg text-text-dim mt-4">
            Our platform makes blood matching simple, safe, and direct. Follow
            these steps to participate in our saving network.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative max-w-5xl mx-auto">
          <div className="relative group bg-bg p-8 rounded-2xl transition-all duration-300 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-surface-2 flex items-center justify-center mb-6 shadow-sm group-hover:bg-surface-3 transition-colors">
              <Stethoscope className="w-6 h-6 text-donor" />
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight mb-3 group-hover:text-highlight transition-colors">
              1. Health & Safety First
            </h3>
            <p className="text-text-muted text-sm leading-relaxed mb-2">
              Before registering, ensure you are in good health, smoke-free, and
              tested clean of any active blood diseases. Maintaining pristine
              health standards is vital to guarantee that your gift of life is
              safe for the patient.
            </p>
          </div>

          <div className="relative group bg-bg p-8 rounded-2xl transition-all duration-300 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-surface-2 flex items-center justify-center mb-6 shadow-sm group-hover:bg-surface-3 transition-colors">
              <Droplet className="w-6 h-6 text-highlight" />
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight mb-3 group-hover:text-highlight transition-colors">
              2. Declare Your Profile
            </h3>
            <p className="text-text-muted text-sm leading-relaxed mb-2">
              Register securely as an active donor and list your specific blood
              group. By declaring your availability and location, your profile
              becomes searchable and ready for patients requiring immediate
              compatibility matches.
            </p>
          </div>

          <div className="relative group bg-bg p-8 rounded-2xl transition-all duration-300 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-surface-2 flex items-center justify-center mb-6 shadow-sm group-hover:bg-surface-3 transition-colors">
              <HeartPulse className="w-6 h-6 text-donor" />
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight mb-3 group-hover:text-highlight transition-colors">
              3. Patient Request & Match
            </h3>
            <p className="text-text-muted text-sm leading-relaxed mb-2">
              When a patient in urgent need identifies you as a compatible
              match, they will contact you directly through our platform. Once
              you accept the request, you can coordinate the donation location
              and save a life!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DonationProcessSection;
