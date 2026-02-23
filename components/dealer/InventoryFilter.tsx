'use client';

import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useRouter, useSearchParams } from 'next/navigation';

export default function InventoryFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const status = searchParams.get('status') || 'ALL';

  const handleFilter = (val: string) => {
    const params = new URLSearchParams(searchParams);
    if (val === 'ALL') params.delete('status');
    else params.set('status', val);

    router.replace(`/dashboard/inventory?${params.toString()}`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='sm' className='text-gray-500 h-8'>
          <Filter size={14} className='mr-2' /> Filter: {status}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuRadioGroup value={status} onValueChange={handleFilter}>
          <DropdownMenuRadioItem value='ALL'>All Items</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value='ACTIVE'>
            Active Only
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value='SOLD'>Sold Only</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
