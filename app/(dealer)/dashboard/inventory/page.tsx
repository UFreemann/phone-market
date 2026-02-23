/*Before inventory page premium look */
// import { auth } from '@/auth';
// import prisma from '@/lib/db';
// import { redirect } from 'next/navigation';
// import InventoryList from '@/components/dealer/InventoryLists';
// import { Button } from '@/components/ui/button';
// import Link from 'next/link';
// import { PlusCircle } from 'lucide-react';

// export default async function InventoryPage() {
//   // 1. Authenticate
//   const session = await auth();
//   if (!session || !session.user) redirect('/login');

//   // 2. Get Dealer ID
//   const dealer = await prisma.dealerProfile.findUnique({
//     where: { userId: session.user.id },
//   });

//   if (!dealer) redirect('/');

//   // 3. Fetch Products
//   const rawProducts = await prisma.product.findMany({
//     where: { dealerId: dealer.id },
//     orderBy: { createdAt: 'desc' },
//   });

//   // 4. Transform Decimal to Number (Fix for "Plain Objects" Error)
//   const products = rawProducts.map((product) => ({
//     ...product,
//     price: Number(product.price),
//   }));

//   return (
//     <div className='max-w-6xl mx-auto'>
//       <div className='flex justify-between items-center mb-6'>
//         <h1 className='text-2xl font-bold'>My Inventory</h1>
//         <span className='text-gray-500 text-sm'>
//           ({products.length}) items found
//         </span>
//       </div>

//       <Link
//         href='/dashboard/add'
//         className='flex justify-end items-center mb-3'
//       >
//         <Button className='bg-blue-600 hover:bg-blue-700 cursor-pointer'>
//           <PlusCircle className='mr-2 h-4 w-4' /> Post New Phone
//         </Button>
//       </Link>

//       {/* Pass the safe, transformed data to the Client Component */}
//       <InventoryList products={products} />
//     </div>
//   );
// }

/*After premium look but before search and filter button logic handled*/
// import { auth } from '@/auth';
// import prisma from '@/lib/db';
// import { redirect } from 'next/navigation';
// import InventoryList from '@/components/dealer/InventoryLists';
// import { Button } from '@/components/ui/button';
// import Link from 'next/link';
// import { PlusCircle, Search, Filter } from 'lucide-react';
// import { Input } from '@/components/ui/input';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// export default async function InventoryPage() {
//   const session = await auth();
//   if (!session || !session.user) redirect('/login');

//   const dealer = await prisma.dealerProfile.findUnique({
//     where: { userId: session.user.id },
//   });

//   if (!dealer) redirect('/');

//   const rawProducts = await prisma.product.findMany({
//     where: { dealerId: dealer.id },
//     orderBy: { createdAt: 'desc' },
//   });

//   const products = rawProducts.map((product) => ({
//     ...product,
//     price: Number(product.price),
//   }));

//   return (
//     <div className='max-w-7xl mx-auto space-y-6'>
//       {/* 1. HEADER & ACTIONS */}
//       <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
//         <div>
//           <h1 className='text-3xl font-bold text-gray-900'>My Inventory</h1>
//           <p className='text-gray-500 text-sm mt-1'>
//             Manage your active listings and stock availability.
//           </p>
//         </div>

//         <div className='flex items-center gap-3 w-full md:w-auto'>
//           {/* Search (Visual Placeholder - connect logic later if needed) */}
//           <div className='relative flex-1 md:w-64'>
//             <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400' />
//             <Input
//               placeholder='Search stock...'
//               className='pl-9 h-10 bg-white'
//             />
//           </div>

//           <Link href='/dashboard/add'>
//             <Button className='bg-blue-600 hover:bg-blue-700 shadow-md h-10'>
//               <PlusCircle className='mr-2 h-4 w-4' /> Post Item
//             </Button>
//           </Link>
//         </div>
//       </div>

//       {/* 2. MAIN LIST CARD */}
//       <Card className='border-gray-200 shadow-sm overflow-hidden'>
//         <CardHeader className='bg-gray-50/50 border-b py-4 flex flex-row items-center justify-between'>
//           <div className='flex items-center gap-2'>
//             <CardTitle className='text-sm font-semibold uppercase tracking-wider text-gray-500'>
//               Active Listings
//             </CardTitle>
//             <span className='bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded-full'>
//               {products.length}
//             </span>
//           </div>

//           {/* Filter Trigger (Visual) */}
//           <Button variant='ghost' size='sm' className='text-gray-500 h-8'>
//             <Filter size={14} className='mr-2' /> Filter
//           </Button>
//         </CardHeader>

//         <CardContent className='p-0'>
//           {products.length === 0 ? (
//             // EMPTY STATE
//             <div className='text-center py-20 bg-gray-50/30'>
//               <div className='bg-white border-2 border-dashed border-gray-200 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-sm'>
//                 <PlusCircle className='h-8 w-8 text-blue-300' />
//               </div>
//               <h3 className='text-lg font-bold text-gray-900'>
//                 Your inventory is empty
//               </h3>
//               <p className='text-gray-500 max-w-sm mx-auto mt-2 mb-6 text-sm'>
//                 Start adding phones, laptops, or accessories to reach potential
//                 buyers.
//               </p>
//               <Link href='/dashboard/add'>
//                 <Button
//                   variant='outline'
//                   className='border-blue-200 text-blue-600 hover:bg-blue-50'
//                 >
//                   Add First Item
//                 </Button>
//               </Link>
//             </div>
//           ) : (
//             // THE LIST COMPONENT
//             // We wrap it in a div to ensure padding/structure inside the card
//             <div className='divide-y divide-gray-100'>
//               <InventoryList products={products} />
//             </div>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

/**After premium look and search, filter logic handled */

import { auth } from '@/auth';
import prisma from '@/lib/db';
import { redirect } from 'next/navigation';
import InventoryList from '@/components/dealer/InventoryLists';
import InventorySearch from '@/components/dealer/InventorySearch'; // Import
import InventoryFilter from '@/components/dealer/InventoryFilter'; // Import
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlusCircle, Search } from 'lucide-react'; // Ensure Search icon imported
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default async function InventoryPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  const session = await auth();
  if (!session || !session.user) redirect('/login');

  const { q, status = 'ALL' } = await searchParams; // Read Params

  const dealer = await prisma.dealerProfile.findUnique({
    where: { userId: session.user.id },
  });

  if (!dealer) redirect('/');

  // BUILD QUERY
  const whereClause: any = {
    dealerId: dealer.id,
  };

  // Search Logic
  if (q) {
    whereClause.OR = [
      { title: { contains: q, mode: 'insensitive' } },
      { model: { contains: q, mode: 'insensitive' } },
    ];
  }

  // Filter Logic
  if (status === 'SOLD') whereClause.isSold = true;
  if (status === 'ACTIVE') whereClause.isSold = false;

  const rawProducts = await prisma.product.findMany({
    where: whereClause,
    orderBy: { createdAt: 'desc' },
  });

  const products = rawProducts.map((product) => ({
    ...product,
    price: Number(product.price),
  }));

  return (
    <div className='max-w-7xl mx-auto space-y-6'>
      {/* 1. HEADER & ACTIONS */}
      <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
        <div>
          <h1 className='text-3xl font-bold text-gray-900'>My Inventory</h1>
          <p className='text-gray-500 text-sm mt-1'>
            Manage your active listings and stock availability.
          </p>
        </div>

        <div className='flex items-center gap-3 w-full md:w-auto'>
          {/* NEW SEARCH COMPONENT */}
          <InventorySearch />

          <Link href='/dashboard/add'>
            <Button className='bg-blue-600 hover:bg-blue-700 shadow-md h-10'>
              <PlusCircle className='mr-2 h-4 w-4' /> Post Item
            </Button>
          </Link>
        </div>
      </div>

      {/* 2. MAIN LIST CARD */}
      <Card className='border-gray-200 shadow-sm overflow-hidden'>
        <CardHeader className='bg-gray-50/50 border-b py-4 flex flex-row items-center justify-between'>
          <div className='flex items-center gap-2'>
            <CardTitle className='text-sm font-semibold uppercase tracking-wider text-gray-500'>
              Listings
            </CardTitle>
            <span className='bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded-full'>
              {products.length}
            </span>
          </div>

          {/* NEW FILTER COMPONENT */}
          <InventoryFilter />
        </CardHeader>

        <CardContent className='p-0'>
          {products.length === 0 ? (
            // EMPTY STATE LOGIC
            <div className='text-center py-20 bg-gray-50/30'>
              {q ? (
                // Case A: Search found nothing
                <>
                  <div className='bg-gray-100 p-3 rounded-full w-fit mx-auto mb-3'>
                    <Search className='h-6 w-6 text-gray-400' />
                  </div>
                  <h3 className='text-lg font-medium text-gray-900'>
                    No matches found
                  </h3>
                  <p className='text-gray-500 text-sm'>No items match "{q}"</p>
                  <Link
                    href='/dashboard/inventory'
                    className='text-blue-600 hover:underline text-sm mt-2 block'
                  >
                    Clear Search
                  </Link>
                </>
              ) : (
                // Case B: Truly empty inventory (or empty filter)
                <>
                  <div className='bg-white border-2 border-dashed border-gray-200 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-sm'>
                    <PlusCircle className='h-8 w-8 text-blue-300' />
                  </div>
                  <h3 className='text-lg font-bold text-gray-900'>
                    No items found
                  </h3>
                  <p className='text-gray-500 max-w-sm mx-auto mt-2 mb-6 text-sm'>
                    {status !== 'ALL'
                      ? `You have no ${status.toLowerCase()} items.`
                      : 'Start adding phones to reach potential buyers.'}
                  </p>
                  {status === 'ALL' && (
                    <Link href='/dashboard/add'>
                      <Button
                        variant='outline'
                        className='border-blue-200 text-blue-600 hover:bg-blue-50'
                      >
                        Add First Item
                      </Button>
                    </Link>
                  )}
                  {status !== 'ALL' && (
                    <Link
                      href='/dashboard/inventory'
                      className='text-blue-600 hover:underline text-sm'
                    >
                      Clear Filter
                    </Link>
                  )}
                </>
              )}
            </div>
          ) : (
            <div className='divide-y divide-gray-100'>
              <InventoryList products={products} />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
