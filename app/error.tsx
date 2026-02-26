'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Global Error:', error);
  }, [error]);

  return (
    <div className='min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center px-4'>
      <div className='bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-gray-100'>
        <div className='bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6'>
          <AlertTriangle className='h-8 w-8 text-red-500' />
        </div>
        <h2 className='text-2xl font-bold text-gray-900 mb-2'>
          Something went wrong!
        </h2>
        <p className='text-gray-500 mb-6'>
          We encountered an unexpected error. Check your internet connection and
          try again or contact support if the issue persists.
        </p>
        <div className='space-y-3'>
          <Button
            onClick={() => reset()}
            className='w-full bg-blue-600 hover:bg-blue-700'
          >
            Try Again
          </Button>
          <Button
            variant='outline'
            onClick={() => (window.location.href = '/')}
            className='w-full'
          >
            Go to Homepage
          </Button>
        </div>
      </div>
    </div>
  );
}
