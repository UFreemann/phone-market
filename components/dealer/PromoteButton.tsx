'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { promoteProduct } from '@/actions/promote-product';
import { toast } from 'sonner';
import { Megaphone, Loader2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export default function PromoteButton({
  productId,
  credits,
}: {
  productId: string;
  credits: number;
}) {
  const [isPending, startTransition] = useTransition();

  const handlePromote = () => {
    if (credits < 1) {
      toast.error('Insufficient credits. Please buy more.');
      return;
    }

    startTransition(async () => {
      const res = await promoteProduct(productId);
      if (res.error) toast.error(res.error);
      else toast.success('Success! Product is now sponsored.');
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          size='sm'
          className='w-full sm:w-auto bg-blue-600 hover:bg-blue-700 shadow-sm'
        >
          <Megaphone size={14} className='mr-2' /> Promote (1 Credit)
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Promote this Item?</AlertDialogTitle>
          <AlertDialogDescription>
            This will deduct <strong>1 Ad Credit</strong> from your balance.
            <br />
            Your item will appear in the "Sponsored Deals" section for{' '}
            <strong>7 days</strong>.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          {/* Check Credits again here just in case, or disable if 0 */}
          <AlertDialogAction
            onClick={handlePromote}
            disabled={isPending || credits < 1}
            className='bg-orange-600 hover:bg-orange-700'
          >
            {isPending ? (
              <Loader2 className='animate-spin' />
            ) : (
              'Confirm Promotion'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
