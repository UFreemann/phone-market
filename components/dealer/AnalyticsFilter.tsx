// 'use client';

// import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { Button } from '@/components/ui/button';
// import { Calendar } from '@/components/ui/calendar';
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from '@/components/ui/popover';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select';
// import { CalendarIcon, Filter } from 'lucide-react';
// import { format, subDays, startOfToday, subHours } from 'date-fns'; // Make sure subHours is imported
// import { DateRange } from 'react-day-picker';

// export default function AnalyticsFilter({
//   startDate,
//   endDate,
// }: {
//   startDate: Date;
//   endDate: Date;
// }) {
//   const router = useRouter();
//   const [date, setDate] = useState<DateRange | undefined>({
//     from: startDate,
//     to: endDate,
//   });

//   const updateUrl = (from: Date, to: Date) => {
//     const fromStr = format(from, 'yyyy-MM-dd');
//     const toStr = format(to, 'yyyy-MM-dd');
//     router.push(`/dashboard/analytics?from=${fromStr}&to=${toStr}`);
//   };

//   const handleRangeSelect = (range: DateRange | undefined) => {
//     setDate(range);
//     if (range?.from && range?.to) {
//       updateUrl(range.from, range.to);
//     }
//   };

//   const handlePresetChange = (val: string) => {
//     const today = new Date();
//     let from = today;

//     switch (val) {
//       case 'TODAY':
//         from = today;
//         break;
//       case 'YESTERDAY':
//         from = subDays(today, 1);
//         break;
//       case '3D':
//         from = subDays(today, 3);
//         break;
//       case '7D':
//         from = subDays(today, 7);
//         break;
//       case '30D':
//         from = subDays(today, 30);
//         break;
//       case '90D':
//         from = subDays(today, 90);
//         break;
//     }

//     setDate({ from, to: today });
//     updateUrl(from, today);
//   };

//   return (
//     <div className='flex items-center gap-3 bg-white p-1.5 rounded-xl border shadow-sm'>
//       {/* Preset Dropdown */}
//       <Select onValueChange={handlePresetChange} defaultValue='30D'>
//         <SelectTrigger className='w-[140px] h-9 border-none bg-gray-50 hover:bg-gray-100 focus:ring-0'>
//           <div className='flex items-center gap-2'>
//             <Filter size={14} className='text-gray-500' />
//             <SelectValue placeholder='Period' />
//           </div>
//         </SelectTrigger>
//         <SelectContent>
//           <SelectItem value='TODAY'>Today</SelectItem>
//           <SelectItem value='YESTERDAY'>Yesterday</SelectItem>
//           <SelectItem value='3D'>Last 3 Days</SelectItem>
//           <SelectItem value='7D'>Last 7 Days</SelectItem>
//           <SelectItem value='30D'>Last 30 Days</SelectItem>
//           <SelectItem value='90D'>Last 3 Months</SelectItem>
//         </SelectContent>
//       </Select>

//       <div className='h-6 w-px bg-gray-200' />

//       {/* Custom Range Picker */}
//       <Popover>
//         <PopoverTrigger asChild>
//           <Button
//             variant='ghost'
//             className='h-9 px-3 text-sm font-normal hover:bg-gray-50'
//           >
//             <CalendarIcon className='mr-2 h-4 w-4 text-gray-500' />
//             {date?.from ? (
//               date.to ? (
//                 <>
//                   {format(date.from, 'MMM dd')} - {format(date.to, 'MMM dd')}
//                 </>
//               ) : (
//                 format(date.from, 'MMM dd, y')
//               )
//             ) : (
//               <span>Custom Range</span>
//             )}
//           </Button>
//         </PopoverTrigger>
//         <PopoverContent className='w-auto p-0' align='end'>
//           <Calendar
//             initialFocus
//             mode='range'
//             defaultMonth={date?.from}
//             selected={date}
//             onSelect={handleRangeSelect}
//             numberOfMonths={2}
//           />
//         </PopoverContent>
//       </Popover>
//     </div>
//   );
// }

'use client';

import { useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Filter, Calendar as CalendarIcon, ArrowRight } from 'lucide-react';
import { format, subDays } from 'date-fns';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useTransition } from 'react';
import { Loader2 } from 'lucide-react';

export default function AnalyticsFilter({
  startDate,
  endDate,
}: {
  startDate: Date;
  endDate: Date;
}) {
  const router = useRouter();
  const pathname = usePathname(); // <--- Get current path (e.g., /admin/analytics or /dashboard/analytics)
  const searchParams = useSearchParams(); // Get existing params to preserve them if needed

  const [isPending, startTransition] = useTransition();

  // Local state for the custom range inputs
  const [customStart, setCustomStart] = useState(
    startDate
      ? format(startDate, 'yyyy-MM-dd')
      : format(new Date(), 'yyyy-MM-dd'),
  );
  const [customEnd, setCustomEnd] = useState(
    endDate ? format(endDate, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
  );

  // Helper to safely format
  const safeFormat = (dateStr: string) => {
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? 'Select Date' : format(d, 'MMM d');
  };

  const updateUrl = (from: string, to: string) => {
    // router.push(`/dashboard/analytics?from=${from}&to=${to}`);
    router.push(`${pathname}?from=${from}&to=${to}`);
  };

  const handlePresetChange = (val: string) => {
    const today = new Date();
    let from = today;

    switch (val) {
      case 'TODAY':
        from = today;
        break;
      case 'YESTERDAY':
        from = subDays(today, 1);
        break;
      case '7D':
        from = subDays(today, 7);
        break;
      case '30D':
        from = subDays(today, 30);
        break;
      case '90D':
        from = subDays(today, 90);
        break;
    }

    const fromStr = format(from, 'yyyy-MM-dd');
    const toStr = format(today, 'yyyy-MM-dd');

    // Update inputs and URL
    setCustomStart(fromStr);
    setCustomEnd(toStr);
    updateUrl(fromStr, toStr);
  };

  // const handleApplyCustom = () => {
  //   updateUrl(customStart, customEnd);
  // };

  const handleApplyCustom = () => {
    // Wrap navigation in transition
    startTransition(() => {
      updateUrl(customStart, customEnd);
      // (Optional) Close popover here if you had access to setOpen
    });
  };
  return (
    <div className='flex flex-wrap md:flex-nowrap items-center gap-2 bg-white p-1.5 rounded-xl border shadow-sm w-full md:w-auto'>
      {/* Dropdown: Full width on mobile */}
      <div className='w-full md:w-auto'>
        {/* 1. Quick Presets (Dropdown) */}
        <Select onValueChange={handlePresetChange} defaultValue='30D'>
          <SelectTrigger className='w-[130px] h-9 border-none bg-gray-50 hover:bg-gray-100 focus:ring-0 text-xs'>
            <div className='flex items-center gap-2'>
              <Filter size={14} className='text-gray-500' />
              <SelectValue placeholder='Period' />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='TODAY'>Today</SelectItem>
            <SelectItem value='YESTERDAY'>Yesterday</SelectItem>
            <SelectItem value='7D'>Last 7 Days</SelectItem>
            <SelectItem value='30D'>Last 30 Days</SelectItem>
            <SelectItem value='90D'>Last 3 Months</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Divider: Hide on mobile */}
      <div className='hidden md:block h-6 w-px bg-gray-200' />

      {/* Date Picker: Full width on mobile */}
      <div className='w-full md:w-auto'>
        {/* 2. Custom Range (Popover with Native Inputs) */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant='ghost'
              size='sm'
              className='h-9 px-3 text-xs font-normal hover:bg-gray-50'
            >
              <CalendarIcon className='mr-2 h-3.5 w-3.5 text-gray-500' />
              {/* <span>
              {format(new Date(customStart), 'MMM d')} -{' '}
              {format(new Date(customEnd), 'MMM d')}
            </span> */}
              <span>
                {safeFormat(customStart)} - {safeFormat(customEnd)}
              </span>
            </Button>
          </PopoverTrigger>
          <PopoverContent align='end' className='w-auto p-4 space-y-4'>
            <div className='flex items-center gap-2'>
              {/* <div className='space-y-1'>
              <label className='text-[10px] uppercase font-bold text-gray-500'>
                Start Date
              </label>
              <Input
                type='date'
                value={customStart}
                onChange={(e) => setCustomStart(e.target.value)}
                className='h-9 text-sm'
              />
            </div> */}
              <div className='space-y-1'>
                <label className='text-[10px] uppercase font-bold text-gray-500 ml-1'>
                  Start Date
                </label>
                <div className='relative'>
                  <CalendarIcon className='absolute left-2.5 top-2.5 h-4 w-4 text-gray-400' />
                  <Input
                    type='date'
                    value={customStart}
                    onChange={(e) => setCustomStart(e.target.value)}
                    className='h-10 pl-9 text-sm bg-gray-50 border-gray-200 focus:bg-white transition-colors cursor-pointer'
                  />
                </div>
              </div>
              <ArrowRight className='h-4 w-4 text-gray-400 mt-5' />
              <div className='space-y-1'>
                <label className='text-[10px] uppercase font-bold text-gray-500 ml-1'>
                  End Date
                </label>
                <div className='relative'>
                  <CalendarIcon className='absolute left-2.5 top-2.5 h-4 w-4 text-gray-400' />
                  <Input
                    type='date'
                    value={customEnd}
                    onChange={(e) => setCustomEnd(e.target.value)}
                    className='h-10 pl-9 text-sm bg-gray-50 border-gray-200 focus:bg-white transition-colors cursor-pointer'
                  />
                </div>
              </div>
            </div>
            <Button
              onClick={handleApplyCustom}
              size='sm'
              disabled={isPending}
              className='w-full bg-blue-600 hover:bg-blue-700 mt-2'
            >
              {isPending ? (
                <>
                  <Loader2 className='animate-spin mr-2 h-4 w-4' /> Updating...
                </>
              ) : (
                'Apply Date Range'
              )}
            </Button>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
