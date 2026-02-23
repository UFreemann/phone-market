import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { getFollowingFeed } from '@/actions/get-feed';
import ProductCard from '@/components/public/ProductCard';
import { Sparkles, Users } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default async function ForYouPage() {
  const session = await auth();

  if (!session) {
    // If not logged in, they can't have a personalized feed
    redirect('/login?callbackUrl=/feed');
  }

  const products = await getFollowingFeed();

  return (
    <div className='min-h-screen bg-gray-50 py-10 px-4'>
      <div className='max-w-7xl mx-auto'>
        {/* HEADER */}
        <div className='flex items-center gap-3 mb-8'>
          <div className='bg-purple-100 p-3 rounded-full'>
            <Sparkles className='h-6 w-6 text-purple-600 fill-purple-200' />
          </div>
          <div>
            <h1 className='text-3xl font-bold text-gray-900'>For You</h1>
            <p className='text-gray-500'>
              Latest updates from dealers you follow.
            </p>
          </div>
        </div>

        {/* FEED GRID */}
        {products.length === 0 ? (
          <div className='text-center py-20 bg-white rounded-xl border border-dashed'>
            <div className='inline-flex bg-gray-100 p-4 rounded-full mb-4'>
              <Users className='h-8 w-8 text-gray-400' />
            </div>
            <h3 className='text-lg font-medium text-gray-900'>
              Your feed is empty
            </h3>
            <p className='text-gray-500 mb-6'>
              Follow dealers to see their new phones here.
            </p>
            <Link href='/'>
              <Button>Explore Marketplace</Button>
            </Link>
          </div>
        ) : (
          <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-6'>
            {products.map((product) => (
              <ProductCard
                key={product.id}
                {...product}
                image={product.images[0]}
                dealer={product.dealer as any}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
