'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Store,
  MapPin,
  ExternalLink,
  BadgeCheck,
  ShieldCheck,
  Search,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import Link from 'next/link';
import FollowButton from '@/components/public/FollowButton';
import { useDebouncedCallback } from 'use-debounce';
import { MdVerified } from 'react-icons/md';

type FollowingListProps = {
  following: any[];
  totalPages: number;
  currentPage: number;
};

export default function FollowingList({
  following,
  totalPages,
  currentPage,
}: FollowingListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('q') || '');

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) params.set('q', term);
    else params.delete('q');
    params.set('page', '1'); // Reset to page 1 on search
    router.replace(`/profile/following?${params.toString()}`);
  }, 300);

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage.toString());
    router.push(`/profile/following?${params.toString()}`);
  };

  return (
    <div className='space-y-6'>
      {/* SEARCH BAR */}
      <div className='relative max-w-md'>
        <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400' />
        <Input
          placeholder='Search shops...'
          className='pl-10 bg-white'
          defaultValue={search}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>

      {/* LIST */}
      {following.length === 0 ? (
        <div className='text-center py-20 bg-white rounded-xl border border-dashed'>
          <div className='bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4'>
            <Store className='h-8 w-8 text-gray-400' />
          </div>
          <h3 className='text-lg font-medium text-gray-900'>No shops found</h3>
          <p className='text-sm text-gray-500 mt-1 mb-6'>
            Try adjusting your search or follow more dealers.
          </p>
          <Link href='/'>
            <Button>Browse Marketplace</Button>
          </Link>
        </div>
      ) : (
        <div className='grid gap-4'>
          {following.map((follow) => (
            <Card key={follow.id} className='hover:shadow-md transition-shadow'>
              <CardContent className='p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
                {/* Dealer Info */}
                <div className='flex items-center gap-4'>
                  <Avatar className='h-14 w-14 border'>
                    <AvatarImage src={follow.dealer.image || ''} />
                    <AvatarFallback className='bg-blue-100 text-blue-700 font-bold text-lg'>
                      {follow.dealer.shopName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <Link
                      href={`/shop/${follow.dealer.id}`}
                      className='font-bold text-lg text-gray-900 hover:underline flex items-center gap-1.5'
                    >
                      {follow.dealer.shopName}

                      {follow.dealer.isVerified && (
                        <>
                          {/* PLATINUM */}
                          {follow.dealer.subscriptionTier === 'PLATINUM' && (
                            <MdVerified size={16} className='text-purple-500' />
                          )}

                          {/* GOLD */}
                          {follow.dealer.subscriptionTier === 'GOLD' && (
                            <MdVerified size={16} className='text-yellow-500' />
                          )}

                          {/* FREE (Optional: Blue Tick or Nothing) */}
                          {/* If you want Free Verified users to have a badge, uncomment below */}
                          {/* {follow.dealer.subscriptionTier === 'FREE' && (
            <MdVerified size={16} className='text-blue-500' />
        )} */}
                        </>
                      )}
                    </Link>
                    <p className='text-sm text-gray-500 flex items-center gap-1 mt-0.5'>
                      <MapPin size={14} /> {follow.dealer.city} •{' '}
                      {follow.dealer._count.products} Items
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className='flex items-center gap-3 w-full sm:w-auto'>
                  <Link
                    href={`/shop/${follow.dealer.id}`}
                    className='flex-1 sm:flex-none'
                  >
                    <Button variant='outline' size='sm' className='w-full'>
                      Visit Shop <ExternalLink className='ml-2 h-3 w-3' />
                    </Button>
                  </Link>
                  <div className='flex-1 sm:flex-none'>
                    <FollowButton dealerId={follow.dealer.id} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className='flex justify-center gap-4 pt-4'>
          <Button
            variant='outline'
            disabled={currentPage <= 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            <ChevronLeft className='mr-2 h-4 w-4' /> Previous
          </Button>
          <span className='flex items-center text-sm font-medium text-gray-600'>
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant='outline'
            disabled={currentPage >= totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            Next <ChevronRight className='ml-2 h-4 w-4' />
          </Button>
        </div>
      )}
    </div>
  );
}
