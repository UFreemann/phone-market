'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toggleSoldStatus, deleteProduct } from '@/actions/manage-product';
import { Trash2, RefreshCcw } from 'lucide-react';
import { useTransition } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
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

type ProductProps = {
  id: string;
  title: string;
  price: number;
  image: string;
  isSold: boolean;
  views: number;
  // These props allow the bulk selection
  selectable?: boolean;
  isSelected?: boolean;
  onSelect?: (checked: boolean) => void;
  variant?: 'card' | 'flat';
};

export default function ProductRow({
  id,
  title,
  price,
  image,
  isSold,
  selectable = false,
  isSelected = false,
  onSelect,
  variant = 'card', // Default to card (for dashboard overview)
}: ProductProps) {
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    startTransition(async () => {
      await toggleSoldStatus(id, isSold);
    });
  };

  const confirmDelete = () => {
    startTransition(async () => {
      await deleteProduct(id);
    });
  };

  // Conditional Style
  const containerClasses =
    variant === 'card'
      ? 'border rounded-lg shadow-sm mb-3' // Card Look (Floating)
      : 'hover:bg-gray-50/80'; // Flat Look (Table row) - No border, No rounded

  return (
    <div
      className={`group flex items-center justify-between p-4 bg-white transition-all ${containerClasses} ${
        isSold ? 'opacity-60 bg-gray-50' : ''
      } ${isSelected ? 'bg-blue-50/50' : ''}`}
    >
      {/* Left: Image & Info */}
      <div className='flex items-center gap-4'>
        <div className='h-16 w-16 bg-gray-200 rounded overflow-hidden shrink-0'>
          {image ? (
            <img
              src={image}
              alt={title}
              className='h-full w-full object-cover'
            />
          ) : (
            <div className='h-full w-full flex items-center justify-center text-xs text-gray-400'>
              No Img
            </div>
          )}
        </div>
        <div>
          <h3 className='font-semibold text-gray-900 line-clamp-1'>{title}</h3>
          <p className='text-blue-600 font-bold'>
            GH₵{price?.toLocaleString()}
          </p>
          {isSold && (
            <Badge variant='secondary' className='mt-1'>
              SOLD OUT
            </Badge>
          )}
        </div>
      </div>

      {/* Right: Actions & Selection */}
      <div className='flex items-center gap-4'>
        {/* Standard Buttons */}
        <div className='flex gap-2'>
          <Button
            variant={isSold ? 'outline' : 'secondary'}
            size='sm'
            onClick={handleToggle}
            disabled={isPending}
          >
            {isSold ? <RefreshCcw className='h-4 w-4 mr-2' /> : null}
            {isSold ? 'Mark Available' : 'Mark Sold'}
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant='destructive' size='icon' disabled={isPending}>
                <Trash2 className='h-4 w-4' />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete this phone?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={confirmDelete}
                  className='bg-red-600'
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        {/* --- BULK SELECTION CHECKBOX (ALWAYS VISIBLE NOW) --- */}
        {selectable && onSelect && (
          <div className='pl-4 border-l ml-2 flex items-center gap-2'>
            <div className='text-xs text-gray-400 font-medium uppercase tracking-wider hidden md:block'>
              Select
            </div>
            <Checkbox
              checked={isSelected}
              onCheckedChange={(checked) => onSelect(checked as boolean)}
              className='h-6 w-6 border-gray-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600'
            />
          </div>
        )}
      </div>
    </div>
  );
}
