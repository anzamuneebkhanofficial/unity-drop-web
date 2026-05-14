/** @format */
import Header from '../Header';
import HeroSection from '../HeroSection';
import StatsBar from '../StatsBar';
import FeaturesSection from '../FeaturesSection';
import HowItWorksSection from '../HowItWorksSection';
import DonationProcessSection from '../DonationProcessSection';
import FAQSection from '../FAQSection';
import BloodInfoSection from '../BloodInfoSection';
import ContactSection from '../ContactSection';
import Footer from '../Footer';
import DesktopPreferenceNotice from '@/components/common/DesktopPreferenceNotice';

export default function LandingPage() {
  return (
    <div className="bg-bg min-h-screen font-sans selection:bg-highlight selection:text-black flex flex-col items-center w-full overflow-x-hidden">
      <Header />
      <main className="w-full flex-1">
        <DesktopPreferenceNotice />
        <HeroSection />
        <StatsBar />
        <FeaturesSection />
        <HowItWorksSection />
        <DonationProcessSection />
        <BloodInfoSection />
        <FAQSection /> 
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
