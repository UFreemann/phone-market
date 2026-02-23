'use client';

import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce'; // npm install use-debounce

export default function InventorySearch({
  placeholder = 'Search stock...',
}: {
  placeholder?: string;
}) {
  const router = useRouter();
  const pathname = usePathname(); // <--- Dynamic Path
  const searchParams = useSearchParams();

  // Debounce to prevent reloading on every keystroke
  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set('q', term);
    } else {
      params.delete('q');
    }
    // Push to CURRENT path (inventory, ads, leads, etc.)
    router.replace(`${pathname}?${params.toString()}`);
  }, 300);

  return (
    <div className='relative flex-1 md:w-64'>
      <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400' />
      <Input
        placeholder={placeholder}
        className='pl-9 h-10 bg-white'
        defaultValue={searchParams.get('q')?.toString()}
        onChange={(e) => handleSearch(e.target.value)}
      />
    </div>
  );
}
