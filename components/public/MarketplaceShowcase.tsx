// 'use client';

// import * as React from 'react';
// import Image from 'next/image';
// import Link from 'next/link';
// import { Card, CardContent } from '@/components/ui/card';
// import {
//   Carousel,
//   CarouselContent,
//   CarouselItem,
//   CarouselNext,
//   CarouselPrevious,
//   type CarouselApi,
// } from '@/components/ui/carousel';
// import { useEffect, useState } from 'react';
// import { Badge } from '@/components/ui/badge';

// export default function MarketplaceShowcase({ products }: { products: any[] }) {
//   const [api, setApi] = useState<CarouselApi>();
//   const [current, setCurrent] = useState(0);
//   const [count, setCount] = useState(0);

//   // Track scroll position for the progress bar
//   useEffect(() => {
//     if (!api) return;

//     setCount(api.scrollSnapList().length);
//     setCurrent(api.selectedScrollSnap() + 1);

//     api.on('select', () => {
//       setCurrent(api.selectedScrollSnap() + 1);
//     });
//   }, [api]);

//   // Calculate progress percentage
//   const progress = count > 0 ? (current / count) * 100 : 0;

//   if (products.length === 0) return null;

//   return (
//     <section className='py-12 bg-white border-y border-gray-100'>
//       <div className='max-w-7xl mx-auto px-4'>
//         <div className='flex justify-between items-end mb-6'>
//           <div>
//             <h2 className='text-2xl font-bold text-gray-900'>
//               Explore Marketplace
//             </h2>
//             <p className='text-sm text-gray-500'>
//               Fresh stock from top dealers.
//             </p>
//           </div>
//           {/* Optional: View All Link */}
//           <Link
//             href='/?category='
//             className='text-blue-600 text-sm font-medium hover:underline hidden md:block'
//           >
//             View All Categories
//           </Link>
//         </div>

//         <Carousel
//           setApi={setApi}
//           opts={{ align: 'start', loop: true }}
//           className='w-full relative'
//         >
//           <CarouselContent className='-ml-4'>
//             {products.map((product) => (
//               <CarouselItem
//                 key={product.id}
//                 className='pl-4 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5'
//               >
//                 <Link
//                   href={`/phone/${product.id}`}
//                   className='group block h-full'
//                 >
//                   <Card className='border-none shadow-none hover:shadow-md transition-shadow h-full bg-gray-50 rounded-xl overflow-hidden'>
//                     <div className='relative aspect-square bg-white'>
//                       {product.images[0] ? (
//                         <img
//                           src={product.images[0]}
//                           alt={product.title}
//                           className='w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500'
//                         />
//                       ) : (
//                         <div className='w-full h-full flex items-center justify-center text-gray-300 text-xs'>
//                           No Img
//                         </div>
//                       )}

//                       {/* Category Badge */}
//                       <Badge
//                         variant='secondary'
//                         className='absolute top-2 left-2 text-[10px] bg-gray-100/80 backdrop-blur-sm border-gray-200'
//                       >
//                         {product.category}
//                       </Badge>
//                     </div>
//                     <div className='p-3'>
//                       <h3 className='font-medium text-gray-900 text-sm truncate group-hover:text-blue-600 transition-colors'>
//                         {product.title}
//                       </h3>
//                       <p className='text-blue-700 font-bold text-sm'>
//                         GH₵ {product.price.toLocaleString()}
//                       </p>
//                     </div>
//                   </Card>
//                 </Link>
//               </CarouselItem>
//             ))}
//           </CarouselContent>

//           {/* Navigation Arrows */}
//           <CarouselPrevious className='left-2 hidden md:flex bg-white/80 backdrop-blur-sm border-none shadow-md hover:bg-white' />
//           <CarouselNext className='right-2 hidden md:flex bg-white/80 backdrop-blur-sm border-none shadow-md hover:bg-white' />
//         </Carousel>

//         {/* PROGRESS BAR (The "Rounded Object" you asked for) */}
//         <div className='mt-6 flex justify-center'>
//           <div className='w-48 h-1.5 bg-gray-200 rounded-full overflow-hidden'>
//             <div
//               className='h-full bg-blue-600 rounded-full transition-all duration-500 ease-out'
//               style={{ width: `${progress}%` }}
//             />
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel';
import { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';

export default function MarketplaceShowcase({ products }: { products: any[] }) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) return;
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);
    api.on('select', () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  const progress = count > 0 ? (current / count) * 100 : 0;

  if (products.length === 0) return null;

  return (
    <section className='py-16 bg-gradient-to-b from-gray-50 to-white'>
      <div className='max-w-7xl mx-auto px-4'>
        <div className='flex justify-between items-end mb-8'>
          <div>
            <h2 className='text-3xl font-bold text-gray-900 tracking-tight'>
              Explore Collection
            </h2>
            <p className='text-gray-500 mt-1'>
              Discover trending items from verified sellers.
            </p>
          </div>
          <Link
            href='/?category='
            className='hidden md:flex items-center gap-1 text-sm font-semibold text-gray-900 hover:text-blue-600 transition-colors'
          >
            See All <ArrowRight size={16} />
          </Link>
        </div>

        <Carousel
          setApi={setApi}
          opts={{ align: 'start', loop: true }}
          className='w-full relative'
        >
          <CarouselContent className='-ml-4'>
            {products.map((product) => (
              <CarouselItem
                key={product.id}
                className='pl-4 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5'
              >
                <Link
                  href={`/phone/${product.id}`}
                  className='group block h-full'
                >
                  {/* THE "STORY" CARD DESIGN */}
                  <div className='relative aspect-[3/4] rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 group-hover:-translate-y-1'>
                    {/* Full Background Image */}
                    {product.images[0] ? (
                      <img
                        src={product.images[0]}
                        alt={product.title}
                        className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-110'
                      />
                    ) : (
                      <div className='w-full h-full bg-gray-200' />
                    )}

                    {/* Gradient Overlay (Bottom) */}
                    <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity' />

                    {/* Floating Text Content */}
                    <div className='absolute bottom-0 left-0 w-full p-4 text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300'>
                      <p className='text-xs font-medium text-white/70 uppercase tracking-widest mb-1'>
                        {product.category}
                      </p>
                      <h3 className='font-bold text-lg leading-tight line-clamp-2'>
                        {product.title}
                      </h3>
                      <div className='h-0.5 w-0 group-hover:w-full bg-white mt-3 transition-all duration-500' />
                    </div>
                  </div>
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselPrevious className='left-[-10px] hidden md:flex h-12 w-12 border-none shadow-lg bg-white/90 hover:bg-white text-gray-800' />
          <CarouselNext className='right-[-10px] hidden md:flex h-12 w-12 border-none shadow-lg bg-white/90 hover:bg-white text-gray-800' />
        </Carousel>

        {/* PROGRESS INDICATOR */}
        <div className='mt-8 flex items-center justify-center gap-4'>
          <div className='h-1 flex-1 max-w-xs bg-gray-200 rounded-full overflow-hidden'>
            <div
              className='h-full bg-blue-600 rounded-full transition-all duration-500 ease-out'
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
