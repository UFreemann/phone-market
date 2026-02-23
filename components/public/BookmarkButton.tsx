'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { toggleSave, getSaveStatus } from '@/actions/save-actions';
import { useRouter, usePathname } from 'next/navigation';
import { toast } from 'sonner';

export default function BookmarkButton({ productId }: { productId: string }) {
  const [isSaved, setIsSaved] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    async function check() {
      const status = await getSaveStatus(productId);
      setIsSaved(status);
    }
    check();
  }, [productId]);

  // const handleClick = async (e: React.MouseEvent) => {
  //   e.preventDefault(); // Stop card click

  //   const result = await toggleSave(productId);

  //   if (result.error) {
  //     router.push(`/login?callbackUrl=${encodeURIComponent(pathname)}`);
  //     return;
  //   }

  //   // setIsSaved(result.isSaved);
  //   // if (result.isSaved) toast.success('Saved to wishlist');
  //   // else toast('Removed from wishlist');
  //   // FIX: Check if 'isSaved' exists before setting state
  //   if (typeof result.isSaved === 'boolean') {
  //     setIsSaved(result.isSaved);

  //     if (result.isSaved) toast.success('Saved to wishlist');
  //     else toast('Removed from wishlist');
  //   }
  // };

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();

    // 1. OPTIMISTIC UPDATE (Instant Feedback)
    const previousState = isSaved;
    setIsSaved(!previousState); // Flip the heart instantly

    // Show toast immediately for better feel
    if (!previousState) toast.success('Saved to wishlist');
    else toast('Removed from wishlist');

    // 2. Call Server in Background
    const result = await toggleSave(productId);

    // 3. Handle Errors / Redirects
    if (result.error) {
      // Revert if not authorized (redirects anyway)
      setIsSaved(previousState);
      router.push(`/login?callbackUrl=${encodeURIComponent(pathname)}`);
      return;
    }

    // 4. Sync with Truth (Optional, but good for consistency)
    if (typeof result.isSaved === 'boolean') {
      // If server disagrees (rare), update to match server
      if (result.isSaved !== !previousState) {
        setIsSaved(result.isSaved);
      }
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`p-2 rounded-full transition-all shadow-sm ${
        isSaved
          ? 'bg-red-50 text-red-600 hover:bg-red-100'
          : 'bg-white text-gray-400 hover:text-red-500 hover:bg-gray-50'
      }`}
      title={isSaved ? 'Unsave' : 'Save for later'}
    >
      <Heart size={20} className={isSaved ? 'fill-red-600' : ''} />
    </button>
  );
}
