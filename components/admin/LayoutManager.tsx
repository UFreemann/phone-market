'use client';

import { useState, useEffect } from 'react';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from '@hello-pangea/dnd';
import {
  GripVertical,
  Save,
  LayoutTemplate,
  Search,
  Megaphone,
  Images,
  ShoppingBag,
  Store,
  Zap,
  List,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { updateHomepageLayout } from '@/actions/admin-layout';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

// Map keys to readable labels AND icons
const SECTION_CONFIG: Record<
  string,
  { label: string; icon: React.ReactNode; color: string }
> = {
  HERO: {
    label: 'Hero Section (Search)',
    icon: <Search size={18} />,
    color: 'bg-blue-100 text-blue-600',
  },
  SPONSORED: {
    label: 'Sponsored Ads',
    icon: <Megaphone size={18} />,
    color: 'bg-yellow-100 text-yellow-600',
  },
  SHOWCASE: {
    label: 'Hero Slider',
    icon: <Images size={18} />,
    color: 'bg-indigo-100 text-indigo-600',
  },
  COLLECTION: {
    label: 'Explore Collection',
    icon: <ShoppingBag size={18} />,
    color: 'bg-pink-100 text-pink-600',
  },
  CTA: {
    label: 'Seller CTA Banner',
    icon: <Store size={18} />,
    color: 'bg-green-100 text-green-600',
  },
  FEATURED: {
    label: 'Featured Deals',
    icon: <Zap size={18} />,
    color: 'bg-purple-100 text-purple-600',
  },
  LATEST: {
    label: 'Latest Arrivals',
    icon: <List size={18} />,
    color: 'bg-gray-100 text-gray-600',
  },
};

export default function LayoutManager({
  currentOrder,
}: {
  currentOrder: string[];
}) {
  const [isSaving, setIsSaving] = useState(false);
  const [mounted, setMounted] = useState(false);

  const ALL_KEYS = Object.keys(SECTION_CONFIG);

  // Merge currentOrder with any missing keys
  const [items, setItems] = useState(() => {
    const missing = ALL_KEYS.filter((k) => !currentOrder.includes(k));
    return [...currentOrder, ...missing];
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const newItems = Array.from(items);
    const [reorderedItem] = newItems.splice(result.source.index, 1);
    newItems.splice(result.destination.index, 0, reorderedItem);
    setItems(newItems);
  };

  const handleSave = async () => {
    setIsSaving(true);
    const res = await updateHomepageLayout(items);
    if (res.success) toast.success('Homepage layout updated!');
    else toast.error('Failed to save layout');
    setIsSaving(false);
  };

  if (!mounted) return null;

  return (
    <div className='max-w-3xl space-y-6'>
      {/* HEADER */}
      <div className='flex items-center justify-between bg-white p-6 rounded-xl border shadow-sm'>
        <div className='flex items-center gap-4'>
          <div className='bg-blue-50 p-3 rounded-full text-blue-600'>
            <LayoutTemplate size={24} />
          </div>
          <div>
            <h3 className='text-xl font-bold text-gray-900'>Page Structure</h3>
            <p className='text-sm text-gray-500'>
              Drag sections to reorder the public homepage.
            </p>
          </div>
        </div>
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className='bg-blue-600 hover:bg-blue-700 shadow-md transition-transform active:scale-95'
        >
          {isSaving ? (
            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
          ) : (
            <Save className='mr-2 h-4 w-4' />
          )}
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      {/* DRAG LIST */}
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId='homepage-layout'>
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className='space-y-3 pb-20'
            >
              {items.map((key, index) => {
                const config = SECTION_CONFIG[key] || {
                  label: key,
                  icon: <List />,
                  color: 'bg-gray-100',
                };

                return (
                  <Draggable key={key} draggableId={key} index={index}>
                    {(provided, snapshot) => (
                      <Card
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`border-none shadow-sm transition-all duration-200 group ${
                          snapshot.isDragging
                            ? 'shadow-2xl ring-2 ring-blue-500 bg-white z-50 scale-105 rotate-1'
                            : 'bg-white hover:bg-gray-50/50'
                        }`}
                      >
                        <CardContent className='p-4 flex items-center gap-4'>
                          {/* Grip Handle */}
                          <div
                            {...provided.dragHandleProps}
                            className='cursor-grab active:cursor-grabbing text-gray-300 hover:text-gray-600 p-2 rounded hover:bg-gray-100 transition-colors'
                          >
                            <GripVertical size={20} />
                          </div>

                          {/* Icon Badge */}
                          <div className={`p-2.5 rounded-lg ${config.color}`}>
                            {config.icon}
                          </div>

                          {/* Text Info */}
                          <div className='flex-1'>
                            <p className='font-bold text-gray-800 text-sm'>
                              {config.label}
                            </p>
                            <p className='text-[10px] text-gray-400 font-mono mt-0.5 uppercase tracking-wide'>
                              Key: {key}
                            </p>
                          </div>

                          {/* Position Badge */}
                          <div className='bg-gray-100 text-gray-500 text-xs font-bold px-3 py-1 rounded-full border border-gray-200'>
                            #{index + 1}
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}
