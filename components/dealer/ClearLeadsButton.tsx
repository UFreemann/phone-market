'use client';

import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { deleteAllLeads } from '@/actions/delete-all-leads';
import { useTransition } from 'react';
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

export default function ClearLeadsButton({ disabled }: { disabled: boolean }) {
  const [isPending, startTransition] = useTransition();

  const handleClearAll = () => {
    startTransition(async () => {
      await deleteAllLeads();
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant='destructive'
          size='sm'
          disabled={disabled || isPending}
          className='bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 border-red-200 border shadow-none'
        >
          <Trash2 className='mr-2 h-4 w-4' /> Clear All History
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Clear Entire History?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete ALL lead records from your dashboard.
            <br />
            <br />
            <strong>This action cannot be undone.</strong>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleClearAll}
            className='bg-red-600 hover:bg-red-700'
          >
            Yes, Clear All
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
