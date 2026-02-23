'use client';

import {
  Bell,
  AlertTriangle,
  CheckCircle2,
  FileBadge,
  Clock,
} from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { differenceInDays } from 'date-fns';

type Props = {
  endDate: Date | null;
  isVerified: boolean;
  tier: string;
  hasID: boolean; // <--- NEW PROP
};

export default function NotificationBell({
  endDate,
  isVerified,
  tier,
  hasID,
}: Props) {
  // 1. Expiry Logic
  const daysLeft = endDate
    ? differenceInDays(new Date(endDate), new Date())
    : 100;
  const isExpiringSoon = daysLeft <= 3 && daysLeft >= 0;

  // 2. ID Logic
  const isPaidPlan = tier === 'GOLD' || tier === 'PLATINUM';

  // A. Needs to upload
  const idMissing = isPaidPlan && !isVerified && !hasID;

  // B. Uploaded, waiting for Admin
  const idPending = isPaidPlan && !isVerified && hasID;

  // 3. Counter
  const alertCount =
    (isExpiringSoon ? 1 : 0) + (idMissing ? 1 : 0) + (idPending ? 1 : 0);
  const hasAlert = alertCount > 0;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          size='icon'
          className='relative bg-white shadow-sm border-gray-200'
        >
          <Bell size={20} className='text-gray-600' />

          {/* Red Count Badge */}
          {hasAlert && (
            <span className='absolute -top-1 -right-1 h-5 w-5 bg-red-600 text-white text-[10px] flex items-center justify-center rounded-full border-2 border-white shadow-sm font-bold animate-pulse'>
              {alertCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align='end'
        className='w-80 p-0 shadow-xl border-gray-100'
      >
        {/* Header */}
        <div className='px-4 py-3 border-b bg-gray-50/50 flex justify-between items-center'>
          <h4 className='font-semibold text-sm'>Notifications</h4>
          {hasAlert && (
            <span className='text-xs text-red-600 font-medium'>
              {alertCount} New
            </span>
          )}
        </div>

        <div className='max-h-[400px] overflow-y-auto'>
          {/* ALERT 1: ID MISSING (Action Required) */}
          {idMissing && (
            <div className='p-4 bg-blue-50 border-b border-blue-100'>
              <div className='flex items-start gap-3'>
                <div className='bg-white p-2 rounded-full shadow-sm text-blue-600 shrink-0'>
                  <FileBadge size={16} />
                </div>
                <div>
                  <h4 className='font-bold text-blue-900 text-sm'>
                    Verify your Identity
                  </h4>
                  <p className='text-xs text-blue-700 mt-1'>
                    Upload your Business ID to unlock the Verified Badge.
                  </p>
                  <Link href='/dashboard/settings'>
                    <Button
                      size='sm'
                      className='w-full mt-2 bg-blue-600 hover:bg-blue-700 h-8 text-xs'
                    >
                      Upload ID
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* ALERT 2: ID PENDING (Status Update) */}
          {idPending && (
            <div className='p-4 bg-yellow-50 border-b border-yellow-100'>
              <div className='flex items-start gap-3'>
                <div className='bg-white p-2 rounded-full shadow-sm text-yellow-600 shrink-0'>
                  <Clock size={16} />
                </div>
                <div>
                  <h4 className='font-bold text-yellow-800 text-sm'>
                    Verification Pending
                  </h4>
                  <p className='text-xs text-yellow-700 mt-1 leading-relaxed'>
                    We received your ID. Our team is reviewing it. You will
                    receive the badge soon.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ALERT 3: EXPIRY (Emergency) */}
          {isExpiringSoon && (
            <div className='p-4 bg-red-50 border-b border-red-100'>
              <div className='flex items-start gap-3'>
                <div className='bg-white p-2 rounded-full shadow-sm text-red-500 shrink-0'>
                  <AlertTriangle size={16} />
                </div>
                <div>
                  <h4 className='font-bold text-red-900 text-sm'>
                    Plan Expiring Soon
                  </h4>
                  <p className='text-xs text-red-700 mt-1 leading-relaxed'>
                    Ends in <strong>{daysLeft} days</strong>. Renew now to avoid
                    interruption.
                  </p>
                  <Link href='/subscribe'>
                    <Button
                      size='sm'
                      className='w-full mt-2 bg-red-600 hover:bg-red-700 h-8 text-xs'
                    >
                      Renew Now
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* EMPTY STATE (Only if NO alerts) */}
          {!isExpiringSoon && !idMissing && !idPending && (
            <div className='py-8 text-center px-6'>
              <div className='bg-green-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3'>
                <CheckCircle2 size={20} className='text-green-600' />
              </div>
              <p className='text-sm font-medium text-gray-900'>
                You're all set!
              </p>
              <p className='text-xs text-gray-500 mt-1'>
                Plan active until{' '}
                {endDate
                  ? new Date(endDate).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })
                  : 'forever'}
                .
              </p>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
