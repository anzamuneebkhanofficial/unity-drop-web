/** @format */

import './globals.css';
import GlobalProviders from '@/components/providers/GlobalProviders';

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export const metadata = {
  title: {
    default: 'UnityDrop - Advanced Blood Donation Platform',
    template: '%s | UnityDrop',
  },
  description:
    'UnityDrop connects blood donors with patients in real-time. Join the network saving lives across the community.',
  keywords: ['blood donation', 'donor', 'hospital', 'save lives', 'health', 'network'],
  authors: [{ name: 'UnityDrop Team' }],
  creator: 'UnityDrop',
  publisher: 'UnityDrop Inc.',
  metadataBase: new URL(baseUrl),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'UnityDrop - Save Lives Today',
    description: 'The most advanced real-time blood donation network.',
    url: baseUrl,
    siteName: 'UnityDrop',
    images: [
      {
        url: '/meta/og-image.png',
        width: 1200,
        height: 630,
        alt: 'UnityDrop Platform Preview',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'UnityDrop',
    description: 'Real-time blood donation network.',
    images: ['/meta/twitter-card.png'],
    creator: '@unitydrop',
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/icons/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'UnityDrop',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#fdc700',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col overflow-x-hidden max-w-full antialiased">
        <GlobalProviders>
          <main className="w-full h-full flex-1">
            {children}
          </main>
        </GlobalProviders>
      </body>
    </html>
  );
}