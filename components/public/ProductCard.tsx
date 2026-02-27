// import Link from 'next/link';
// import { Card, CardContent, CardFooter } from '@/components/ui/card';
// import { BadgeCheck, ShieldCheck, MapPin, Zap } from 'lucide-react';
// import { Badge } from '@/components/ui/badge';
// import BookmarkButton from '@/components/public/BookmarkButton';

// type ProductCardProps = {
//   id: string;
//   title: string;
//   price: number;
//   image: string;
//   condition: string;
//   isNegotiable: boolean;
//   isAd?: boolean; // <--- 1. NEW PROP
//   dealer: {
//     shopName: string;
//     city: string;
//     isVerified: boolean;
//     subscriptionTier: 'FREE' | 'GOLD' | 'PLATINUM';
//     image: string | null;
//   };
// };

// export default function ProductCard({
//   id,
//   title,
//   price,
//   image,
//   condition,
//   isNegotiable,
//   isAd, // <--- Destructure
//   dealer,
// }: ProductCardProps) {
//   const isPlatinum = dealer.subscriptionTier === 'PLATINUM';
//   const isGold = dealer.subscriptionTier === 'GOLD';

//   return (
//     <div className='relative h-full group'>
//       {/* BOOKMARK BUTTON (Floating Top Right, Outside Link) */}
//       <div className='absolute top-2 right-2 z-20'>
//         <BookmarkButton productId={id} />
//       </div>

//       <Link href={`/phone/${id}`} className='block h-full'>
//         <Card
//           className={`h-full overflow-hidden transition-all hover:shadow-xl border-gray-200 ${
//             isPlatinum
//               ? 'border-purple-300 ring-1 ring-purple-100'
//               : isAd
//                 ? 'border-yellow-300 ring-1 ring-yellow-100' // Gold Ring for Ads
//                 : ''
//           }`}
//         >
//           {/* Image Section */}
//           <div className='relative h-40 sm:h-48 md:h-56 bg-gray-100 overflow-hidden'>
//             {image ? (
//               <img
//                 src={image}
//                 alt={title}
//                 className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-105'
//               />
//             ) : (
//               <div className='w-full h-full flex items-center justify-center bg-gray-200 text-gray-400 text-xs'>
//                 No Image
//               </div>
//             )}

//             {/* 2. SPONSORED BADGE (Top Left - High Priority) */}
//             {isAd && (
//               <span className='absolute top-0 left-0 bg-yellow-400 text-black text-[9px] md:text-[10px] font-bold px-2 py-1 rounded-br shadow-md z-20 uppercase tracking-wide'>
//                 Sponsored
//               </span>
//             )}

//             {/* Condition Badge: Shifted down if Ad exists to prevent overlap */}
//             <span
//               className={`absolute left-1.5 bg-black/70 backdrop-blur-sm text-white text-[9px] md:text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide z-10 ${isAd ? 'top-8' : 'top-1.5'}`}
//             >
//               {condition}
//             </span>

//             {/* Featured Badge: Bottom Right */}
//             {isPlatinum && (
//               <span className='absolute bottom-1.5 right-1.5 bg-purple-600 text-white text-[9px] md:text-[10px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5 shadow-md z-10'>
//                 <Zap size={8} className='fill-white' /> Featured
//               </span>
//             )}
//           </div>

//           {/* Content Section */}
//           <CardContent className='p-3 md:p-4'>
//             <div className='flex flex-col sm:flex-row sm:justify-between sm:items-start mb-1 gap-1'>
//               <div className='text-sm md:text-lg font-bold text-blue-700 leading-tight'>
//                 GH₵ {price.toLocaleString()}
//               </div>
//               {isNegotiable && (
//                 <Badge
//                   variant='outline'
//                   className='text-[9px] md:text-[10px] border-green-500 text-green-600 h-4 md:h-5 px-1 w-fit'
//                 >
//                   Negotiable
//                 </Badge>
//               )}
//             </div>

//             <h3 className='font-semibold text-xs md:text-base text-gray-900 line-clamp-1 mb-1 group-hover:text-blue-600 transition-colors'>
//               {title}
//             </h3>

//             <div className='flex items-center text-[10px] md:text-xs text-gray-500 gap-1'>
//               <MapPin size={10} className='md:w-3 md:h-3' /> {dealer.city}
//             </div>
//           </CardContent>

//           {/* Dealer Footer */}
//           <CardFooter
//             className={`p-2 md:p-3 pt-0 flex items-center gap-2 border-t ${
//               isPlatinum
//                 ? 'bg-purple-50/50'
//                 : isGold || isAd // Ads get slight yellow tint too
//                   ? 'bg-yellow-50/50'
//                   : 'bg-gray-50/50'
//             }`}
//           >
//             <div className='h-5 w-5 md:h-6 md:w-6 rounded-full bg-white border overflow-hidden flex-shrink-0'>
//               {dealer.image ? (
//                 <img
//                   src={dealer.image}
//                   alt='Logo'
//                   className='h-full w-full object-cover'
//                 />
//               ) : (
//                 <div className='h-full w-full flex items-center justify-center bg-gray-200 text-[10px] md:text-xs font-bold text-gray-500'>
//                   {dealer.shopName.charAt(0)}
//                 </div>
//               )}
//             </div>

//             <div className='flex items-center gap-1 overflow-hidden'>
//               <span className='text-[10px] md:text-xs font-medium text-gray-700 truncate max-w-[80px] md:max-w-[140px]'>
//                 {dealer.shopName}
//               </span>

//               {dealer.isVerified && (
//                 <>
//                   {dealer.subscriptionTier === 'PLATINUM' && (
//                     <ShieldCheck className='h-3 w-3 md:h-3.5 md:w-3.5 text-purple-600 fill-purple-100 flex-shrink-0' />
//                   )}

//                   {dealer.subscriptionTier === 'GOLD' && (
//                     <BadgeCheck className='h-3 w-3 md:h-3.5 md:w-3.5 text-yellow-600 fill-yellow-50 flex-shrink-0' />
//                   )}
//                 </>
//               )}
//             </div>
//           </CardFooter>
//         </Card>
//       </Link>
//     </div>
//   );
// }

import Link from 'next/link';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { BadgeCheck, ShieldCheck, MapPin, Zap, Megaphone } from 'lucide-react'; // Added Megaphone
import { Badge } from '@/components/ui/badge';
import BookmarkButton from '@/components/public/BookmarkButton';
import { MdVerified } from 'react-icons/md';

type ProductCardProps = {
  id: string;
  title: string;
  price: number;
  image: string;
  condition: string;
  isNegotiable: boolean;
  isAd?: boolean;
  dealer: {
    shopName: string;
    city: string;
    isVerified: boolean;
    subscriptionTier: 'FREE' | 'GOLD' | 'PLATINUM';
    image: string | null;
  };
};

export default function ProductCard({
  id,
  title,
  price,
  image,
  condition,
  isNegotiable,
  isAd,
  dealer,
}: ProductCardProps) {
  const isPlatinum = dealer.subscriptionTier === 'PLATINUM';
  const isGold = dealer.subscriptionTier === 'GOLD';

  // DYNAMIC STYLE LOGIC
  const cardClasses = isAd
    ? 'border-yellow-400 ring-2 ring-yellow-100 shadow-md bg-gradient-to-b from-white to-yellow-50/30' // Sponsored
    : isPlatinum
      ? 'border-purple-300 ring-1 ring-purple-100' // Platinum
      : 'border-gray-200 hover:shadow-xl'; // Standard

  return (
    <div className='relative h-full group'>
      {/* BOOKMARK BUTTON */}
      <div className='absolute top-2 right-2 z-20'>
        <BookmarkButton productId={id} />
      </div>

      <Link href={`/phone/${id}`} className='block h-full'>
        <Card
          className={`h-full overflow-hidden transition-all ${cardClasses}`}
        >
          {/* IMAGE SECTION */}
          <div className='relative h-40 sm:h-48 md:h-56 bg-gray-100 overflow-hidden'>
            {image ? (
              <img
                src={image}
                alt={title}
                className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-105'
              />
            ) : (
              <div className='w-full h-full flex items-center justify-center bg-gray-200 text-gray-400 text-xs'>
                No Image
              </div>
            )}

            {/* SPONSORED BADGE (Enhanced) */}
            {isAd && (
              <div className='absolute top-0 left-0 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-[9px] md:text-[10px] font-bold px-3 py-1 rounded-br-lg shadow-sm z-20 flex items-center gap-1 uppercase tracking-wide'>
                <Megaphone size={10} className='fill-white' /> Sponsored
              </div>
            )}

            {/* Condition Badge */}
            <span
              className={`absolute left-1.5 bg-black/70 backdrop-blur-sm text-white text-[9px] md:text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide z-10 ${isAd ? 'top-8' : 'top-1.5'}`}
            >
              {condition}
            </span>

            {/* Featured Badge */}
            {isPlatinum && (
              <span className='absolute bottom-1.5 right-1.5 bg-purple-600 text-white text-[9px] md:text-[10px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5 shadow-md z-10'>
                <Zap size={8} className='fill-white' /> Featured
              </span>
            )}
          </div>

          {/* CONTENT SECTION */}
          <CardContent className='p-3 md:p-4'>
            {/* Price Row */}
            <div className='flex flex-col sm:flex-row sm:justify-between sm:items-start mb-1 gap-1'>
              <div
                className={`text-sm md:text-lg font-bold leading-tight ${isAd ? 'text-orange-600' : 'text-blue-700'}`}
              >
                GH₵ {price.toLocaleString()}
              </div>
              {isNegotiable && (
                <Badge
                  variant='outline'
                  className='text-[9px] md:text-[10px] border-green-500 text-green-600 h-4 md:h-5 px-1 w-fit'
                >
                  Negotiable
                </Badge>
              )}
            </div>

            {/* Title */}
            <h3 className='font-semibold text-xs md:text-base text-gray-900 line-clamp-1 mb-1 group-hover:text-blue-600 transition-colors'>
              {title}
            </h3>

            {/* Location */}
            <div className='flex items-center text-[10px] md:text-xs text-gray-500 gap-1'>
              <MapPin size={10} className='md:w-3 md:h-3' /> {dealer.city}
            </div>
          </CardContent>

          {/* DEALER FOOTER */}
          <CardFooter
            className={`p-2 md:p-3 pt-0 flex items-center gap-2 border-t ${
              isAd
                ? 'bg-yellow-100/50 border-yellow-100'
                : isPlatinum
                  ? 'bg-purple-50/50'
                  : 'bg-gray-50/50'
            }`}
          >
            <div className='h-5 w-5 md:h-6 md:w-6 rounded-full bg-white border overflow-hidden flex-shrink-0'>
              {dealer.image ? (
                <img
                  src={dealer.image}
                  alt='Logo'
                  className='h-full w-full object-cover'
                />
              ) : (
                <div className='h-full w-full flex items-center justify-center bg-gray-200 text-[10px] md:text-xs font-bold text-gray-500'>
                  {dealer.shopName.charAt(0)}
                </div>
              )}
            </div>

            <div className='flex items-center gap-1 overflow-hidden'>
              <span className='text-[10px] md:text-xs font-medium text-gray-700 truncate max-w-[80px] md:max-w-[140px]'>
                {dealer.shopName}
              </span>

              {dealer.isVerified && (
                <>
                  {/* {dealer.subscriptionTier === 'PLATINUM' && (
                    <MdVerified className='h-3 w-3 md:h-4 md:w-4 text-blue-500' />
                  )} */}

                  {dealer.subscriptionTier === 'PLATINUM' && (
                    <MdVerified className='h-3 w-3 md:h-4 md:w-4 text-purple-500' />
                  )}

                  {dealer.subscriptionTier === 'GOLD' && (
                    <MdVerified className='h-3 w-3 md:h-4 md:w-4 text-yellow-500' />
                  )}
                </>
              )}
            </div>
          </CardFooter>
        </Card>
      </Link>
    </div>
  );
}
