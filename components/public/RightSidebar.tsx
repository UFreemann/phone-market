import Image from 'next/image';
import Link from 'next/link';
import { TrendingUp, Megaphone, Crown, ChevronRight } from 'lucide-react';
import { MdVerified } from 'react-icons/md';

type SidebarProps = {
  trending: any[];
  dealers: any[];
  settings: any;
};

export default function RightSidebar({
  trending,
  dealers,
  settings,
}: SidebarProps) {
  return (
    <aside className='hidden lg:block w-80 flex-shrink-0 space-y-6 sticky top-24'>
      {/* WIDGET 1: TRENDING PRODUCTS */}
      {trending.length > 0 && (
        <div className='bg-white rounded-xl border shadow-sm p-5'>
          <h3 className='font-bold text-lg text-gray-900 mb-4 flex items-center gap-2'>
            <TrendingUp className='text-orange-500' size={18} /> Trending Now
          </h3>
          <div className='space-y-4'>
            {trending.map((product, index) => (
              <Link
                key={product.id}
                href={`/phone/${product.id}`}
                className='flex items-center gap-3 group cursor-pointer'
              >
                {/* Rank Number */}
                <span
                  className={`text-xl font-black w-4 text-center transition-colors ${
                    index === 0
                      ? 'text-yellow-400'
                      : index === 1
                        ? 'text-gray-300'
                        : index === 2
                          ? 'text-orange-300'
                          : 'text-gray-200 group-hover:text-blue-500'
                  }`}
                >
                  {index + 1}
                </span>

                {/* Thumbnail */}
                <div className='h-12 w-12 bg-gray-100 rounded-md overflow-hidden flex-shrink-0 border border-gray-200 relative'>
                  {product.images[0] ? (
                    <Image
                      src={product.images[0]}
                      alt={product.title}
                      fill // Fills the 12x12 container
                      className='object-cover'
                      sizes='48px' // Optimization: Tells Next.js to load a tiny version
                    />
                  ) : (
                    <div className='w-full h-full bg-gray-200' />
                  )}
                </div>

                {/* Details */}
                <div className='flex-1 min-w-0'>
                  <p className='text-sm font-bold text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors'>
                    {product.title}
                  </p>
                  <p className='text-xs text-blue-600 font-bold'>
                    GH₵ {product.price.toLocaleString()}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* WIDGET 2: TOP DEALERS */}
      {dealers.length > 0 && (
        <div className='bg-gradient-to-br from-slate-900 to-blue-900 rounded-xl shadow-lg p-5 text-white'>
          <h3 className='font-bold text-lg mb-4 flex items-center gap-2'>
            <Crown className='text-yellow-400 fill-yellow-400' size={18} />{' '}
            Premium Sellers
          </h3>
          <div className='space-y-3'>
            {dealers.map((dealer) => (
              <Link
                key={dealer.id}
                href={`/shop/${dealer.id}`}
                className='flex items-center justify-between bg-white/10 p-2.5 rounded-lg hover:bg-white/20 transition-colors group'
              >
                <div className='flex items-center gap-3 overflow-hidden'>
                  <div className='h-8 w-8 bg-white rounded-full flex items-center justify-center text-blue-600 font-bold text-xs flex-shrink-0 overflow-hidden border border-white/20 relative'>
                    {dealer.image ? (
                      <Image
                        src={dealer.image}
                        alt={dealer.shopName}
                        fill
                        className='object-cover'
                        sizes='32px' // Tiny optimization
                      />
                    ) : (
                      dealer.shopName.charAt(0)
                    )}
                  </div>
                  <div className='flex flex-col min-w-0'>
                    <span className='text-sm font-medium truncate flex items-center gap-1'>
                      {dealer.shopName}
                      <>
                        {dealer.subscriptionTier === 'PLATINUM' && (
                          <MdVerified className='h-4 w-4 text-purple-500' />
                        )}

                        {dealer.subscriptionTier === 'GOLD' && (
                          <MdVerified className='h-4 w-4 text-yellow-500' />
                        )}
                      </>
                    </span>
                    <span className='text-[10px] text-blue-200'>
                      {dealer._count.products} Items
                    </span>
                  </div>
                </div>

                <ChevronRight
                  size={16}
                  className='text-white/50 group-hover:text-white transition-colors flex-shrink-0'
                />
              </Link>
            ))}
          </div>
        </div>
      )}
      {/* WIDGET 3: AD SPACE (Dynamic) */}
      {settings?.sidebarAdImage ? (
        // ACTIVE AD
        <Link
          href={settings.sidebarAdLink || '#'}
          target='_blank'
          rel='noopener noreferrer'
          className='block relative h-[300px] rounded-xl overflow-hidden shadow-md group'
        >
          <Image
            src={settings.sidebarAdImage}
            alt='Advertisement'
            fill
            className='object-cover group-hover:scale-105 transition-transform duration-500'
            sizes='(max-width: 1024px) 100vw, 320px' // Responsive optimization
            priority // Add this because it's "above the fold" on desktop
          />

          {/* Text Overlay Gradient */}
          <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90' />

          {/* Text Content */}
          <div className='absolute bottom-0 left-0 w-full p-4 text-white z-10 transform translate-y-1 group-hover:translate-y-0 transition-transform'>
            {settings.sidebarAdTitle && (
              <h4 className='font-bold text-lg leading-tight mb-1'>
                {settings.sidebarAdTitle}
              </h4>
            )}
            {settings.sidebarAdSubtitle && (
              <p className='text-xs text-gray-300 opacity-90'>
                {settings.sidebarAdSubtitle}
              </p>
            )}
          </div>

          {/* Ad Badge */}
          <div className='absolute top-2 right-2 bg-yellow-500 text-black text-[9px] px-2 py-0.5 rounded font-bold uppercase tracking-wider z-20 shadow-sm'>
            Ad
          </div>
        </Link>
      ) : (
        // PLACEHOLDER (No Ad Active)
        <Link href='/contact' target='_blank' className='block group'>
          <div className='bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-2 border-dashed border-gray-300 h-64 flex flex-col items-center justify-center text-gray-500 hover:border-blue-400 hover:bg-blue-50 transition-all cursor-pointer'>
            <Megaphone className='h-8 w-8 mb-3 text-gray-400 group-hover:text-blue-500 transition-colors' />
            <span className='text-xs uppercase tracking-widest font-bold mb-2 group-hover:text-blue-600'>
              Advertise Here
            </span>
            <p className='text-sm text-center px-6 leading-relaxed'>
              Reach thousands of buyers daily. Click to book this premium spot.
            </p>
          </div>
        </Link>
      )}
    </aside>
  );
}
