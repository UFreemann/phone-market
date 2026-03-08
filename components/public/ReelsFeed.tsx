import ReelPlayer from './ReelPlayer';

export default function ReelsFeed({ reels }: { reels: any[] }) {
  return (
    // 1. Parent: Full height, scrollable, snap-y
    <div className='w-full h-[calc(100vh-64px)] overflow-y-scroll snap-y snap-mandatory no-scrollbar bg-black'>
      {reels.map((reel) => (
        // 2. Child: Full height of viewport, snap-center
        <div
          key={reel.id}
          className='snap-center w-full h-full flex items-center justify-center bg-black relative'
        >
          {/* 3. Wrapper to constrain width on desktop */}
          <div className='w-full max-w-md h-full relative'>
            <ReelPlayer reel={reel} />
          </div>
        </div>
      ))}
    </div>
  );
}
