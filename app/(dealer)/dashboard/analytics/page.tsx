// 'use client';

// import {
//   AreaChart,
//   Area,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
// } from 'recharts';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Lock } from 'lucide-react';
// import Link from 'next/link';
// import { Button } from '@/components/ui/button';

// export default function AnalyticsCharts({ data }: { data: any[] }) {
//   return (
//     <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
//       {/* TRAFFIC CHART */}
//       <Card className='shadow-sm border-none bg-gradient-to-br from-white to-gray-50'>
//         <CardHeader>
//           <CardTitle className='text-sm font-medium uppercase tracking-wider text-gray-500'>
//             Traffic Overview (30 Days)
//           </CardTitle>
//         </CardHeader>
//         <CardContent className='h-[300px]'>
//           <ResponsiveContainer width='100%' height='100%'>
//             <AreaChart data={data}>
//               <defs>
//                 <linearGradient id='colorViews' x1='0' y1='0' x2='0' y2='1'>
//                   <stop offset='5%' stopColor='#8884d8' stopOpacity={0.8} />
//                   <stop offset='95%' stopColor='#8884d8' stopOpacity={0} />
//                 </linearGradient>
//                 <linearGradient id='colorLeads' x1='0' y1='0' x2='0' y2='1'>
//                   <stop offset='5%' stopColor='#82ca9d' stopOpacity={0.8} />
//                   <stop offset='95%' stopColor='#82ca9d' stopOpacity={0} />
//                 </linearGradient>
//               </defs>
//               <XAxis
//                 dataKey='date'
//                 fontSize={10}
//                 tickLine={false}
//                 axisLine={false}
//               />
//               <YAxis fontSize={10} tickLine={false} axisLine={false} />
//               <CartesianGrid
//                 vertical={false}
//                 strokeDasharray='3 3'
//                 opacity={0.3}
//               />
//               <Tooltip
//                 contentStyle={{
//                   borderRadius: '8px',
//                   border: 'none',
//                   boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
//                 }}
//               />
//               <Area
//                 type='monotone'
//                 dataKey='views'
//                 stroke='#8884d8'
//                 fillOpacity={1}
//                 fill='url(#colorViews)'
//                 strokeWidth={2}
//               />
//               <Area
//                 type='monotone'
//                 dataKey='leads'
//                 stroke='#82ca9d'
//                 fillOpacity={1}
//                 fill='url(#colorLeads)'
//                 strokeWidth={2}
//               />
//             </AreaChart>
//           </ResponsiveContainer>
//         </CardContent>
//       </Card>

//       {/* ... More Charts ... */}
//     </div>
//   );
// }

// function LockedAnalytics() {
//   return (
//     <div className='relative h-[600px] overflow-hidden rounded-xl border'>
//       {/* Fake Blurry Background */}
//       <div className="absolute inset-0 bg-[url('/chart-placeholder.png')] bg-cover blur-md opacity-50" />

//       <div className='absolute inset-0 flex flex-col items-center justify-center bg-white/60 backdrop-blur-sm p-8 text-center'>
//         <div className='bg-purple-100 p-4 rounded-full mb-4'>
//           <Lock className='h-8 w-8 text-purple-600' />
//         </div>
//         <h2 className='text-2xl font-bold text-gray-900 mb-2'>
//           Unlock Advanced Analytics
//         </h2>
//         <p className='text-gray-600 max-w-md mb-6'>
//           See exactly how your shop is performing. Track views, leads, and
//           customer behavior with Platinum.
//         </p>
//         <Link href='/subscribe'>
//           <Button className='bg-purple-600 hover:bg-purple-700'>
//             Upgrade to Platinum
//           </Button>
//         </Link>
//       </div>
//     </div>
//   );
// }

import { auth } from '@/auth';
import prisma from '@/lib/db';
import { redirect } from 'next/navigation';
import AnalyticsCharts from '@/components/dealer/AnalyticsCharts';
import { Lock, Crown } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default async function AnalyticsPage() {
  const session = await auth();
  if (!session || !session.user) redirect('/login');

  const dealer = await prisma.dealerProfile.findUnique({
    where: { userId: session.user.id },
  });

  if (!dealer) redirect('/');

  // 1. GATE: Only Platinum
  const isPlatinum = dealer.subscriptionTier === 'PLATINUM';

  if (!isPlatinum) {
    return (
      <div className='max-w-5xl mx-auto py-10 relative h-[80vh] overflow-hidden'>
        {/* Fake Content Background (Blurred) */}
        <div className='absolute inset-0 bg-white grid grid-cols-2 gap-8 opacity-40 blur-sm pointer-events-none'>
          <div className='h-64 bg-gray-200 rounded-xl' />
          <div className='h-64 bg-gray-200 rounded-xl' />
          <div className='h-96 bg-gray-200 rounded-xl col-span-2' />
        </div>

        {/* Lock Overlay */}
        <div className='absolute inset-0 flex flex-col items-center justify-center z-10 p-4 text-center'>
          <div className='bg-gradient-to-br from-purple-100 to-indigo-100 p-6 rounded-full mb-6 shadow-sm'>
            <Lock className='h-12 w-12 text-purple-600' />
          </div>
          <h1 className='text-4xl font-extrabold text-gray-900 mb-4 tracking-tight'>
            Advanced Analytics Locked
          </h1>
          <p className='text-gray-500 max-w-md text-lg mb-8 leading-relaxed'>
            Gain deep insights into your customer behavior. Track daily views,
            top performing products, and lead conversion rates.
          </p>

          <div className='flex flex-col sm:flex-row gap-4'>
            <Link href='/subscribe'>
              <Button
                size='lg'
                className='bg-purple-600 hover:bg-purple-700 text-white font-bold h-12 px-8 shadow-xl shadow-purple-200'
              >
                <Crown className='mr-2 h-5 w-5' /> Upgrade to Platinum
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 2. FETCH DATA (Only if Platinum)

  // A. Daily Stats (Last 30 Days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const dailyStats = await prisma.dailyStat.findMany({
    where: {
      dealerId: dealer.id,
      date: { gte: thirtyDaysAgo },
    },
    orderBy: { date: 'asc' },
  });

  // B. Top Products(raw)
  const rawTopProducts = await prisma.product.findMany({
    where: { dealerId: dealer.id },
    orderBy: { leads: { _count: 'desc' } }, // Sort by most leads
    take: 5,
    include: {
      _count: { select: { leads: true } },
    },
  });

  // TRANSFORM DATA (Decimal -> Number)
  const topProducts = rawTopProducts.map((p) => ({
    ...p,
    price: Number(p.price), // <--- CONVERSION HERE
  }));

  return (
    <div className='max-w-6xl mx-auto space-y-6'>
      <div className='flex justify-between items-end'>
        <h1 className='text-3xl font-bold text-gray-900'>
          Performance Analytics
        </h1>
        <span className='text-sm text-gray-500'>Last 30 Days</span>
      </div>

      <AnalyticsCharts data={dailyStats} topProducts={topProducts} />
    </div>
  );
}
