'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { UserPlus, UserCheck, Loader2 } from 'lucide-react';
import { toggleFollow, getFollowStatus } from '@/actions/follow-actions';
import { useRouter, usePathname } from 'next/navigation';
import { toast } from 'sonner'; // Import Toast

type Props = {
  dealerId: string;
};

export default function FollowButton({ dealerId }: Props) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, setIsPending] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    async function check() {
      try {
        const status = await getFollowStatus(dealerId);
        setIsFollowing(status);
      } catch (error) {
        setIsFollowing(false);
      } finally {
        setIsLoading(false);
      }
    }
    check();
  }, [dealerId]);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    setIsPending(true);

    const result = await toggleFollow(dealerId);

    if (result.error) {
      // CASE A: User is not logged in -> Redirect
      if (result.error === 'Unauthorized') {
        router.push(`/login?callbackUrl=${encodeURIComponent(pathname)}`);
      }
      // CASE B: User is trying to follow themselves -> Show Error Toast
      else {
        toast.error(result.error); // Displays "You cannot follow your own shop"
      }

      setIsPending(false);
      return;
    }

    if (typeof result.isFollowing === 'boolean') {
      setIsFollowing(result.isFollowing);

      // Optional: Show success message
      if (result.isFollowing) {
        toast.success('Following shop!');
      } else {
        toast('Unfollowed shop');
      }
    }

    setIsPending(false);
  };

  if (isLoading) {
    return (
      <Button
        variant='outline'
        size='sm'
        disabled
        className='w-24 bg-white/50 backdrop-blur-sm border-gray-200'
      >
        <Loader2 className='h-4 w-4 animate-spin text-gray-500' />
      </Button>
    );
  }

  return (
    <Button
      onClick={handleClick}
      disabled={isPending}
      // className="h-10 px-4 ..." (Matches Contact Button size)
      className={`h-10 px-4 shadow-sm transition-all font-medium ${
        isFollowing
          ? 'bg-white text-gray-700 border border-gray-300 hover:bg-red-50 hover:text-red-600 hover:border-red-200'
          : 'bg-black text-white hover:bg-gray-800 border-transparent'
      }`}
    >
      {isPending ? (
        <Loader2 className='h-4 w-4 animate-spin' />
      ) : isFollowing ? (
        <>
          <UserCheck className='mr-1.5 h-4 w-4' /> Following
        </>
      ) : (
        <>
          <UserPlus className='mr-1.5 h-4 w-4' /> Follow
        </>
      )}
    </Button>
  );
}
