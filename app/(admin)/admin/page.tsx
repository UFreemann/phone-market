/**Before premium look */
// import prisma from '@/lib/db';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Users, Package, DollarSign, Ban, CheckCircle } from 'lucide-react';

// export default async function AdminStats() {
//   const [
//     dealers,
//     products,
//     ads,
//     suspended,
//     totalDealers,
//     verifiedCount,
//     goldCount,
//     platinumCount,
//     freeCount,
//   ] = await Promise.all([
//     prisma.dealerProfile.count(),
//     prisma.product.count(),
//     prisma.product.count({ where: { isAd: true } }),
//     prisma.dealerProfile.count({ where: { subscriptionStatus: 'SUSPENDED' } }),
//     prisma.dealerProfile.count(),
//     prisma.dealerProfile.count({ where: { isVerified: true } }),
//     prisma.dealerProfile.count({ where: { subscriptionTier: 'GOLD' } }),
//     prisma.dealerProfile.count({ where: { subscriptionTier: 'PLATINUM' } }),
//     prisma.dealerProfile.count({ where: { subscriptionTier: 'FREE' } }),
//   ]);

//   return (
//     <div className='space-y-8'>
//       {/* 1. OVERVIEW GRID */}
//       <div>
//         <h2 className='text-xl font-bold mb-4'>Platform Overview</h2>
//         <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
//           <StatCard
//             title='Total Dealers'
//             value={totalDealers}
//             icon={<Users />}
//           />
//           <StatCard
//             title='Total Inventory'
//             value={products}
//             icon={<Package />}
//           />
//           <StatCard title='Active Ads' value={ads} icon={<DollarSign />} />
//           <StatCard
//             title='Suspended Accounts'
//             value={suspended}
//             icon={<Ban />}
//             color='text-red-600 bg-red-50'
//           />
//           <StatCard
//             title='Verified Shops'
//             value={verifiedCount}
//             icon={<CheckCircle />}
//             color='text-blue-600 bg-blue-50'
//           />
//         </div>
//       </div>

//       {/* 2. SUBSCRIPTION BREAKDOWN */}
//       <div>
//         <h2 className='text-xl font-bold mb-4'>Subscription Tiers</h2>
//         <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
//           <TierCard
//             title='Free / Trial'
//             count={freeCount}
//             color='bg-gray-100 border-gray-200'
//           />
//           <TierCard
//             title='Gold Plan'
//             count={goldCount}
//             color='bg-yellow-50 border-yellow-200 text-yellow-800'
//           />
//           <TierCard
//             title='Platinum Plan'
//             count={platinumCount}
//             color='bg-purple-50 border-purple-200 text-purple-800'
//           />
//         </div>
//       </div>
//     </div>
//   );
// }

// function StatCard({ title, value, icon }: any) {
//   return (
//     <Card>
//       <CardHeader className='flex flex-row items-center justify-between pb-2'>
//         <CardTitle className='text-sm font-medium text-gray-500'>
//           {title}
//         </CardTitle>
//         <div className='text-purple-600'>{icon}</div>
//       </CardHeader>
//       <CardContent>
//         <div className='text-2xl font-bold'>{value}</div>
//       </CardContent>
//     </Card>
//   );
// }

// function TierCard({ title, count, color }: any) {
//   return (
//     <div
//       className={`p-6 rounded-xl border ${color} flex flex-col items-center justify-center text-center`}
//     >
//       <span className='text-3xl font-black mb-1'>{count}</span>
//       <span className='text-sm font-medium opacity-80 uppercase tracking-wider'>
//         {title}
//       </span>
//     </div>
//   );
// }

/**After premium look */
import prisma from '@/lib/db';
import { Card, CardContent } from '@/components/ui/card';
import {
  Users,
  Package,
  DollarSign,
  Ban,
  CheckCircle,
  TrendingUp,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';
import { getAdminAnalytics } from '@/actions/admin-analytics';
import AdminCharts from '@/components/admin/AdminCharts';

export default async function AdminStats() {
  const [
    totalDealers,
    products,
    ads,
    suspended,
    verifiedCount,
    goldCount,
    platinumCount,
    freeCount,
    unverifiedCount,
    analyticsData,
  ] = await Promise.all([
    prisma.dealerProfile.count(),
    prisma.product.count(),
    prisma.product.count({ where: { isAd: true } }),
    prisma.dealerProfile.count({ where: { subscriptionStatus: 'SUSPENDED' } }),
    prisma.dealerProfile.count({ where: { isVerified: true } }),
    prisma.dealerProfile.count({ where: { subscriptionTier: 'GOLD' } }),
    prisma.dealerProfile.count({ where: { subscriptionTier: 'PLATINUM' } }),
    prisma.dealerProfile.count({ where: { subscriptionTier: 'FREE' } }),
    prisma.dealerProfile.count({
      where: {
        isVerified: false,
        subscriptionStatus: { not: 'SUSPENDED' }, // Don't count suspended users as just "unverified"
      },
    }),
    getAdminAnalytics(),
  ]);

  // Calculate percentages (Optional, for visual flair)
  const paidUsers = goldCount + platinumCount;
  const verificationRate =
    totalDealers > 0 ? Math.round((verifiedCount / totalDealers) * 100) : 0;

  return (
    <div className='max-w-7xl mx-auto space-y-10'>
      {/* --- 1. HERO SECTION --- */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        {/* Main Metric: Total Dealers */}
        <div className='bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl mt-4 p-6 text-white shadow-lg relative overflow-hidden group'>
          <div className='relative z-10'>
            <p className='text-blue-100 font-medium mb-1'>Total Dealers</p>
            <h2 className='text-4xl font-extrabold'>{totalDealers}</h2>
            <div className='mt-4 flex items-center gap-2 text-sm bg-white/10 w-fit px-3 py-1 rounded-full backdrop-blur-sm'>
              <UserCheck size={14} className='text-blue-200' />
              <span>
                {verifiedCount} Verified ({verificationRate}%)
              </span>
            </div>
          </div>
          <Users className='absolute -right-4 -bottom-4 h-32 w-32 text-white/10 group-hover:scale-110 transition-transform duration-500' />
        </div>

        {/* Inventory Metric */}
        <div className='bg-white border border-gray-200 rounded-2xl p-6 md:mt-4 shadow-sm relative overflow-hidden group hover:border-blue-200 transition-colors'>
          <div className='relative z-10'>
            <p className='text-gray-500 font-medium mb-1 uppercase text-xs tracking-wider'>
              Inventory
            </p>
            <h2 className='text-4xl font-extrabold text-gray-900'>
              {products}
            </h2>
            <p className='text-gray-400 text-sm mt-2'>
              Active listings across platform
            </p>
          </div>
          <Package className='absolute right-4 top-4 h-12 w-12 text-blue-50 group-hover:text-blue-100 transition-colors' />
          <div className='absolute bottom-0 left-0 w-full h-1 bg-blue-500' />
        </div>

        {/* Revenue/Ads Metric */}
        <div className='bg-white border border-gray-200 rounded-2xl p-6 md:mt-4 shadow-sm relative overflow-hidden group hover:border-yellow-200 transition-colors'>
          <div className='relative z-10'>
            <p className='text-gray-500 font-medium mb-1 uppercase text-xs tracking-wider'>
              Monetization
            </p>
            <h2 className='text-4xl font-extrabold text-gray-900'>{ads}</h2>
            <p className='text-gray-400 text-sm mt-2'>
              Paid Sponsored Ads running
            </p>
          </div>
          <DollarSign className='absolute right-4 top-4 h-12 w-12 text-yellow-50 group-hover:text-yellow-100 transition-colors' />
          <div className='absolute bottom-0 left-0 w-full h-1 bg-yellow-500' />
        </div>
      </div>

      {/* --- 2. SUBSCRIPTION BREAKDOWN --- */}
      <div>
        <h3 className='text-lg font-bold text-gray-800 mb-4 flex items-center gap-2'>
          <TrendingUp size={20} className='text-gray-400' /> Subscription Health
        </h3>
        <div className='grid grid-cols-1 sm:grid-cols-3 gap-6'>
          {/* Platinum Card */}
          <Card className='border-purple-100 bg-gradient-to-br from-white to-purple-50/50 shadow-sm hover:shadow-md transition-all'>
            <CardContent className='p-6'>
              <div className='flex justify-between items-start'>
                <div>
                  <p className='text-purple-600 font-bold text-sm uppercase tracking-wide'>
                    Platinum
                  </p>
                  <h4 className='text-3xl font-black text-gray-900 mt-2'>
                    {platinumCount}
                  </h4>
                </div>
                <div className='bg-purple-100 p-2 rounded-lg'>
                  <ShieldCheck className='h-6 w-6 text-purple-600' />
                </div>
              </div>
              <p className='text-xs text-gray-500 mt-4'>Top tier subscribers</p>
            </CardContent>
          </Card>

          {/* Gold Card */}
          <Card className='border-yellow-100 bg-gradient-to-br from-white to-yellow-50/50 shadow-sm hover:shadow-md transition-all'>
            <CardContent className='p-6'>
              <div className='flex justify-between items-start'>
                <div>
                  <p className='text-yellow-600 font-bold text-sm uppercase tracking-wide'>
                    Gold
                  </p>
                  <h4 className='text-3xl font-black text-gray-900 mt-2'>
                    {goldCount}
                  </h4>
                </div>
                <div className='bg-yellow-100 p-2 rounded-lg'>
                  <DollarSign className='h-6 w-6 text-yellow-600' />
                </div>
              </div>
              <p className='text-xs text-gray-500 mt-4'>Standard subscribers</p>
            </CardContent>
          </Card>

          {/* Free Card */}
          <Card className='border-gray-200 shadow-sm hover:shadow-md transition-all'>
            <CardContent className='p-6'>
              <div className='flex justify-between items-start'>
                <div>
                  <p className='text-gray-500 font-bold text-sm uppercase tracking-wide'>
                    Free / Trial
                  </p>
                  <h4 className='text-3xl font-black text-gray-900 mt-2'>
                    {freeCount}
                  </h4>
                </div>
                <div className='bg-gray-100 p-2 rounded-lg'>
                  <Users className='h-6 w-6 text-gray-500' />
                </div>
              </div>
              <p className='text-xs text-gray-500 mt-4'>Potential upgrades</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* --- 3. DEALER STATUS BREAKDOWN --- */}
      <div>
        <h3 className='text-lg font-bold text-gray-800 mb-4 flex items-center gap-2'>
          <ShieldCheck size={20} className='text-gray-400' /> Verification
          Status
        </h3>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          {/* Verified */}
          <div className='bg-white border border-green-200 rounded-xl p-5 flex items-center gap-4 shadow-sm hover:border-green-300 transition-colors'>
            <div className='bg-green-100 p-3 rounded-full text-green-600'>
              <CheckCircle size={24} />
            </div>
            <div>
              <p className='text-2xl font-bold text-gray-900'>
                {verifiedCount}
              </p>
              <p className='text-sm text-green-700 font-medium'>
                Verified Dealers
              </p>
            </div>
          </div>

          {/* Unverified / Pending */}
          <div className='bg-white border border-orange-200 rounded-xl p-5 flex items-center gap-4 shadow-sm hover:border-orange-300 transition-colors'>
            <div className='bg-orange-100 p-3 rounded-full text-orange-600'>
              <Users size={24} />
            </div>
            <div>
              <p className='text-2xl font-bold text-gray-900'>
                {unverifiedCount}
              </p>
              <p className='text-sm text-orange-700 font-medium'>
                Pending / Unverified
              </p>
            </div>
          </div>

          {/* Suspended */}
          <div className='bg-white border border-red-200 rounded-xl p-5 flex items-center gap-4 shadow-sm hover:border-red-300 transition-colors'>
            <div className='bg-red-100 p-3 rounded-full text-red-600'>
              <Ban size={24} />
            </div>
            <div>
              <p className='text-2xl font-bold text-gray-900'>{suspended}</p>
              <p className='text-sm text-red-700 font-medium'>
                Suspended Accounts
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* --- NEW: ANALYTICS SNEAK PEEK --- */}
      <div className='mb-8'>
        <AdminCharts data={analyticsData} />
      </div>

      {/* --- 3. ALERTS SECTION --- */}
      {/* {suspended > 0 && (
        <div className='bg-red-50 border border-red-200 rounded-xl p-4 flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <div className='bg-red-100 p-2 rounded-full'>
              <Ban className='h-5 w-5 text-red-600' />
            </div>
            <div>
              <h4 className='font-bold text-red-900'>Suspended Accounts</h4>
              <p className='text-sm text-red-700'>
                There are {suspended} dealers currently suspended.
              </p>
            </div>
          </div>
        </div>
      )} */}
    </div>
  );
}
