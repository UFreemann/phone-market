import { auth } from '@/auth';
import prisma from '@/lib/db';
import { redirect } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Heart,
  Store,
  Zap,
  PlayCircle,
  ArrowRight,
  ShoppingBag,
} from 'lucide-react';
import Link from 'next/link';
import ProductCard from '@/components/public/ProductCard';

export default async function VisitorOverview() {
  const session = await auth();
  if (!session?.user) redirect('/login');

  // Fetch Stats
  const [savedCount, followingCount, recentSaved] = await Promise.all([
    prisma.savedItem.count({ where: { userId: session.user.id } }),
    prisma.follow.count({ where: { visitorId: session.user.id } }),
    prisma.savedItem.findMany({
      where: { userId: session.user.id },
      take: 4,
      orderBy: { createdAt: 'desc' },
      include: { product: { include: { dealer: true } } },
    }),
  ]);

  return (
    <div className='max-w-6xl mx-auto space-y-10 pb-20'>
      {/* 1. HERO HEADER */}
      <div className='relative bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 md:p-12 text-white shadow-xl overflow-hidden'>
        {/* Background Decor */}
        <div className='absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16' />
        <div className='absolute bottom-0 left-0 w-40 h-40 bg-black/10 rounded-full blur-2xl -ml-10 -mb-10' />

        <div className='relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6'>
          <div className='h-20 w-20 rounded-full bg-white/20 backdrop-blur-md border-2 border-white/30 flex items-center justify-center text-3xl font-bold shadow-inner'>
            {session.user.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div>
            <h1 className='text-3xl md:text-4xl font-bold tracking-tight'>
              Hello, {session.user.name || 'Visitor'}
            </h1>
            <p className='text-blue-100 mt-2 text-lg'>
              Welcome back to your personal shopping hub.
            </p>
          </div>
        </div>
      </div>

      {/* 2. STATS GRID */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6 -mt-8 px-4 relative z-10'>
        <StatCard
          title='Saved Items'
          value={savedCount}
          icon={<Heart className='text-red-500 fill-red-500' />}
          link='/save'
          color='hover:border-red-200 hover:shadow-red-100'
        />
        <StatCard
          title='Following'
          value={followingCount}
          icon={<Store className='text-blue-500' />}
          link='/profile/following'
          color='hover:border-blue-200 hover:shadow-blue-100'
        />
        <StatCard
          title='Reels Feed'
          value='Watch'
          icon={<PlayCircle className='text-pink-500 fill-pink-500' />}
          link='/profile/reels'
          color='hover:border-pink-200 hover:shadow-pink-100'
        />
      </div>

      {/* 3. BECOME A DEALER AD (Upsell) */}
      <div className='bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-1 shadow-sm mx-4 md:mx-0'>
        <div className='bg-gray-900/50 backdrop-blur-sm rounded-xl p-8 flex flex-col md:flex-row items-center justify-between gap-8 border border-white/10'>
          <div className='flex items-start gap-4'>
            <div className='bg-yellow-500/20 p-3 rounded-full hidden md:block'>
              <Zap className='h-8 w-8 text-yellow-400 fill-yellow-400' />
            </div>
            <div>
              <h2 className='text-2xl font-bold text-white mb-2'>
                Start Selling Today
              </h2>
              <p className='text-gray-400 max-w-lg leading-relaxed'>
                Got phones to sell? Create a Dealer Profile and reach thousands
                of buyers. Get a{' '}
                <span className='text-yellow-400 font-bold'>
                  7-Day Free Trial
                </span>{' '}
                instantly.
              </p>
            </div>
          </div>
          <Link href='/register'>
            <Button
              size='lg'
              className='bg-yellow-500 text-black hover:bg-yellow-400 font-bold px-8 h-12 shadow-lg shadow-yellow-900/20 transition-transform hover:scale-105'
            >
              Become a Dealer
            </Button>
          </Link>
        </div>
      </div>

      {/* 4. RECENTLY SAVED */}
      <div className='px-4 md:px-0'>
        <div className='flex justify-between items-end mb-6 border-b pb-4'>
          <div>
            <h3 className='text-xl font-bold text-gray-900 flex items-center gap-2'>
              <ShoppingBag className='text-blue-600' size={20} /> Recently Saved
            </h3>
          </div>
          <Link
            href='/saved'
            className='text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1 group'
          >
            View All{' '}
            <ArrowRight
              size={16}
              className='transition-transform group-hover:translate-x-1'
            />
          </Link>
        </div>

        {recentSaved.length === 0 ? (
          <div className='text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200'>
            <div className='bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4'>
              <Heart className='h-8 w-8 text-gray-300' />
            </div>
            <h3 className='text-lg font-medium text-gray-900'>
              No saved items yet
            </h3>
            <p className='text-gray-500 mb-6 text-sm'>
              Start browsing to build your wishlist.
            </p>
            <Link href='/'>
              <Button variant='outline'>Explore Marketplace</Button>
            </Link>
          </div>
        ) : (
          <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6'>
            {recentSaved.map((item) => (
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
    </div>
  );
}

function StatCard({ title, value, icon, link, color }: any) {
  return (
    <Link href={link} className='block group'>
      <Card
        className={`border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 ${color}`}
      >
        <CardContent className='p-6 flex items-center justify-between'>
          <div>
            <p className='text-xs font-bold text-gray-400 uppercase tracking-wider mb-1'>
              {title}
            </p>
            <p className='text-3xl font-black text-gray-900 group-hover:scale-105 transition-transform origin-left'>
              {value}
            </p>
          </div>
          <div className='p-3 bg-gray-50 rounded-xl group-hover:bg-white group-hover:shadow-sm transition-all'>
            {icon}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
