import { auth } from '@/auth';
import prisma from '@/lib/db';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PlusCircle, PlayCircle, Trash2, Calendar } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default async function DealerReelsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const session = await auth();
  if (!session || !session.user) redirect('/login');

  // 1. Get Dealer Profile
  const dealer = await prisma.dealerProfile.findUnique({
    where: { userId: session.user.id },
  });

  if (!dealer) redirect('/');

  const { page } = await searchParams;
  const currentPage = Number(page) || 1;
  const limit = 12; // 12 videos per page
  const offset = (currentPage - 1) * limit;

  // Fetch Dealer's Reels (Paginated)
  const reels = await prisma.reel.findMany({
    where: { dealerId: dealer.id },
    orderBy: { createdAt: 'desc' },
    take: limit,
    skip: offset,
  });

  // Get Total Count for Pagination Logic
  const totalCount = await prisma.reel.count({
    where: { dealerId: dealer.id },
  });
  const totalPages = Math.ceil(totalCount / limit);

  return (
    <div className='max-w-6xl mx-auto space-y-8'>
      {/* HEADER */}
      <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
        <div>
          <h1 className='text-3xl font-bold text-gray-900'>My Reels</h1>
          <p className='text-gray-500 text-sm mt-1'>
            Upload short videos of deliveries and stock to build trust.
          </p>
        </div>
        <Link href='/dashboard/reels/add'>
          <Button className='bg-blue-600 hover:bg-blue-700 shadow-md'>
            <PlusCircle className='mr-2 h-4 w-4' /> Post New Reel
          </Button>
        </Link>
      </div>

      {/* REELS GRID */}
      {reels.length === 0 ? (
        <div className='text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200'>
          <div className='bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4'>
            <PlayCircle className='h-8 w-8 text-gray-300' />
          </div>
          <h3 className='text-lg font-bold text-gray-900'>
            No reels posted yet
          </h3>
          <p className='text-gray-500 max-w-xs mx-auto mt-2 mb-6 text-sm'>
            Show your customers the delivery process or a quick look at your new
            arrivals.
          </p>
          <Link href='/dashboard/reels/add'>
            <Button
              variant='outline'
              className='border-blue-200 text-blue-600 hover:bg-blue-50'
            >
              Upload Your First Reel
            </Button>
          </Link>
        </div>
      ) : (
        <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6'>
          {reels.map((reel) => (
            <Card
              key={reel.id}
              className='overflow-hidden group border-none shadow-sm hover:shadow-md transition-all'
            >
              <div className='relative aspect-[9/16] bg-black'>
                <video
                  src={reel.videoUrl}
                  className='w-full h-full object-cover opacity-80'
                  preload='metadata'
                />
                <div className='absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20'>
                  <PlayCircle className='text-white h-12 w-12' />
                </div>

                {/* Delete Button Overlay */}
                <button className='absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg'>
                  <Trash2 size={14} />
                </button>
              </div>
              <CardContent className='p-3 bg-white'>
                <p className='text-xs text-gray-700 line-clamp-2 font-medium h-8'>
                  {reel.caption || 'No caption'}
                </p>
                <div className='mt-2 flex items-center gap-1 text-[10px] text-gray-400'>
                  <Calendar size={10} />
                  {formatDistanceToNow(new Date(reel.createdAt), {
                    addSuffix: true,
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* PAGINATION CONTROLS */}
      {totalPages > 1 && (
        <div className='flex justify-center gap-4 mt-8'>
          {currentPage > 1 && (
            <Link href={`?page=${currentPage - 1}`}>
              <Button variant='outline'>Previous</Button>
            </Link>
          )}
          <span className='flex items-center text-sm text-gray-500'>
            Page {currentPage} of {totalPages}
          </span>
          {currentPage < totalPages && (
            <Link href={`?page=${currentPage + 1}`}>
              <Button variant='outline'>Next</Button>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
