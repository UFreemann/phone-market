'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { initializeCreditPurchase } from '@/actions/buy-credits';
import { Plus, Loader2 } from 'lucide-react';

export default function BuyCreditsButton() {
  const [loading, setLoading] = useState(false);

  const handleBuy = async (amount: number) => {
    setLoading(true);
    await initializeCreditPurchase(amount); // Server Action
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size='sm'
          className='w-full bg-white text-orange-600 hover:bg-orange-50 font-bold border-none shadow-sm'
        >
          <Plus size={14} className='mr-1' /> Buy Credits
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Top Up Ad Credits</DialogTitle>
        </DialogHeader>
        <div className='grid grid-cols-1 gap-3 pt-4'>
          <Button
            variant='outline'
            className='h-auto py-4 justify-between'
            onClick={() => handleBuy(5)}
            disabled={loading}
          >
            <span className='font-bold'>5 Credits</span>
            <span className='text-gray-500'>GH₵ 50</span>
          </Button>
          <Button
            variant='outline'
            className='h-auto py-4 justify-between border-orange-200 bg-orange-50'
            onClick={() => handleBuy(10)}
            disabled={loading}
          >
            <span className='font-bold text-orange-700'>
              10 Credits (Save 10%)
            </span>
            <span className='text-orange-700 font-bold'>GH₵ 90</span>
          </Button>
          <Button
            variant='outline'
            className='h-auto py-4 justify-between'
            onClick={() => handleBuy(20)}
            disabled={loading}
          >
            <span className='font-bold'>20 Credits</span>
            <span className='text-gray-500'>GH₵ 180</span>
          </Button>
        </div>
        {loading && (
          <p className='text-center text-xs text-gray-400 mt-2 flex justify-center items-center'>
            <Loader2 size={12} className='animate-spin mr-1' /> Redirecting to
            Paystack...
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}
