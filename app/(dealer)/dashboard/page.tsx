/*Before premium look*/
// import { auth } from '@/auth';
// import prisma from '@/lib/db';
// import { redirect } from 'next/navigation';
// import Link from 'next/link';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import ProductRow from '@/components/dealer/ProductRow';
// import {
//   PlusCircle,
//   ArrowRight,
//   TrendingUp,
//   Users,
//   MessageSquare,
//   Eye,
//   Zap,
//   Crown,
//   Loader2,
// } from 'lucide-react';
// import NotificationBell from '@/components/dealer/NotificationBell';

// export default async function DashboardOverview() {
//   const session = await auth();
//   if (!session || !session.user) redirect('/login');

//   const dealer = await prisma.dealerProfile.findUnique({
//     where: { userId: session.user.id as string },
//     include: {
//       _count: { select: { products: true, leads: true, followers: true } },
//     },
//   });

//   if (!dealer)
//     return (
//       <div className='flex justify-center items-center'>
//         <Loader2 className='ml-2 h-4 w-4 animate-spin mx-2' />
//         <span className='font-semibold text-xl'>Loading...</span>
//       </div>
//     );

//   // Fetch ONLY 5 most recent items for the overview
//   const recentProducts = await prisma.product.findMany({
//     where: { dealerId: dealer.id },
//     orderBy: { createdAt: 'desc' },
//     take: 5,
//   });

//   // Check if they are on the Free Plan
//   const isFreePlan = dealer.subscriptionTier === 'FREE';

//   return (
//     <div className='max-w-6xl mx-auto'>
//       {/* --- PERSONALIZED HEADER --- */}
//       <div className='relative mb-8 rounded-xl overflow-hidden bg-white border shadow-sm group'>
//         {/* Banner Image */}
//         <div className='h-32 md:h-48 bg-gray-200 w-full relative'>
//           {dealer.coverImage ? (
//             <img
//               src={dealer.coverImage}
//               alt='Cover'
//               className='w-full h-full object-cover'
//             />
//           ) : (
//             <div className='w-full h-full bg-gradient-to-r from-blue-700 to-indigo-800' />
//           )}
//           <div className='absolute inset-0 bg-gradient-to-r from-black/80 via-black/20 to-transparent' />
//         </div>

//         {/* Content Overlay */}
//         <div className='absolute bottom-0 left-0 w-full p-4 md:p-6 flex justify-between items-end'>
//           {/* Left: Text */}
//           <div className='text-white'>
//             <h1 className='text-2xl md:text-3xl font-bold drop-shadow-md'>
//               {dealer.shopName}
//             </h1>
//             <p className='text-gray-200 text-xs md:text-sm flex items-center gap-2'>
//               <span className='opacity-80'>My Dashboard Overview</span>
//               {/* Show Plan Badge */}
//               <span
//                 className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold text-black ${
//                   dealer.subscriptionTier === 'PLATINUM'
//                     ? 'bg-purple-300'
//                     : 'bg-yellow-300'
//                 }`}
//               >
//                 {dealer.subscriptionTier}
//               </span>
//             </p>
//           </div>

//           {/* Right: Upgrade Button (Hidden on Mobile, Visible if NOT Platinum) */}
//           {dealer.subscriptionTier !== 'PLATINUM' && (
//             <Link href='/subscribe' className='hidden md:block'>
//               <Button className='bg-white/10 hover:bg-white/20 text-white border border-white/40 backdrop-blur-md shadow-xl transition-all hover:scale-105 cursor-pointer'>
//                 <Zap className='mr-2 h-4 w-4 text-yellow-400 fill-yellow-400' />
//                 Upgrade Plan
//               </Button>
//             </Link>
//           )}
//         </div>
//       </div>

//       {/* --- NEW: UPGRADE BANNER (Only for Free Users) --- */}
//       {isFreePlan && (
//         <div className='bg-gradient-to-r from-blue-700 to-indigo-600 rounded-xl p-6 mb-8 text-white shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4'>
//           <div>
//             <div className='flex items-center gap-2 mb-1'>
//               <Crown className='h-5 w-5 text-yellow-300 fill-yellow-300' />
//               <h3 className='font-bold text-lg'>Upgrade for 10x Visibility</h3>
//             </div>
//             <p className='text-blue-100 text-sm max-w-xl'>
//               Free accounts are limited to 3 phones. Upgrade to{' '}
//               <strong>Gold</strong> or <strong>Platinum</strong> to unlock
//               unlimited uploads, get the Verified Badge, and appear first in
//               search results.
//             </p>
//           </div>
//           <Link href='/subscribe'>
//             <Button className='bg-white text-blue-700 hover:bg-blue-50 font-bold border-none shadow-sm whitespace-nowrap'>
//               <Zap className='mr-2 h-4 w-4 fill-blue-700' /> Upgrade Now
//             </Button>
//           </Link>
//         </div>
//       )}

//       {/* Header */}
//       <div className='flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4'>
//         <div>
//           <h1 className='text-2xl md:text-3xl font-bold text-gray-900'>
//             Welcome back
//           </h1>
//           <p className='text-xs md:text-sm text-gray-500 mt-1'>
//             Surf your dashboard, {dealer.shopName}
//           </p>
//         </div>

//         {/* RIGHT: ACTIONS */}
//         <div className='flex items-center gap-3 w-full sm:w-auto'>
//           {/* BELL: Hidden on mobile (md:flex), Visible on Desktop */}
//           <div className='hidden md:block'>
//             <NotificationBell
//               endDate={dealer.subscriptionEnd}
//               isVerified={dealer.isVerified}
//               tier={dealer.subscriptionTier}
//               hasID={!!dealer.idCardImage}
//             />{' '}
//           </div>

//           {/* POST BUTTON: Full width on mobile, auto on desktop */}
//           <Link href='/dashboard/add' className='w-full sm:w-auto'>
//             <Button className='bg-blue-600 hover:bg-blue-700 w-full sm:w-auto'>
//               <PlusCircle className='mr-2 h-4 w-4' /> Post New Phone
//             </Button>
//           </Link>
//         </div>
//       </div>

//       {/* Stats Cards */}
//       <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
//         <StatCard
//           title='Total Inventory'
//           value={dealer._count.products}
//           icon={<TrendingUp className='text-blue-600' />}
//         />
//         <StatCard
//           title='Profile Views'
//           value={dealer.views}
//           icon={<Eye className='text-orange-600' />}
//         />
//         <StatCard
//           title='Leads / Messages'
//           value={dealer._count.leads}
//           icon={<MessageSquare className='text-green-600' />}
//         />
//         <StatCard
//           title='Total Followers'
//           value={dealer._count.followers}
//           icon={<Users className='text-purple-600' />}
//         />
//       </div>

//       {/* Recent Inventory Section */}
//       <div className='bg-white rounded-xl border shadow-sm p-6'>
//         <div className='flex justify-between items-center mb-6'>
//           <h2 className='text-xl font-semibold'>Recently Posted</h2>
//           <Link
//             href='/dashboard/inventory'
//             className='text-sm text-blue-600 hover:underline flex items-center'
//           >
//             View All Inventory <ArrowRight className='ml-1 h-4 w-4' />
//           </Link>
//         </div>

//         {recentProducts.length === 0 ? (
//           <div className='text-center py-10 text-gray-500'>
//             <p>No activity yet.</p>
//           </div>
//         ) : (
//           <div className='space-y-4'>
//             {recentProducts.map((product) => (
//               <ProductRow
//                 key={product.id}
//                 id={product.id}
//                 title={product.title}
//                 price={Number(product.price)}
//                 image={product.images[0]}
//                 isSold={product.isSold}
//                 views={0}
//               />
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// function StatCard({ title, value, icon }: any) {
//   return (
//     <Card>
//       <CardHeader className='flex flex-row items-center justify-between pb-2 space-y-0'>
//         <CardTitle className='text-sm font-medium text-gray-500'>
//           {title}
//         </CardTitle>
//         {icon}
//       </CardHeader>
//       <CardContent>
//         <div className='text-2xl font-bold'>{value}</div>
//       </CardContent>
//     </Card>
//   );
// }

/*After premium look*/
import { auth } from '@/auth';
import prisma from '@/lib/db';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import ProductRow from '@/components/dealer/ProductRow';
import {
  PlusCircle,
  ArrowRight,
  TrendingUp,
  Users,
  MessageSquare,
  Eye,
  Zap,
  Crown,
  Loader2,
} from 'lucide-react';
import NotificationBell from '@/components/dealer/NotificationBell';
import { subDays } from 'date-fns';
import MiniChart from '@/components/dealer/MiniChart';

export default async function DashboardOverview() {
  const session = await auth();
  if (!session || !session.user) redirect('/login');

  const dealer = await prisma.dealerProfile.findUnique({
    where: { userId: session.user.id as string },
    include: {
      _count: { select: { products: true, leads: true, followers: true } },
    },
  });

  if (!dealer)
    return (
      <div className='flex justify-center items-center h-[50vh]'>
        <Loader2 className='ml-2 h-6 w-6 animate-spin text-blue-600' />
      </div>
    );

  const recentProducts = await prisma.product.findMany({
    where: { dealerId: dealer.id },
    orderBy: { createdAt: 'desc' },
    take: 5,
  });

  const isFreePlan = dealer.subscriptionTier === 'FREE';

  // Fetch 7 Days Data
  const sevenDaysAgo = subDays(new Date(), 7);
  const miniStats = await prisma.dailyStat.findMany({
    where: { dealerId: dealer.id, date: { gte: sevenDaysAgo } },
    orderBy: { date: 'asc' },
    select: { views: true, date: true }, // Only fetch views for the mini chart
  });

  return (
    <div className='max-w-7xl mx-auto space-y-8'>
      {/* --- 1. HERO BANNER & ACTIONS --- */}
      <div className='relative rounded-2xl overflow-hidden bg-white border border-gray-200 shadow-sm group'>
        {/* Banner Background */}
        <div className='h-40 md:h-52 bg-gray-900 w-full relative'>
          {dealer.coverImage ? (
            <img
              src={dealer.coverImage}
              alt='Cover'
              className='w-full h-full object-cover opacity-90'
            />
          ) : (
            <div className='w-full h-full bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900' />
          )}
          <div className='absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent' />
        </div>

        {/* Content Overlay */}
        <div className='absolute bottom-0 left-0 w-full p-6 flex flex-col md:flex-row justify-between items-end gap-4'>
          {/* Shop Info */}
          <div className='text-white space-y-1'>
            <div className='flex items-center gap-3'>
              <div className='h-12 w-12 rounded-full border-2 border-white/20 overflow-hidden bg-white/10 backdrop-blur-sm flex items-center justify-center shadow-lg'>
                {dealer.image ? (
                  <img
                    src={dealer.image}
                    className='h-full w-full object-cover'
                  />
                ) : (
                  <span className='font-bold text-lg'>
                    {dealer.shopName.charAt(0)}
                  </span>
                )}
              </div>
              <div>
                <h1 className='text-2xl md:text-3xl font-bold tracking-tight'>
                  {dealer.shopName}
                </h1>
                <div className='flex items-center gap-2 text-xs text-gray-300 font-medium'>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold text-black shadow-sm ${dealer.subscriptionTier === 'PLATINUM' ? 'bg-purple-300' : 'bg-yellow-400'}`}
                  >
                    {dealer.subscriptionTier}
                  </span>
                  <span>•</span>
                  <span>Dashboard Overview</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons (Floating) */}
          <div className='flex items-center gap-3 w-full md:w-auto'>
            {/* Bell (Hidden on mobile as it's in header) */}
            <div className='hidden md:block'>
              <NotificationBell
                endDate={dealer.subscriptionEnd}
                isVerified={dealer.isVerified}
                tier={dealer.subscriptionTier}
                hasID={!!dealer.idCardImage}
              />
            </div>

            {dealer.subscriptionTier !== 'PLATINUM' && (
              <Link href='/subscribe' className='hidden md:block'>
                <Button
                  variant='outline'
                  className='bg-white/10 text-white border-white/20 hover:bg-white/20 backdrop-blur-md'
                >
                  <Zap className='mr-2 h-4 w-4 text-yellow-400 fill-yellow-400' />{' '}
                  Upgrade
                </Button>
              </Link>
            )}

            <Link href='/dashboard/add' className='flex-1 md:flex-none'>
              <Button className='bg-blue-600 hover:bg-blue-700 w-full md:w-auto shadow-lg shadow-blue-900/20 font-bold'>
                <PlusCircle className='mr-2 h-4 w-4' /> Post New Phone
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* --- 2. UPGRADE ALERT (If Free) --- */}
      {isFreePlan && (
        <div className='bg-gradient-to-r from-indigo-600 to-blue-600 rounded-xl p-1 shadow-sm'>
          <div className='bg-white/10 backdrop-blur-sm rounded-lg p-4 md:p-6 flex flex-col md:flex-row items-center justify-between gap-4 text-white'>
            <div className='flex items-start gap-4'>
              <div className='bg-white/20 p-3 rounded-full hidden md:block'>
                <Crown className='h-6 w-6 text-yellow-300 fill-yellow-300' />
              </div>
              <div>
                <h3 className='font-bold text-lg'>Unlock 10x Visibility</h3>
                <p className='text-blue-100 text-sm max-w-xl leading-relaxed opacity-90'>
                  Upgrade to <strong className='text-white'>Gold</strong> or{' '}
                  <strong className='text-white'>Platinum</strong> to get
                  unlimited uploads, the Verified Badge, and priority ranking.
                </p>
              </div>
            </div>
            <Link href='/subscribe' className='w-full md:w-auto'>
              <Button className='bg-white text-blue-700 hover:bg-blue-50 font-bold w-full md:w-auto'>
                View Plans
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* --- 3. PREMIUM STATS GRID --- */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6'>
        <StatCard
          title='Total Inventory'
          value={dealer._count.products}
          icon={<TrendingUp className='text-blue-600' />}
          color='border-l-4 border-l-blue-500'
        />
        <StatCard
          title='Profile Views'
          value={dealer.views}
          icon={<Eye className='text-orange-600' />}
          color='border-l-4 border-l-orange-500'
        />
        <StatCard
          title='Leads / Messages'
          value={dealer._count.leads}
          icon={<MessageSquare className='text-green-600' />}
          color='border-l-4 border-l-green-500'
        />
        <StatCard
          title='Total Followers'
          value={dealer._count.followers}
          icon={<Users className='text-purple-600' />}
          color='border-l-4 border-l-purple-500'
        />
      </div>

      {/* --- TRAFFIC TEASER --- */}
      <div className='mb-8'>
        <Link href='/dashboard/analytics' className='block group relative'>
          <Card className='hover:border-blue-300 transition-all overflow-hidden border-blue-100 bg-blue-50/30'>
            <CardContent className='p-6 flex flex-col md:flex-row items-center gap-6'>
              {/* Text Side */}
              <div className='flex-1'>
                <h3 className='text-lg font-bold text-gray-900 flex items-center gap-2'>
                  <TrendingUp size={20} className='text-blue-600' />
                  Traffic Insight
                </h3>
                <p className='text-sm text-gray-500 mt-1'>
                  See how many customers viewed your shop in the last 7 days.
                </p>
                <div className='mt-4 text-blue-600 font-semibold text-sm group-hover:underline flex items-center'>
                  Open Full Analytics <ArrowRight size={14} className='ml-1' />
                </div>
              </div>

              {/* Chart Side */}
              <div className='w-full md:w-64 relative'>
                <MiniChart data={miniStats} />

                {/* The "Teaser" Overlay (Only for Non-Platinum) */}
                {dealer.subscriptionTier !== 'PLATINUM' && (
                  <div className='absolute inset-0 bg-white/40 backdrop-blur-[1px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity'>
                    <span className='bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg'>
                      Platinum Feature
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* --- 4. RECENT INVENTORY --- */}
      <div className='bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden'>
        <div className='p-6 border-b bg-gray-50/50 flex justify-between items-center'>
          <h2 className='text-lg font-bold text-gray-800'>Recent Activity</h2>
          <Link
            href='/dashboard/inventory'
            className='text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center group'
          >
            View All{' '}
            <ArrowRight className='ml-1 h-4 w-4 transition-transform group-hover:translate-x-1' />
          </Link>
        </div>

        <div className='p-6'>
          {recentProducts.length === 0 ? (
            <div className='text-center py-16 text-gray-400 bg-gray-50 rounded-lg border-2 border-dashed'>
              <p>No phones posted yet.</p>
              <Link
                href='/dashboard/add'
                className='text-blue-600 text-sm font-medium hover:underline mt-2 inline-block'
              >
                Start Selling
              </Link>
            </div>
          ) : (
            <div className='space-y-3'>
              {recentProducts.map((product) => (
                <ProductRow
                  key={product.id}
                  id={product.id}
                  title={product.title}
                  price={Number(product.price)}
                  image={product.images[0]}
                  isSold={product.isSold}
                  views={0}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Updated StatCard with color accent
function StatCard({ title, value, icon, color }: any) {
  return (
    <Card className={`shadow-sm hover:shadow-md transition-shadow ${color}`}>
      <CardContent className='p-6 flex items-center justify-between'>
        <div>
          <p className='text-sm font-medium text-gray-500 uppercase tracking-wide'>
            {title}
          </p>
          <div className='text-3xl font-extrabold text-gray-900 mt-1'>
            {value}
          </div>
        </div>
        <div className='p-3 bg-gray-50 rounded-full'>{icon}</div>
      </CardContent>
    </Card>
  );
}
