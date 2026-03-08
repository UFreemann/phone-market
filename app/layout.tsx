import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/sonner';
import AuthProvider from '@/components/providers/AuthProvider';
import Navbar from '@/components/public/Navbar';
import Footer from '@/components/public/Footer';
import ScrollToTop from '@/components/ui/ScrollToTop';
import MobileNav from '@/components/public/MobileNav';

export const dynamic = 'force-dynamic';

// Load Fonts
const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

// SEO Metadata
export const metadata: Metadata = {
  title: {
    template: '%s | PhoneMarket',
    default: 'PhoneMarket - Buy & Sell Phones',
  },
  description:
    'The trusted marketplace for verified phone dealers. Buy iPhones, Samsungs, and more directly from shop owners.',
  icons: {
    icon: '/favicon.ico', // Ensure you have an icon in public/ folder
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 text-slate-900 font-sans`}
      >
        <AuthProvider>
          {/* Global Navbar (Handles Logic to hide itself on /dashboard) */}
          <Navbar />

          {/* Main Content Area */}
          {/* pt-20 ensures content isn't hidden behind the fixed Navbar */}
          <main className='min-h-screen'>{children}</main>

          <Footer />
          <MobileNav />

          <ScrollToTop />

          {/* Toast Notifications (Bottom Right) */}
          <Toaster position='top-right' richColors closeButton />
        </AuthProvider>
      </body>
    </html>
  );
}
