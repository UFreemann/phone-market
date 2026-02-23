import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Store } from 'lucide-react';
import { getSiteSettings } from '@/actions/admin-settings';

export default async function SellerCTA() {
  const settings = await getSiteSettings();

  return (
    <section
      className='py-16 px-4 my-16 relative overflow-hidden shadow-sm'
      style={{
        background: `linear-gradient(to right, ${settings.ctaGradientFrom}, ${settings.ctaGradientTo})`,
      }}
    >
      {/* Subtle Pattern Overlay */}
      <div className='absolute inset-0 bg-black/10 mix-blend-overlay' />
      <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-10" />

      <div className='max-w-4xl mx-auto text-center text-white relative z-10'>
        {/* Icon Circle */}
        <div className='bg-white/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm shadow-inner ring-1 ring-white/20'>
          <Store size={32} className='text-white/90' />
        </div>

        {/* Title */}
        <h2 className='text-3xl md:text-4xl font-bold mb-4 drop-shadow-sm tracking-tight'>
          {settings.ctaTitle}
        </h2>

        {/* Subtitle + Highlight */}
        <div className='text-white/90 text-lg mb-8 max-w-2xl mx-auto leading-relaxed'>
          <p>{settings.ctaSubtitle}</p>

          {settings.ctaHighlightText && (
            <span
              className='font-bold block mt-1.5 text-xl tracking-wide drop-shadow-sm'
              style={{ color: settings.ctaHighlightColor }}
            >
              {settings.ctaHighlightText}
            </span>
          )}
        </div>

        {/* Buttons */}
        <div className='flex flex-col sm:flex-row justify-center gap-4'>
          <Link href={settings.btnPrimaryLink}>
            <Button
              size='lg'
              className='bg-white text-gray-900 hover:bg-gray-50 hover:scale-105 transition-all font-bold h-12 px-8 shadow-lg w-full sm:w-auto border-none'
            >
              {settings.btnPrimaryLabel}
            </Button>
          </Link>

          {settings.showSecondaryBtn && (
            <Link href={settings.btnSecondaryLink}>
              <Button
                size='lg'
                variant='outline'
                className='text-white border-white/40 hover:bg-white/10 hover:text-white h-12 px-8 w-full sm:w-auto backdrop-blur-sm transition-all'
              >
                {settings.btnSecondaryLabel}
              </Button>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
