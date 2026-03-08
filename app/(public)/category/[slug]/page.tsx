import { getPublicProducts } from '@/actions/get-public-products';
import BackButton from '@/components/ui/BackButton';
import FilterDrawer from '@/components/public/FilterDrawer';
import Link from 'next/link';
import Image from 'next/image';
import { Crown, Star, Grid, ShieldCheck, BadgeCheck } from 'lucide-react';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MdVerified } from 'react-icons/md';

const CATEGORY_META: Record<string, { title: string; bg: string }> = {
  PHONE: { title: 'Smartphones', bg: '/phone2.jpg' },
  LAPTOP: { title: 'Laptops', bg: '/phone12.jpg' },
  TABLET: {
    title: 'Tablets',
    bg: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=1200&q=80',
  },
  ACCESSORY: {
    title: 'Accessories',
    bg: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=800&q=80',
  },
  OTHER: { title: 'Gadgets', bg: '/phone5.jpg' },
};

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ brand?: string; maxPrice?: string; page?: string }>;
}) {
  const { slug } = await params;
  const { brand, maxPrice, page: pageParam } = await searchParams;

  const categoryEnum = slug.toUpperCase();
  const meta = CATEGORY_META[categoryEnum];

  if (!meta) notFound();

  // Fetch Data
  const platinumProducts = await getPublicProducts(
    undefined,
    brand,
    undefined,
    undefined,
    undefined,
    maxPrice ? Number(maxPrice) : undefined,
    categoryEnum,
    'PLATINUM',
    8,
  );
  const goldProducts = await getPublicProducts(
    undefined,
    brand,
    undefined,
    undefined,
    undefined,
    maxPrice ? Number(maxPrice) : undefined,
    categoryEnum,
    'GOLD',
    8,
  );

  const page = Number(pageParam) || 1;
  const limit = 20;
  const offset = (page - 1) * limit;
  const mainFeed = await getPublicProducts(
    undefined,
    brand,
    undefined,
    undefined,
    undefined,
    maxPrice ? Number(maxPrice) : undefined,
    categoryEnum,
    undefined,
    limit,
    offset,
  );

  return (
    <div className='min-h-screen bg-gray-50 pb-20'>
      {/* 1. HERO HEADER */}
      <div className='relative h-[300px] md:h-[400px] w-full overflow-hidden'>
        <Image
          src={meta.bg}
          alt={meta.title}
          fill
          className='object-cover'
          priority
        />
        <div className='absolute inset-0 bg-black/50' />
        <div className='absolute inset-0 flex flex-col justify-center px-6 max-w-7xl mx-auto'>
          <div className='mb-4 bg-white/20 w-fit p-1 rounded-full backdrop-blur-md'>
            <BackButton />
          </div>
          <h1 className='text-4xl md:text-6xl font-bold text-white tracking-tight drop-shadow-md'>
            {meta.title}
          </h1>
          <p className='text-gray-200 mt-2 text-lg font-medium'>
            Explore the best deals in {meta.title}.
          </p>
        </div>
        <div className='absolute bottom-6 right-6'>
          <FilterDrawer />
        </div>
      </div>

      <div className='max-w-7xl mx-auto px-4 relative z-10'>
        {/* 2. PLATINUM SECTION (Tall Cards) */}
        {platinumProducts.length > 0 && (
          <section className='mt-12 mb-16'>
            <h2 className='text-2xl font-bold mb-6 text-purple-700 flex items-center gap-2'>
              <Crown size={24} className='fill-purple-100' /> Premium Selection
            </h2>
            <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6'>
              {platinumProducts.map((product) => (
                <TallProductCard
                  key={product.id}
                  product={product}
                  badge='PLATINUM'
                  color='purple'
                />
              ))}
            </div>
          </section>
        )}

        {/* 3. GOLD SECTION (Tall Cards) */}
        {goldProducts.length > 0 && (
          <section className='mt-12 mb-16'>
            <h2 className='text-2xl font-bold mb-6 text-yellow-700 flex items-center gap-2'>
              <Star size={24} className='fill-yellow-100' /> Verified Gold Deals
            </h2>
            <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6'>
              {goldProducts.map((product) => (
                <TallProductCard
                  key={product.id}
                  product={product}
                  badge='GOLD'
                  color='yellow'
                />
              ))}
            </div>
          </section>
        )}

        {/* 4. ALL LISTINGS (Standard Grid with Badges) */}
        <section id='feed' className='mt-12'>
          <div className='flex items-center justify-between mb-6 border-b pb-4'>
            <h2 className='text-2xl font-bold text-gray-900 flex items-center gap-2'>
              <Grid size={24} /> All Listings
            </h2>
            <span className='text-gray-500 text-sm font-medium'>
              {mainFeed.length} items
            </span>
          </div>

          <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6'>
            {mainFeed.map((product) => (
              <Link
                key={product.id}
                href={`/phone/${product.id}`}
                className='group block bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1'
              >
                <div className='relative aspect-square bg-gray-100'>
                  {product.images[0] && (
                    <Image
                      src={product.images[0]}
                      alt={product.title}
                      fill
                      className='object-cover'
                    />
                  )}
                </div>
                <div className='p-4'>
                  <h3 className='font-semibold text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors'>
                    {product.title}
                  </h3>
                  <p className='text-blue-700 font-bold mt-1'>
                    GH₵ {product.price.toLocaleString()}
                  </p>

                  {/* Dealer Info + Badge */}
                  <div className='flex items-center gap-1 mt-2 text-xs text-gray-500'>
                    <span className='truncate max-w-[100px]'>
                      {product.dealer.shopName}
                    </span>
                    {product.dealer.isVerified &&
                      (product.dealer.subscriptionTier === 'PLATINUM' ? (
                        <MdVerified size={14} className='text-purple-500' />
                      ) : (
                        <MdVerified size={14} className='text-yellow-500' />
                      ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          <div className='flex justify-center gap-4 mt-16'>
            {page > 1 && (
              <Link href={`?page=${page - 1}#feed`}>
                <Button variant='outline'>Previous</Button>
              </Link>
            )}
            <Link href={`?page=${page + 1}#feed`}>
              <Button>Next Page</Button>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

// --- REUSABLE TALL CARD (Light Mode Version) ---
function TallProductCard({ product, badge, color }: any) {
  const isPurple = color === 'purple';
  const badgeBg = isPurple ? 'bg-purple-600' : 'bg-yellow-500 text-black';

  return (
    <Link
      href={`/phone/${product.id}`}
      className='group block relative aspect-[3/4] rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-2 bg-white'
    >
      {/* Image */}
      {product.images[0] ? (
        <Image
          src={product.images[0]}
          alt={product.title}
          fill
          className='object-cover transition-transform duration-700 group-hover:scale-110'
        />
      ) : (
        <div className='w-full h-full bg-gray-200 flex items-center justify-center text-gray-400'>
          No Image
        </div>
      )}

      {/* Gradient Overlay (Dark at bottom for text readability) */}
      <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90' />

      {/* Content */}
      <div className='absolute bottom-0 left-0 w-full p-4 text-white transform translate-y-1 group-hover:translate-y-0 transition-transform duration-300'>
        {/* Badge */}
        <div className='mb-2'>
          <span
            className={`${badgeBg} text-[10px] font-bold px-2 py-0.5 rounded shadow-sm`}
          >
            {badge}
          </span>
        </div>

        <p className='text-xs font-medium text-white/80 uppercase tracking-widest mb-1 line-clamp-1'>
          {product.dealer.shopName}
        </p>
        <h3 className='font-bold text-lg leading-tight line-clamp-2 mb-1 group-hover:text-blue-200 transition-colors'>
          {product.title}
        </h3>
        <p className='font-bold text-lg text-white'>
          GH₵ {product.price.toLocaleString()}
        </p>
      </div>
    </Link>
  );
}
