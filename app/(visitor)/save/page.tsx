// import { auth } from '@/auth';
// import { redirect } from 'next/navigation';
// import prisma from '@/lib/db';
// import ProductCard from '@/components/public/ProductCard';
// import { Heart } from 'lucide-react';

// export default async function SavedPage() {
//   const session = await auth();
//   if (!session?.user) redirect('/login?callbackUrl=/saved');

//   const savedItems = await prisma.savedItem.findMany({
//     where: { userId: session.user.id },
//     include: {
//       product: {
//         include: { dealer: true }, // Need dealer info for card
//       },
//     },
//     orderBy: { createdAt: 'desc' },
//   });

//   return (
//     <div className='min-h-screen bg-gray-50 py-10 px-4'>
//       <div className='max-w-7xl mx-auto'>
//         <div className='flex items-center gap-3 mb-8'>
//           <div className='bg-red-100 p-3 rounded-full'>
//             <Heart className='h-6 w-6 text-red-600 fill-red-200' />
//           </div>
//           <h1 className='text-3xl font-bold text-gray-900'>
//             Saved Items ({savedItems.length})
//           </h1>
//         </div>

//         {savedItems.length === 0 ? (
//           <div className='text-center py-20 text-gray-500'>
//             No saved items yet.
//           </div>
//         ) : (
//           <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
//             {savedItems.map((item) => (
//               <ProductCard
//                 key={item.id}
//                 {...item.product}
//                 image={item.product.images[0]}
//                 dealer={item.product.dealer as any}
//                 price={Number(item.product.price)}
//               />
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import prisma from '@/lib/db';
import ProductCard from '@/components/public/ProductCard';
import { Heart } from 'lucide-react';

export default async function SavedPage() {
  const session = await auth();
  if (!session?.user) redirect('/login?callbackUrl=/saved');

  const savedItems = await prisma.savedItem.findMany({
    where: { userId: session.user.id },
    include: {
      product: {
        include: { dealer: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className='max-w-7xl mx-auto'>
      <div className='flex items-center gap-3 mb-8'>
        <div className='bg-red-100 p-3 rounded-full'>
          <Heart className='h-6 w-6 text-red-600 fill-red-200' />
        </div>
        <h1 className='text-3xl font-bold text-gray-900'>
          Saved Items ({savedItems.length})
        </h1>
      </div>

      {savedItems.length === 0 ? (
        <div className='text-center py-20 text-gray-500'>
          No saved items yet.
        </div>
      ) : (
        <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
          {savedItems.map((item) => (
            <ProductCard
              key={item.id}
              {...item.product}
              image={item.product.images[0]}
              dealer={item.product.dealer as any}
              price={Number(item.product.price)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
