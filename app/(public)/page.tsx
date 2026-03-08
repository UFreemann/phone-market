import { getPublicProducts } from '@/actions/get-public-products';
import { getFeaturedProducts } from '@/actions/get-featured';
import ProductCard from '@/components/public/ProductCard';
import { Button } from '@/components/ui/button';
import { Megaphone, Search, Sparkles, XCircle } from 'lucide-react';
import SearchBar from '@/components/public/SearchBar';
import Link from 'next/link';
import FilterDrawer from '@/components/public/FilterDrawer';
import { getSponsoredProducts } from '@/actions/get-sponsored';
import HeroSlider from '@/components/public/HeroSlider';
import SellerCTA from '@/components/public/SellerCTA';
import { getSliderData } from '@/actions/get-slider-data';
import { getShowcaseProducts } from '@/actions/get-showcase';
import MarketplaceShowcase from '@/components/public/MarketplaceShowcase';
import { getSiteSettings } from '@/actions/admin-settings';
import { getTrendingReels } from '@/actions/get-reels';
import TrendingReels from '@/components/public/TrendingReels';

export default async function Homepage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    brand?: string;
    condition?: string;
    maxPrice?: string;
    category?: string;
  }>;
}) {
  // Await search params (Next.js 15 requirement)
  // Note: Depending on your exact Next.js version, searchParams might not need await yet,
  // but it's good practice for the future.
  // const params = await searchParams; // Uncomment if you get a sync error
  const params = await searchParams;
  const query = params.q || '';
  const brand = params.brand;
  const condition = params.condition;
  const maxPrice = params.maxPrice ? Number(params.maxPrice) : undefined;
  const category = params.category;

  // console.log('SEARCH QUERY:', query);

  // Fetch Data in Parallel for speed
  const [
    products,
    featuredProducts,
    sponsoredProducts,
    sliderData,
    showcaseData,
    settings,
  ] = await Promise.all([
    getPublicProducts(
      query,
      brand,
      undefined,
      condition,
      undefined,
      maxPrice,
      category,
    ),
    getFeaturedProducts(),
    getSponsoredProducts(),
    getSliderData(),
    getShowcaseProducts(),
    getSiteSettings(),
  ]);

  // Determine if any filter is active (to hide Featured section)
  const isFiltering = query || brand || condition || maxPrice || category;

  // Determine title text
  let pageTitle = 'Latest Arrivals';
  if (query) pageTitle = `Results for "${query}"`;
  else if (brand) pageTitle = `${brand} Phones`;
  else if (isFiltering) pageTitle = 'Filtered Results';

  if (category)
    pageTitle = `${category.charAt(0) + category.slice(1).toLowerCase()}s`; // "Laptops", "Phones"

  const layoutOrder = settings.homepageLayout || [
    'HERO',
    'SPONSORED',
    'SHOWCASE',
    'COLLECTION',
    'CTA',
    'FEATURED',
    'LATEST',
  ];

  const trendingReels = await getTrendingReels();

  // --- COMPONENT MAP ---
  const componentMap: Record<string, React.ReactNode> = {
    HERO: (
      <div className='bg-[linear-gradient(to_right,#1d4ed8,#1e3a8a)] py-20 px-4 text-center relative overflow-hidden'>
        <div className='max-w-3xl mx-auto space-y-8 relative z-10'>
          <div className='flex justify-center'>
            <Link href='/feed'>
              <Button
                variant='outline'
                className='h-9 bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20 hover:border-white/40 rounded-full px-5 transition-all shadow-sm group'
              >
                <Sparkles
                  size={14}
                  className='mr-2 text-yellow-300 fill-yellow-300/20 group-hover:scale-110 transition-transform'
                />
                <span className='text-sm font-medium tracking-wide'>
                  Personalized Feed
                </span>
              </Button>
            </Link>
          </div>

          <div className='space-y-4'>
            <h1 className='text-4xl md:text-6xl font-extrabold text-white tracking-tight drop-shadow-sm'>
              Find Your Next Phone
            </h1>
            <p className='text-blue-100 text-lg md:text-xl max-w-xl mx-auto leading-relaxed opacity-90'>
              Connect directly with trusted dealers.{' '}
              <br className='hidden sm:block' />
              Verified shops, better deals, no middlemen.
            </p>
          </div>

          <div className='relative max-w-2xl mx-auto flex gap-2 pt-4'>
            <div className='flex-1'>
              <SearchBar />
            </div>
            <FilterDrawer />
          </div>
        </div>
      </div>
    ),

    SPONSORED:
      !isFiltering && sponsoredProducts.length > 0 ? (
        <section id='sponsored' className='max-w-7xl mx-auto px-4 mt-12'>
          <div className='flex items-center gap-2 mb-6'>
            <div className='bg-yellow-100 p-2 rounded-full'>
              <Megaphone className='h-5 w-5 text-yellow-600 fill-yellow-100' />
            </div>
            <h2 className='text-2xl font-bold text-gray-900'>
              Sponsored Deals
            </h2>
          </div>
          <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-6'>
            {sponsoredProducts.map((product) => (
              <ProductCard
                key={product.id}
                {...product}
                image={product.images[0]}
                dealer={product.dealer as any}
                isAd={true}
              />
            ))}
          </div>
        </section>
      ) : null,

    // Note: You named this HeroSlider in previous chats, but if it's the vertical one, use MarketplaceShowcase
    SHOWCASE: <HeroSlider slides={sliderData} />,

    // If you have MarketplaceShowcase separately, map it here:
    // "COLLECTION": <MarketplaceShowcase products={showcaseData} />,
    // Assuming "SHOWCASE" maps to your MarketplaceShowcase component in admin logic:
    COLLECTION: <MarketplaceShowcase products={showcaseData} />,

    CTA: <SellerCTA />,

    FEATURED:
      !isFiltering && featuredProducts.length > 0 ? (
        <section id='featured' className='max-w-7xl mx-auto px-4 mt-12'>
          <div className='flex items-center gap-2 mb-6'>
            <Sparkles className='text-purple-600 fill-purple-100' />
            <h2 className='text-2xl font-bold text-gray-900'>Featured Deals</h2>
          </div>
          <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-6'>
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                {...product}
                image={product.images[0]}
                isAd={false}
                dealer={product.dealer as any}
              />
            ))}
          </div>
        </section>
      ) : null,

    LATEST: (
      <section
        id='latest'
        className='max-w-7xl mx-auto px-4 mt-12 scroll-mt-24'
      >
        <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b pb-4 gap-4'>
          <div className='flex items-center gap-3'>
            <h2 className='text-2xl font-bold text-gray-800'>{pageTitle}</h2>
            {isFiltering && (
              <Link
                href='/'
                className='flex items-center gap-1 text-sm text-red-600 hover:bg-red-50 px-3 py-1 rounded-full transition-colors font-medium border border-red-100'
              >
                <XCircle className='h-4 w-4' /> Clear
              </Link>
            )}
          </div>
          <span className='text-gray-500 text-sm font-medium'>
            {products.length} phones found
          </span>
        </div>

        {products.length === 0 ? (
          <div className='text-center py-20 bg-white rounded-xl border border-dashed'>
            <div className='inline-flex bg-gray-100 p-4 rounded-full mb-4'>
              <Search className='h-8 w-8 text-gray-400' />
            </div>
            <h3 className='text-lg font-medium text-gray-900'>
              No phones found
            </h3>
            <p className='text-gray-500'>Try adjusting your search terms.</p>
          </div>
        ) : (
          <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-6'>
            {products.map((product) => (
              <ProductCard
                key={product.id}
                {...product}
                image={product.images[0]}
                dealer={product.dealer as any}
                isAd={false}
              />
            ))}
          </div>
        )}
      </section>
    ),
  };

  return (
    <main className='min-h-screen bg-gray-50 pb-20'>
      {layoutOrder.map((key) => (
        <div key={key}>{componentMap[key]}</div>
      ))}
      <TrendingReels reels={trendingReels} />
    </main>
  );
}

// return (
//   <main className='min-h-screen bg-gray-50 pb-20'>
//     {/* 1. HERO SECTION & SEARCH */}
//     <div className='bg-gradient-to-r from-blue-700 to-blue-900 py-20 text-center relative overflow-hidden'>
//       <div className='max-w-3xl mx-auto space-y-8 relative z-10'>
//         {/* 1. FOR YOU BUTTON (Centered Top) */}
//         <div className='flex justify-center'>
//           <Link href='/feed'>
//             <Button
//               variant='outline'
//               className='h-9 bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20 hover:border-white/40 rounded-full px-5 transition-all shadow-sm group'
//             >
//               <Sparkles
//                 size={14}
//                 className='mr-2 text-yellow-300 fill-yellow-300/20 group-hover:scale-110 transition-transform'
//               />
//               <span className='text-sm font-medium tracking-wide'>
//                 Personalized Feed
//               </span>
//             </Button>
//           </Link>
//         </div>

//         {/* 2. HEADLINE & SUBTEXT */}
//         <div className='space-y-4'>
//           <h1 className='text-4xl md:text-6xl font-extrabold text-white tracking-tight drop-shadow-sm'>
//             Find Your Next Phone
//           </h1>
//           <p className='text-blue-100 text-lg md:text-xl max-w-xl mx-auto leading-relaxed opacity-90'>
//             Connect directly with trusted dealers.{' '}
//             <br className='hidden sm:block' />
//             Verified shops, better deals, no middlemen.
//           </p>
//         </div>

//         {/* 3. SEARCH BAR & FILTER */}
//         <div className='relative max-w-2xl mx-auto flex gap-2 pt-4'>
//           <div className='flex-1'>
//             <SearchBar />
//           </div>
//           <FilterDrawer />
//         </div>
//       </div>
//     </div>

//     {/* 2. NEW SLIDER (Visuals) */}
//     <HeroSlider slides={sliderData} />

//     {/* 3. SPONSORED DEALS (Show only if no search active) */}
//     {!isFiltering && sponsoredProducts.length > 0 && (
//       <section id='sponsored' className='max-w-7xl mx-auto px-4 mt-12'>
//         <div className='flex items-center gap-2 mb-6'>
//           <div className='bg-yellow-100 p-2 rounded-full'>
//             <Megaphone className='h-5 w-5 text-yellow-600 fill-yellow-100' />
//           </div>
//           <h2 className='text-2xl font-bold text-gray-900'>
//             Sponsored Deals
//           </h2>
//         </div>

//         <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-6'>
//           {sponsoredProducts.map((product) => (
//             <ProductCard
//               key={product.id}
//               {...product}
//               image={product.images[0]}
//               dealer={product.dealer as any}
//               isAd={true} // Force the yellow badge
//             />
//           ))}
//         </div>
//       </section>
//     )}

//     {/* NEW SHOWCASE */}
//     <MarketplaceShowcase products={showcaseData} />

//     {/* 4. SELLER CTA (Insert between sections) */}
//     <SellerCTA />

//     {/* 5. FEATURED SECTION (Only show if no search query active) */}
//     {!isFiltering && featuredProducts.length > 0 && (
//       <section id='featured' className='max-w-7xl mx-auto px-4 mt-12'>
//         <div className='flex items-center gap-2 mb-6'>
//           <Sparkles className='text-purple-600 fill-purple-100' />
//           <h2 className='text-2xl font-bold text-gray-900'>Featured Deals</h2>
//         </div>

//         {/* Horizontal Scroll Grid for Mobile / Standard Grid for Desktop */}
//         <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-6'>
//           {featuredProducts.map((product) => (
//             <ProductCard
//               key={product.id}
//               {...product}
//               image={product.images[0]}
//               isAd={false}
//               dealer={product.dealer as any} // Cast bc TS might complain about mismatch in detail
//             />
//           ))}
//         </div>
//       </section>
//     )}

//     {/* 3. MAIN MARKETPLACE FEED */}
//     <section
//       id='latest'
//       className='max-w-7xl mx-auto px-4 mt-12 scroll-mt-24'
//     >
//       {/* <div className='flex justify-between items-center mb-6 border-b pb-4'>
//         <h2 className='text-2xl font-bold text-gray-800'>
//           {query ? `Results for "${query}"` : 'Latest Arrivals'}
//         </h2>
//         <span className='text-gray-500 text-sm font-medium'>
//           {products.length} phones found
//         </span>
//       </div> */}
//       <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b pb-4 gap-4'>
//         <div className='flex items-center gap-3'>
//           <h2 className='text-2xl font-bold text-gray-800'>
//             {/* {query ? `Results for "${query}"` : 'Latest Arrivals'} */}
//             {pageTitle}
//           </h2>

//           {/* CLEAR SEARCH LINK */}
//           {/* {query && (
//             <Link
//               href='/'
//               className='flex items-center gap-1 text-sm text-red-600 hover:bg-red-50 px-3 py-1 rounded-full transition-colors'
//             >
//               <XCircle className='h-4 w-4' /> Clear
//             </Link>
//           )} */}

//           {/* CLEAR BUTTON (Shows if ANY filter is active) */}
//           {isFiltering && (
//             <Link
//               href='/'
//               className='flex items-center gap-1 text-sm text-red-600 hover:bg-red-50 px-3 py-1 rounded-full transition-colors font-medium border border-red-100'
//             >
//               <XCircle className='h-4 w-4' /> Clear
//             </Link>
//           )}
//         </div>

//         <span className='text-gray-500 text-sm font-medium'>
//           {products.length} phones found
//         </span>
//       </div>

//       {/* Empty State */}
//       {products.length === 0 ? (
//         <div className='text-center py-20 bg-white rounded-xl border border-dashed'>
//           <div className='inline-flex bg-gray-100 p-4 rounded-full mb-4'>
//             <Search className='h-8 w-8 text-gray-400' />
//           </div>
//           <h3 className='text-lg font-medium text-gray-900'>
//             No phones found
//           </h3>
//           <p className='text-gray-500'>Try adjusting your search terms.</p>
//         </div>
//       ) : (
//         <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-6'>
//           {products.map((product) => (
//             <ProductCard
//               key={product.id}
//               {...product}
//               image={product.images[0]}
//               dealer={product.dealer as any}
//               isAd={false}
//             />
//           ))}
//         </div>
//       )}
//     </section>
//   </main>
// );
// }
