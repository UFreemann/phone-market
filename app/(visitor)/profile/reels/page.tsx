import { getReels } from '@/actions/get-reels';
import ReelsFeed from '@/components/public/ReelsFeed';

export default async function ReelsPage() {
  const reels = await getReels();
  return (
    <div className='min-h-screen bg-gray-900 py-8'>
      <h1 className='text-white text-center text-2xl font-bold mb-6'>
        Trending Reels
      </h1>
      <ReelsFeed reels={reels} />
    </div>
  );
}
