'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function BackButton() {
  const router = useRouter();

  return (
    <Button
      variant='link'
      size='icon'
      className='-ml-2 animate-pulse'
      onClick={() => router.back()} // <--- The Magic
    >
      <ArrowLeft className='h-5 w-5 text-white' />
    </Button>
  );
}
