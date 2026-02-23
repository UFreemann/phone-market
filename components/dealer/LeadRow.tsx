'use client';

import { TableCell, TableRow } from '@/components/ui/table';
import {
  MessageCircle,
  Phone,
  ExternalLink,
  Trash2,
  Store,
} from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '@/components/ui/button';
import { deleteLead } from '@/actions/delete-lead';
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

export default function LeadRow({ lead }: { lead: any }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      await deleteLead(lead.id);
    });
  };

  return (
    <TableRow
      className={`group hover:bg-gray-50 transition-colors ${isPending ? 'opacity-50 pointer-events-none' : ''}`}
    >
      {/* PRODUCT INFO */}
      {/* <TableCell className='font-medium'>
        {lead.product ? (
          <div className='flex items-center gap-3'>
            <div className='h-10 w-10 bg-gray-100 rounded overflow-hidden flex-shrink-0 border'>
              {lead.product.images[0] && (
                <img
                  src={lead.product.images[0]}
                  className='h-full w-full object-cover'
                />
              )}
            </div>
            <div>
              <p className='text-sm font-semibold line-clamp-1 max-w-[150px] sm:max-w-[200px]'>
                {lead.product.title}
              </p>
              <p className='text-xs text-blue-600 font-medium'>
                GH₵ {Number(lead.product.price).toLocaleString()}
              </p>
            </div>
          </div>
        ) : (
          <span className='text-gray-400 italic text-sm'>Item Deleted</span>
        )}
      </TableCell> */}
      <TableCell className='font-medium'>
        {lead.product ? (
          // CASE A: Specific Product Lead
          <div className='flex items-center gap-3'>
            <div className='h-10 w-10 bg-gray-100 rounded overflow-hidden flex-shrink-0 border'>
              {lead.product.images[0] && (
                <img
                  src={lead.product.images[0]}
                  className='h-full w-full object-cover'
                />
              )}
            </div>
            <div>
              <p className='text-sm font-semibold line-clamp-1 max-w-[150px]'>
                {lead.product.title}
              </p>
              <p className='text-xs text-blue-600 font-medium'>
                GH₵ {Number(lead.product.price).toLocaleString()}
              </p>
            </div>
          </div>
        ) : (
          // CASE B: General Profile Lead (No Product)
          <div className='flex items-center gap-3'>
            <div className='h-10 w-10 bg-purple-100 rounded flex items-center justify-center flex-shrink-0 text-purple-600'>
              <Store size={18} />
            </div>
            <div>
              <p className='text-sm font-semibold text-gray-700'>
                Shop Profile
              </p>
              <p className='text-xs text-gray-500'>General Inquiry</p>
            </div>
          </div>
        )}
      </TableCell>

      {/* TYPE BADGE */}
      <TableCell>
        {lead.type === 'WHATSAPP' ? (
          <span className='inline-flex items-center gap-1.5 bg-green-100 text-green-700 px-2.5 py-1 rounded-full text-xs font-medium border border-green-200 shadow-sm'>
            <MessageCircle
              size={12}
              className='fill-green-700 text-green-700'
            />
            WhatsApp
          </span>
        ) : (
          <span className='inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full text-xs font-medium border border-blue-200 shadow-sm'>
            <Phone size={12} className='fill-blue-700 text-blue-700' />
            Viewed Number
          </span>
        )}
      </TableCell>

      {/* TIME */}
      <TableCell className='text-gray-500 text-sm whitespace-nowrap'>
        {formatDistanceToNow(new Date(lead.createdAt), { addSuffix: true })}
      </TableCell>

      {/* ACTIONS */}
      <TableCell className='text-right'>
        <div className='flex justify-end gap-1'>
          {lead.product && (
            <Link href={`/phone/${lead.productId}`} target='_blank'>
              <Button
                variant='ghost'
                size='icon'
                className='h-8 w-8 text-gray-400 hover:text-blue-600 hover:bg-blue-50'
              >
                <ExternalLink size={16} />
              </Button>
            </Link>
          )}

          {/* DELETE MODAL */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant='ghost'
                size='icon'
                className='h-8 w-8 text-gray-400 hover:text-red-600 hover:bg-red-50'
                disabled={isPending}
              >
                <Trash2 size={16} />
              </Button>
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Lead History?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will remove this interaction record from your dashboard.
                  It will not block the user.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className='bg-red-600 hover:bg-red-700 text-white'
                >
                  Delete Record
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </TableCell>
    </TableRow>
  );
}
