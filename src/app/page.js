/** @format */
// 💡 INDUSTRY STANDARD: Keeping Route entry point clean.
// The actual Page Layout and logic is structurally isolated inside the features/landing domain.
import LandingPage from '@/features/landing/components/LandingPage';

export default function Home() {
  return <LandingPage />;
}
