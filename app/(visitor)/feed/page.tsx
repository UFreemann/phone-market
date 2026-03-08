import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { getFollowingFeed } from '@/actions/get-feed';
import ProductCard from '@/components/public/ProductCard';
import { Users, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import GenericSearch from '@/components/ui/GenericSearch'; // Import

export default async function ForYouPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const session = await auth();
  if (!session) redirect('/login?callbackUrl=/feed');

  const { q, page } = await searchParams;
  const currentPage = Number(page) || 1;
  const limit = 20;

  const { products, totalCount } = await getFollowingFeed(
    q,
    currentPage,
    limit,
  );
  const totalPages = Math.ceil(totalCount / limit);

  return (
    <div className='max-w-7xl mx-auto'>
      {/* HEADER & SEARCH */}
      <div className='flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900'>For You</h1>
          <p className='text-gray-500 text-sm'>
            Latest updates from dealers you follow.
          </p>
        </div>
        <GenericSearch placeholder='Search your feed...' />
      </div>

      {/* FEED GRID */}
      {products.length === 0 ? (
        <div className='text-center py-20 bg-white rounded-xl border border-dashed'>
          <div className='inline-flex bg-gray-100 p-4 rounded-full mb-4'>
            <Users className='h-8 w-8 text-gray-400' />
          </div>
          <h3 className='text-lg font-medium text-gray-900'>
            {q ? `No matches for "${q}"` : 'Your feed is empty'}
          </h3>
          <p className='text-gray-500 mb-6'>
            {q
              ? 'Try a different search term.'
              : 'Follow dealers to see their new phones here.'}
          </p>
          {!q && (
            <Link href='/'>
              <Button>Explore Marketplace</Button>
            </Link>
          )}
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

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className='flex justify-center gap-4 mt-10 pb-10'>
          <Link href={`?page=${currentPage - 1}${q ? `&q=${q}` : ''}`}>
            <Button variant='outline' disabled={currentPage <= 1}>
              <ChevronLeft className='mr-2 h-4 w-4' /> Previous
            </Button>
          </Link>
          <span className='flex items-center text-sm font-medium text-gray-600'>
            Page {currentPage} of {totalPages}
          </span>
          <Link href={`?page=${currentPage + 1}${q ? `&q=${q}` : ''}`}>
            <Button variant='outline' disabled={currentPage >= totalPages}>
              Next <ChevronRight className='ml-2 h-4 w-4' />
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
