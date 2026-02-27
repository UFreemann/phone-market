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
import { Input } from '@/components/ui/input'; // Import Input
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Filter, RotateCcw, X } from 'lucide-react';

export default function FilterDrawer() {
  const router = useRouter();
  const params = useSearchParams();
  const [open, setOpen] = useState(false);

  // States
  const [brand, setBrand] = useState(params.get('brand') || 'all');
  const [customBrand, setCustomBrand] = useState(''); // For "Other" input
  const [isCustomBrandMode, setIsCustomBrandMode] = useState(false);

  const [model, setModel] = useState(params.get('model') || ''); // New Model State
  const [condition, setCondition] = useState(params.get('condition') || 'all');
  const [price, setPrice] = useState([Number(params.get('maxPrice')) || 20000]);

  const applyFilters = () => {
    const newParams = new URLSearchParams(params.toString());

    // BRAND LOGIC
    let finalBrand = brand;
    if (isCustomBrandMode && customBrand) finalBrand = customBrand;

    if (finalBrand && finalBrand !== 'all') {
      newParams.set('brand', finalBrand);
      newParams.delete('q'); // Clear text search to avoid conflict
    } else {
      newParams.delete('brand');
    }

    // MODEL LOGIC (NEW)
    if (model.trim()) newParams.set('model', model.trim());
    else newParams.delete('model');

    // CONDITION
    if (condition && condition !== 'all') newParams.set('condition', condition);
    else newParams.delete('condition');

    // PRICE
    if (price[0] < 20000) newParams.set('maxPrice', price[0].toString());
    else newParams.delete('maxPrice');

    router.push(`/?${newParams.toString()}#latest`);
    setOpen(false);
  };

  const resetFilters = () => {
    setBrand('all');
    setCustomBrand('');
    setIsCustomBrandMode(false);
    setModel('');
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
        {/* HEADER */}
        <SheetHeader className='px-6 py-6 border-b'>
          <SheetTitle className='text-2xl'>Refine Results</SheetTitle>
          <SheetDescription>
            Find exactly what you are looking for.
          </SheetDescription>
        </SheetHeader>

        {/* SCROLL AREA */}
        <div className='flex-1 overflow-y-auto px-6 py-8 space-y-8'>
          {/* BRAND SELECTION */}
          <div className='space-y-4'>
            <Label className='text-base font-semibold'>Brand</Label>

            {isCustomBrandMode ? (
              <div className='flex gap-2'>
                <Input
                  placeholder='Type Brand Name...'
                  value={customBrand}
                  onChange={(e) => setCustomBrand(e.target.value)}
                  className='h-12 border-gray-300'
                  autoFocus
                />
                <Button
                  variant='ghost'
                  size='icon'
                  onClick={() => setIsCustomBrandMode(false)}
                >
                  <X size={18} />
                </Button>
              </div>
            ) : (
              <Select
                value={brand}
                onValueChange={(val) => {
                  if (val === 'OTHER') {
                    setIsCustomBrandMode(true);
                    setBrand('all'); // Reset dropdown visual
                  } else {
                    setBrand(val);
                  }
                }}
              >
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
                  <SelectItem value='OTHER' className='font-bold text-blue-600'>
                    + Other Brand
                  </SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>

          {/* MODEL INPUT (NEW) */}
          <div className='space-y-4'>
            <Label className='text-base font-semibold'>Model</Label>
            <Input
              placeholder='e.g. iPhone 13 Pro, S24 Ultra'
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className='h-12 border-gray-300'
            />
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
          <div className='space-y-6 pt-2 border-t mt-4'>
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

        {/* FOOTER */}
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
