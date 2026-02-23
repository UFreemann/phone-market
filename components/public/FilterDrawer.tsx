'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetDescription,
} from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Filter, RotateCcw } from 'lucide-react';

export default function FilterDrawer() {
  const router = useRouter();
  const params = useSearchParams();
  const [open, setOpen] = useState(false);

  // States
  const [brand, setBrand] = useState(params.get('brand') || 'all');
  const [condition, setCondition] = useState(params.get('condition') || 'all');
  const [price, setPrice] = useState([Number(params.get('maxPrice')) || 20000]);

  const applyFilters = () => {
    // 1. Start fresh with current params
    const newParams = new URLSearchParams(params.toString());

    // 2. BRAND LOGIC (The Fix)
    if (brand && brand !== 'all') {
      newParams.set('brand', brand);

      // OPTIONAL: Clear the text search if filtering by brand to prevent conflicts
      // e.g. searching "iPhone" while filtering "Samsung" = 0 results
      newParams.delete('q');
    } else {
      newParams.delete('brand');
    }

    // Condition
    if (condition && condition !== 'all') newParams.set('condition', condition);
    else newParams.delete('condition');

    // Price
    if (price[0] < 20000) newParams.set('maxPrice', price[0].toString());
    else newParams.delete('maxPrice');

    router.push(`/?${newParams.toString()}`);
    setOpen(false);
  };

  const resetFilters = () => {
    setBrand('all');
    setCondition('all');
    setPrice([20000]);
    router.push('/');
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant='secondary'
          className='h-14 rounded-full px-6 flex gap-2 shadow-lg border hover:bg-gray-100 transition-colors'
        >
          <Filter size={18} /> <span className='hidden sm:inline'>Filters</span>
        </Button>
      </SheetTrigger>

      <SheetContent
        side='right'
        className='w-[85%] sm:w-[400px] p-0 flex flex-col h-full bg-white'
      >
        {/* 1. HEADER (Fixed) */}
        <SheetHeader className='px-6 py-6 border-b'>
          <SheetTitle className='text-2xl'>Refine Results</SheetTitle>
          <SheetDescription>
            Find exactly what you are looking for.
          </SheetDescription>
        </SheetHeader>

        {/* 2. SCROLLABLE CONTENT AREA (Flex-1 takes remaining space) */}
        <div className='flex-1 overflow-y-auto px-6 py-8 space-y-10'>
          {/* BRAND */}
          <div className='space-y-4'>
            <Label className='text-base font-semibold'>Brand</Label>
            <Select value={brand} onValueChange={setBrand}>
              <SelectTrigger className='h-12 border-gray-300 focus:ring-blue-500'>
                <SelectValue placeholder='All Brands' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All Brands</SelectItem>
                <SelectItem value='Apple'>Apple</SelectItem>
                <SelectItem value='Samsung'>Samsung</SelectItem>
                <SelectItem value='Google'>Google</SelectItem>
                <SelectItem value='Tecno'>Tecno</SelectItem>
                <SelectItem value='Infinix'>Infinix</SelectItem>
                <SelectItem value='Xiaomi'>Xiaomi</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* CONDITION */}
          <div className='space-y-4'>
            <Label className='text-base font-semibold'>Condition</Label>
            <Select value={condition} onValueChange={setCondition}>
              <SelectTrigger className='h-12 border-gray-300 focus:ring-blue-500'>
                <SelectValue placeholder='Any Condition' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>Any Condition</SelectItem>
                <SelectItem value='NEW'>Brand New (Boxed)</SelectItem>
                <SelectItem value='USED'>Used / Foreign Used</SelectItem>
                <SelectItem value='REFURBISHED'>Refurbished</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* PRICE */}
          <div className='space-y-6 pt-2'>
            <div className='flex justify-between items-center'>
              <Label className='text-base font-semibold'>Max Price</Label>
              <span className='text-blue-600 font-bold bg-blue-50 px-3 py-1 rounded-full text-sm'>
                GH₵ {price[0].toLocaleString()}
              </span>
            </div>
            <Slider
              defaultValue={[20000]}
              value={price}
              max={20000}
              step={100}
              onValueChange={setPrice}
              className='py-4'
            />
            <div className='flex justify-between text-xs text-gray-400 font-medium px-1'>
              <span>GH₵ 0</span>
              <span>GH₵ 20k+</span>
            </div>
          </div>
        </div>

        {/* 3. FOOTER (Fixed at Bottom) */}
        <div className='p-6 border-t bg-gray-50 mt-auto'>
          <Button
            onClick={applyFilters}
            className='w-full h-12 text-lg bg-blue-600 hover:bg-blue-700 shadow-md mb-3'
          >
            Show Results
          </Button>
          <Button
            onClick={resetFilters}
            variant='ghost'
            className='w-full text-gray-500 hover:text-gray-900'
          >
            <RotateCcw className='mr-2 h-4 w-4' /> Reset Filters
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
