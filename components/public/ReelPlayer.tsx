'use client';

import { useState, useRef, useEffect } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import Link from 'next/link';
import { Heart, Share2, Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { toggleReelLike, getReelStatus } from '@/actions/reel-actions';
import { toast } from 'sonner';
import { useInView } from 'react-intersection-observer'; // npm install react-intersection-observer
import { trackReelView } from '@/actions/track-reel-view';

export default function ReelPlayer({ reel }: { reel: any }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true); // Auto-play requires mute initially
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(reel.likeCount);

  // Intersection Observer (Auto Play/Pause)
  const { ref, inView } = useInView({
    threshold: 0.6, // 60% visible
  });

  useEffect(() => {
    if (inView) {
      videoRef.current?.play().catch(() => {}); // Ignore auto-play errors
      setPlaying(true);

      // Track View (Debounce or check if already tracked in this session to avoid spam)
      // Simple version:
      trackReelView(reel.id);
    } else {
      videoRef.current?.pause();
      setPlaying(false);
    }
  }, [inView]);

  // Check Like Status
  useEffect(() => {
    getReelStatus(reel.id).then(setLiked);
  }, [reel.id]);

  const togglePlay = () => {
    if (playing) {
      videoRef.current?.pause();
      setPlaying(false);
    } else {
      videoRef.current?.play();
      setPlaying(true);
    }
  };

  const handleLike = async () => {
    // Optimistic Update
    const newLiked = !liked;
    setLiked(newLiked);
    setLikesCount((prev: number) => (newLiked ? prev + 1 : prev - 1));

    await toggleReelLike(reel.id);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Check out this reel from ${reel.dealer.shopName}`,
          url: window.location.href,
        });
      } catch (err) {}
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  return (
    <div ref={ref} className='relative bg-black h-full w-full overflow-hidden'>
      {/* VIDEO */}
      <video
        ref={videoRef}
        src={reel.videoUrl}
        className='w-full h-full object-cover'
        loop
        muted={muted}
        playsInline
        onClick={togglePlay}
      />

      {/* CENTER PLAY ICON (If paused) */}
      {!playing && (
        <div className='absolute inset-0 flex items-center justify-center pointer-events-none bg-black/20'>
          <Play className='w-16 h-16 text-white/80 fill-white/80' />
        </div>
      )}

      {/* MUTE TOGGLE */}
      <button
        onClick={() => setMuted(!muted)}
        className='absolute top-4 right-4 bg-black/40 p-2 rounded-full text-white backdrop-blur-sm'
      >
        {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
      </button>

      {/* OVERLAY INFO */}
      <div className='absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/90 via-black/40 to-transparent text-white pt-20'>
        <div className='flex items-center gap-3 mb-3'>
          <Avatar className='h-10 w-10 border-2 border-white shadow-sm'>
            <AvatarImage src={reel.dealer.image} />
            <AvatarFallback className='text-black font-bold'>
              {reel.dealer.shopName[0]}
            </AvatarFallback>
          </Avatar>
          <Link
            href={`/shop/${reel.dealer.id}`}
            className='font-bold hover:underline text-shadow-sm'
          >
            {reel.dealer.shopName}
          </Link>
        </div>
        <p className='text-sm opacity-90 line-clamp-2 leading-relaxed text-shadow-sm'>
          {reel.caption}
        </p>
      </div>

      {/* SIDE ACTIONS */}
      <div className='absolute bottom-20 right-2 flex flex-col gap-6 items-center z-20'>
        {/* LIKE */}
        <div className='flex flex-col items-center gap-1'>
          <button
            onClick={handleLike}
            className='bg-black/20 p-3 rounded-full backdrop-blur-md hover:bg-black/40 transition active:scale-90'
          >
            <Heart
              className={`w-7 h-7 ${liked ? 'fill-red-500 text-red-500' : 'text-white'}`}
            />
          </button>
          <span className='text-xs font-bold text-white text-shadow'>
            {likesCount}
          </span>
        </div>

        {/* SHARE */}
        <div className='flex flex-col items-center gap-1'>
          <button
            onClick={handleShare}
            className='bg-black/20 p-3 rounded-full backdrop-blur-md hover:bg-black/40 transition active:scale-90'
          >
            <Share2 className='w-7 h-7 text-white' />
          </button>
          <span className='text-xs font-bold text-white text-shadow'>
            Share
          </span>
        </div>
      </div>
    </div>
  );
}
