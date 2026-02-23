import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  ShieldCheck,
  Users,
  Zap,
  ArrowRight,
  LogIn,
  Palette,
  Smile,
  BarChart3,
  CheckCircle2,
} from 'lucide-react';
import Image from 'next/image';
import FaqSection from '@/components/public/FaqSection';

export default function JoinPage() {
  return (
    <div className='min-h-screen bg-gray-50 flex flex-col'>
      {/* 1. HERO SECTION WITH CLIP-PATH */}
      <div className='relative bg-blue-900 text-white overflow-hidden pb-24 lg:pb-32'>
        {/* Background Image with Overlay */}
        <div className='absolute inset-0 z-0'>
          <Image
            src='/img3.jpg' // <--- Your file inside public/ folder
            alt='Background'
            fill // Makes it cover the parent div
            className='object-cover'
            priority // Loads it immediately since it's above the fold
          />
          <div className='absolute inset-0 bg-gradient-to-b from-blue-900/80 to-blue-800/80 backdrop-blur-0 mix-blend-multiply' />
        </div>

        {/* Diagonal Cut Design */}
        <div
          className='absolute bottom-0 left-0 w-full h-24 bg-gray-50 z-10'
          style={{ clipPath: 'polygon(0 100%, 100% 100%, 100% 0)' }}
        />

        {/* Content */}
        <div className='relative z-20 max-w-5xl mx-auto px-6 pt-20 text-center'>
          <h1 className='text-4xl md:text-6xl font-extrabold tracking-tight mb-6'>
            Join the Future of <br className='hidden md:block' /> Phone Trading
          </h1>
          <p className='text-blue-100 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed'>
            Whether you are looking for your dream phone or running a gadget
            business, PhoneMarket creates a safe, verified connection between
            buyers and sellers.
          </p>

          {/* SPLIT ACTION BUTTONS */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto'>
            {/* 1. VISITOR / BUYER */}
            <div className='bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-2xl hover:bg-white/20 transition-all group cursor-pointer text-left'>
              <div className='bg-blue-500 w-12 h-12 rounded-full flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform'>
                <Users className='text-white h-6 w-6' />
              </div>
              <h3 className='text-2xl font-bold mb-2'>I want to Buy</h3>
              <p className='text-blue-100 text-sm mb-6'>
                Create a free account to follow shops, save items, and get deal
                alerts.
              </p>
              <Link href='/signup'>
                <Button className='w-full bg-white text-blue-900 hover:bg-blue-50 font-bold'>
                  Create Buyer Account
                </Button>
              </Link>
            </div>

            {/* 2. DEALER / SELLER */}
            <div className='bg-gradient-to-br from-yellow-500/20 to-orange-500/20 backdrop-blur-md border border-yellow-500/30 p-8 rounded-2xl hover:border-yellow-400 transition-all group cursor-pointer text-left'>
              <div className='bg-yellow-500 w-12 h-12 rounded-full flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform'>
                <Zap className='text-white h-6 w-6' />
              </div>
              <h3 className='text-2xl font-bold mb-2 text-yellow-100'>
                I want to Sell
              </h3>
              <p className='text-yellow-100/80 text-sm mb-6'>
                Open your shop, get verified, and reach thousands of customers
                daily.
              </p>
              <Link href='/register'>
                <Button className='w-full bg-yellow-500 text-black hover:bg-yellow-400 font-bold border-none'>
                  Become a Dealer
                </Button>
              </Link>
            </div>
          </div>

          <div className='mt-10 text-sm text-blue-200'>
            Already have an account?
            <Link
              href='/login'
              className='text-white font-bold hover:underline ml-2 inline-flex items-center'
            >
              Login here <ArrowRight className='ml-1 h-3 w-3' />
            </Link>
          </div>
        </div>
      </div>

      {/* 2. SECURITY & TRUST INFO */}
      <div className='max-w-6xl mx-auto px-6 py-20'>
        <div className='text-center mb-16'>
          <h2 className='text-3xl font-bold text-gray-900'>
            Why choose PhoneMarket?
          </h2>
          <p className='text-gray-500 mt-2'>
            Built for trust, speed, and convenience.
          </p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          <FeatureCard
            icon={<Smile className='h-10 w-10 text-yellow-600' />}
            title='User Friendly'
            desc='Manage your inventory with ease. Our dashboard is designed for simplicity—post a phone in less than 30 seconds.'
          />

          <FeatureCard
            icon={<Palette className='h-10 w-10 text-pink-600' />}
            title='Custom Branding'
            desc='Make your shop unique. Upload your own banner, logo, and choose a brand color that matches your identity.'
          />

          <FeatureCard
            icon={<ShieldCheck className='h-10 w-10 text-green-600' />}
            title='Verified Dealers'
            desc='We strictly verify dealers with ID checks and business registration to ensure you never get scammed.'
          />

          <FeatureCard
            icon={<Users className='h-10 w-10 text-blue-600' />}
            title='Direct Connection'
            desc='Chat directly with shop owners via WhatsApp or Call. No middlemen fees, no hidden charges.'
          />

          <FeatureCard
            icon={<Zap className='h-10 w-10 text-purple-600' />}
            title='Fast & Local'
            desc='Find phones available right now in your city. See the shop location and pick it up today.'
          />

          <FeatureCard
            icon={<BarChart3 className='h-10 w-10 text-blue-600' />}
            title='Smart Analytics'
            desc='Track your performance. See exactly how many people view your profile and click your contact buttons in real-time.'
          />
        </div>
      </div>

      {/* 3. ABOUT US SECTION */}
      <section className='py-24 bg-white relative overflow-hidden'>
        {/* Decorative Background Blob (Soft Gradient) */}
        <div className='absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-50 z-0' />

        <div className='max-w-7xl mx-auto px-6 relative z-10'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-16 items-center'>
            {/* LEFT: TEXT CONTENT */}
            <div>
              <div className='inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-bold mb-6'>
                <span className='relative flex h-2 w-2'>
                  <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75'></span>
                  <span className='relative inline-flex rounded-full h-2 w-2 bg-blue-500'></span>
                </span>
                Our Mission
              </div>

              <h2 className='text-4xl font-extrabold text-gray-900 mb-6 leading-tight'>
                Bridging the gap between <br />
                <span className='text-blue-600'>Trust</span> and{' '}
                <span className='text-blue-600'>Technology</span>.
              </h2>

              <p className='text-lg text-gray-600 mb-6 leading-relaxed'>
                Buying a phone shouldn't be a gamble. We started PhoneMarket to
                eliminate the stress of scams, fake devices, and unreliable
                meetups.
              </p>
              <p className='text-gray-600 mb-8 leading-relaxed'>
                By verifying every dealer and providing a transparent platform,
                we empower small businesses to grow and give buyers the peace of
                mind they deserve.
              </p>

              {/* Checklist */}
              <div className='space-y-4'>
                {[
                  '100% Verified Dealer Identity',
                  'Safe & Transparent Transactions',
                  'Direct Access to Shop Owners',
                  'Community-Driven Reviews',
                ].map((item, i) => (
                  <div key={i} className='flex items-center gap-3'>
                    <CheckCircle2 className='text-green-500 h-5 w-5 flex-shrink-0' />
                    <span className='font-medium text-gray-700'>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT: IMAGE COLLAGE */}
            <div className='relative h-[500px] w-full'>
              {/* Image 1 (Back) */}
              <div className='absolute top-0 right-0 w-3/4 h-3/4 rounded-2xl overflow-hidden shadow-2xl border-4 border-white rotate-3 hover:rotate-0 transition-transform duration-500 ease-out cursor-pointer'>
                {/* Replace src with your local image: /about-1.jpg */}
                <img
                  src='https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80'
                  alt='Happy Customer'
                  className='w-full h-full object-cover'
                />
              </div>

              {/* Image 2 (Front) */}
              <div className='absolute bottom-0 left-0 w-3/5 h-3/5 rounded-2xl overflow-hidden shadow-2xl border-4 border-white -rotate-2 hover:rotate-0 transition-transform duration-500 ease-out z-10 cursor-pointer'>
                {/* Replace src with your local image: /about-2.jpg */}
                <img
                  src='https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80'
                  alt='Team Working'
                  className='w-full h-full object-cover'
                />
              </div>

              {/* Floating Stat Card */}
              <div className='absolute top-1/2 left-10 -translate-y-1/2 bg-white p-4 rounded-xl shadow-xl z-20 animate-bounce-slow'>
                <div className='flex items-center gap-3'>
                  <div className='bg-orange-100 p-2 rounded-lg'>
                    <Users className='h-6 w-6 text-orange-600' />
                  </div>
                  <div>
                    <p className='text-xs text-gray-500 font-bold uppercase'>
                      Community
                    </p>
                    <p className='text-xl font-bold text-gray-900'>
                      10k+ Users
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <FaqSection />
    </div>
  );
}

// Helper Card
function FeatureCard({ icon, title, desc }: any) {
  return (
    <Card className='border-none shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-white group'>
      <CardContent className='p-8 text-center flex flex-col items-center'>
        <div className='mb-6 p-4 bg-gray-50 rounded-full group-hover:bg-blue-50 transition-colors'>
          {icon}
        </div>
        <h3 className='text-xl font-bold text-gray-900 mb-3'>{title}</h3>
        <p className='text-gray-500 leading-relaxed'>{desc}</p>
      </CardContent>
    </Card>
  );
}
