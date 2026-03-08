'use client';
import { Card } from '@/components/ui/card';
import { Play } from 'lucide-react';
import Link from 'next/link';

export default function TrendingReels({ reels }: { reels: any[] }) {
  if (reels.length === 0) return null;

  return (
    <section className='max-w-7xl mx-auto px-4 mt-16 mb-16'>
      <h2 className='text-2xl font-bold mb-6 text-gray-900'>Trending Reels</h2>

      <div className='flex gap-4 overflow-x-auto pb-4 no-scrollbar snap-x'>
        {reels.map((reel) => (
          <Link
            key={reel.id}
            href='/profile/reels'
            className='snap-center flex-shrink-0'
          >
            <div className='relative w-40 h-72 rounded-xl overflow-hidden bg-black shadow-md hover:scale-105 transition-transform group'>
              <video
                src={reel.videoUrl}
                className='w-full h-full object-cover opacity-90'
                muted
              />

              <div className='absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-transparent transition-colors'>
                <Play className='text-white fill-white h-8 w-8 opacity-80' />
              </div>

              <div className='absolute bottom-0 left-0 w-full p-3 bg-gradient-to-t from-black/90 to-transparent text-white'>
                <p className='text-xs font-bold truncate'>
                  {reel.dealer.shopName}
                </p>
                <p className='text-[10px] opacity-80'>{reel.views} views</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
