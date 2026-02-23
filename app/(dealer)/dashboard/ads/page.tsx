import { auth } from '@/auth';
import prisma from '@/lib/db';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Megaphone, Plus, Clock, CheckCircle } from 'lucide-react';
import BuyCreditsButton from '@/components/dealer/BuyCreditsButton'; // We will create this
import PromoteButton from '@/components/dealer/PromoteButton'; // We will create this
import { formatDistanceToNow } from 'date-fns';
import InventorySearch from '@/components/dealer/InventorySearch';
import { Search } from 'lucide-react';

export default async function AdsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const session = await auth();
  const { q } = await searchParams;

  if (!session || !session.user) redirect('/login');

  // 1. Fetch Dealer & Inventory
  const dealer = await prisma.dealerProfile.findUnique({
    where: { userId: session.user.id },
    include: {
      products: {
        where: q
          ? {
              title: { contains: q, mode: 'insensitive' },
            }
          : undefined,
        orderBy: { isAd: 'desc' }, // Active Ads first
      },
    },
  });

  if (!dealer) redirect('/');

  return (
    <div className='max-w-6xl mx-auto space-y-8'>
      {/* HEADER & BALANCE */}
      <div className='flex flex-col md:flex-row justify-between items-end gap-6 bg-gradient-to-r from-yellow-500 to-orange-500 p-8 rounded-2xl text-white shadow-lg relative overflow-hidden'>
        {/* Background Decoration */}
        <Megaphone className='absolute -right-6 -bottom-6 h-40 w-40 text-white/10 rotate-12' />

        <div className='relative z-10'>
          <h1 className='text-3xl font-extrabold mb-2'>Ad Manager</h1>
          <p className='text-yellow-100 max-w-lg'>
            Boost your sales by promoting your items to the top of the homepage.
            Promoted items get 5x more views on average.
          </p>
        </div>

        <div className='relative z-10 bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 min-w-[200px] text-center'>
          <p className='text-xs uppercase font-bold text-yellow-100 tracking-wider mb-1'>
            Your Balance
          </p>
          <div className='text-4xl font-black mb-3'>
            {dealer.adCredits}{' '}
            <span className='text-lg font-medium opacity-80'>Credits</span>
          </div>
          <BuyCreditsButton />
        </div>
      </div>

      {/* ACTIVE ADS & INVENTORY */}
      <Card>
        <CardHeader className='border-b bg-gray-50/50 flex flex-row items-center justify-between'>
          <CardTitle className='flex items-center gap-2 text-lg'>
            <Megaphone size={20} className='text-orange-500' /> Manage
            Promotions
          </CardTitle>
          {/* ADD SEARCH BAR HERE */}
          <div className='w-full max-w-xs p-3'>
            <InventorySearch />
          </div>
        </CardHeader>
        <CardContent className='p-0'>
          <div className='divide-y'>
            {dealer.products.length === 0 ? (
              <div className='text-center py-20 text-gray-500'>
                <p>No products to promote yet.</p>
              </div>
            ) : (
              dealer.products.map((product) => (
                <div
                  key={product.id}
                  className={`p-4 flex flex-col sm:flex-row items-center justify-between gap-4 transition-colors ${product.isAd ? 'bg-yellow-50/50' : 'hover:bg-gray-50'}`}
                >
                  {/* Product Info */}
                  <div className='flex items-center gap-4 w-full sm:w-auto'>
                    <div className='h-14 w-14 rounded-lg bg-gray-100 border overflow-hidden flex-shrink-0'>
                      {product.images[0] && (
                        <img
                          src={product.images[0]}
                          className='h-full w-full object-cover'
                        />
                      )}
                    </div>
                    <div>
                      <h4 className='font-bold text-gray-900 line-clamp-1'>
                        {product.title}
                      </h4>
                      <p className='text-sm text-gray-500'>
                        GH₵ {Number(product.price).toLocaleString()}
                      </p>

                      {/* Status Badge */}
                      {product.isAd ? (
                        <div className='flex items-center gap-1.5 mt-1 text-xs font-bold text-orange-600 bg-orange-100 px-2 py-0.5 rounded w-fit'>
                          <Clock size={12} />
                          Expires{' '}
                          {product.adExpiresAt
                            ? formatDistanceToNow(product.adExpiresAt, {
                                addSuffix: true,
                              })
                            : 'soon'}
                        </div>
                      ) : (
                        <div className='flex items-center gap-1.5 mt-1 text-xs text-gray-400'>
                          Not Promoted
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className='w-full sm:w-auto'>
                    {product.isAd ? (
                      <Button
                        variant='outline'
                        size='sm'
                        className='w-full sm:w-auto border-orange-200 text-orange-600 bg-orange-50 cursor-default hover:bg-orange-50'
                      >
                        <CheckCircle size={14} className='mr-2' /> Active
                      </Button>
                    ) : (
                      <PromoteButton
                        productId={product.id}
                        credits={dealer.adCredits}
                      />
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
