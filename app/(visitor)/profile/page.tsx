// import { auth } from '@/auth';
// import prisma from '@/lib/db';
// import { redirect } from 'next/navigation';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// import { Button } from '@/components/ui/button';
// import { Store, MapPin, ExternalLink } from 'lucide-react';
// import Link from 'next/link';
// import FollowButton from '@/components/public/FollowButton'; // Reusing our button!

// export default async function VisitorDashboard() {
//   const session = await auth();

//   // 1. Auth Check
//   if (!session || !session.user) {
//     redirect('/login?callbackUrl=/profile');
//   }

//   // 2. Fetch Followed Dealers
//   const following = await prisma.follow.findMany({
//     where: { visitorId: session.user.id },
//     include: {
//       dealer: {
//         select: {
//           id: true,
//           shopName: true,
//           image: true,
//           city: true,
//           isVerified: true,
//           _count: { select: { products: true } },
//         },
//       },
//     },
//     orderBy: { createdAt: 'desc' },
//   });

//   return (
//     <div className='min-h-screen bg-gray-50 py-10 px-4'>
//       <div className='max-w-4xl mx-auto'>
//         {/* HEADER */}
//         <div className='flex items-center justify-between mb-8'>
//           <div>
//             <h1 className='text-3xl font-bold text-gray-900'>My Account</h1>
//             <p className='text-gray-500'>
//               Welcome back, {session.user.name || 'Buyer'}
//             </p>
//           </div>
//           {/* Optional: Add a "Become a Dealer" button here if they aren't one */}
//         </div>

//         {/* FOLLOWING LIST */}
//         <Card>
//           <CardHeader className='border-b bg-white'>
//             <CardTitle className='flex items-center gap-2'>
//               <Store className='h-5 w-5 text-blue-600' />
//               Shops You Follow
//             </CardTitle>
//           </CardHeader>
//           <CardContent className='p-0'>
//             {following.length === 0 ? (
//               <div className='text-center py-16 text-gray-500'>
//                 <div className='bg-gray-100 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4'>
//                   <Store className='h-8 w-8 text-gray-400' />
//                 </div>
//                 <h3 className='text-lg font-medium text-gray-900'>
//                   Not following anyone yet
//                 </h3>
//                 <p className='text-sm mt-1 mb-4'>
//                   Find trusted dealers and follow them for updates.
//                 </p>
//                 <Link href='/'>
//                   <Button>Browse Marketplace</Button>
//                 </Link>
//               </div>
//             ) : (
//               <div className='divide-y'>
//                 {following.map((follow) => (
//                   <div
//                     key={follow.id}
//                     className='p-4 flex items-center justify-between hover:bg-gray-50 transition-colors'
//                   >
//                     {/* Dealer Info */}
//                     <div className='flex items-center gap-4'>
//                       <Avatar className='h-12 w-12 border'>
//                         <AvatarImage src={follow.dealer.image || ''} />
//                         <AvatarFallback className='bg-blue-100 text-blue-700 font-bold'>
//                           {follow.dealer.shopName.charAt(0)}
//                         </AvatarFallback>
//                       </Avatar>
//                       <div>
//                         <Link
//                           href={`/shop/${follow.dealer.id}`}
//                           className='font-semibold text-gray-900 hover:underline flex items-center gap-1'
//                         >
//                           {follow.dealer.shopName}
//                           {follow.dealer.isVerified && (
//                             <span className='text-blue-500 text-[10px]'>✓</span>
//                           )}
//                         </Link>
//                         <p className='text-xs text-gray-500 flex items-center gap-1'>
//                           <MapPin size={12} /> {follow.dealer.city} •{' '}
//                           {follow.dealer._count.products} Items
//                         </p>
//                       </div>
//                     </div>

//                     {/* Actions */}
//                     <div className='flex items-center gap-2'>
//                       <Link href={`/shop/${follow.dealer.id}`}>
//                         <Button
//                           variant='outline'
//                           size='sm'
//                           className='hidden sm:flex'
//                         >
//                           Visit Shop <ExternalLink className='ml-2 h-3 w-3' />
//                         </Button>
//                       </Link>

//                       {/* Unfollow Button (Reused Component!) */}
//                       <FollowButton dealerId={follow.dealer.id} />
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// }

import { auth } from '@/auth';
import prisma from '@/lib/db';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Store, MapPin, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import FollowButton from '@/components/public/FollowButton';

export default async function VisitorDashboard() {
  const session = await auth();

  if (!session || !session.user) {
    redirect('/login?callbackUrl=/profile');
  }

  const following = await prisma.follow.findMany({
    where: { visitorId: session.user.id },
    include: {
      dealer: {
        select: {
          id: true,
          shopName: true,
          image: true,
          city: true,
          isVerified: true,
          _count: { select: { products: true } },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className='max-w-4xl mx-auto'>
      {/* HEADER REMOVED (Handled by Shell) */}

      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-gray-900 mb-2'>Following</h1>
        <p className='text-gray-500'>Dealers you are subscribed to.</p>
      </div>

      <Card>
        {/* Optional: Removed secondary header since main title is above */}
        <CardContent className='p-0'>
          {following.length === 0 ? (
            <div className='text-center py-16 text-gray-500'>
              <div className='bg-gray-100 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4'>
                <Store className='h-8 w-8 text-gray-400' />
              </div>
              <h3 className='text-lg font-medium text-gray-900'>
                Not following anyone yet
              </h3>
              <p className='text-sm mt-1 mb-4'>
                Find trusted dealers and follow them for updates.
              </p>
              <Link href='/'>
                <Button>Browse Marketplace</Button>
              </Link>
            </div>
          ) : (
            <div className='divide-y'>
              {following.map((follow) => (
                <div
                  key={follow.id}
                  className='p-4 flex items-center justify-between hover:bg-gray-50 transition-colors'
                >
                  <div className='flex items-center gap-4'>
                    <Avatar className='h-12 w-12 border'>
                      <AvatarImage src={follow.dealer.image || ''} />
                      <AvatarFallback className='bg-blue-100 text-blue-700 font-bold'>
                        {follow.dealer.shopName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <Link
                        href={`/shop/${follow.dealer.id}`}
                        className='font-semibold text-gray-900 hover:underline flex items-center gap-1'
                      >
                        {follow.dealer.shopName}
                        {follow.dealer.isVerified && (
                          <span className='text-blue-500 text-[10px]'>✓</span>
                        )}
                      </Link>
                      <p className='text-xs text-gray-500 flex items-center gap-1'>
                        <MapPin size={12} /> {follow.dealer.city} •{' '}
                        {follow.dealer._count.products} Items
                      </p>
                    </div>
                  </div>

                  <div className='flex items-center gap-2'>
                    <Link href={`/shop/${follow.dealer.id}`}>
                      <Button
                        variant='outline'
                        size='sm'
                        className='hidden sm:flex'
                      >
                        Visit <ExternalLink className='ml-2 h-3 w-3' />
                      </Button>
                    </Link>

                    <FollowButton dealerId={follow.dealer.id} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
