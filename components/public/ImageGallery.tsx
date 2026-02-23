'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';

export default function ImageGallery({
  images,
  title,
}: {
  images: string[];
  title: string;
}) {
  const [activeImage, setActiveImage] = useState(images[0]);

  return (
    <div className='space-y-4'>
      {/* Main Large Image */}
      <Card className='overflow-hidden border-none shadow-sm bg-white'>
        <div className='relative h-[300px] md:h-[400px] w-full flex items-center justify-center bg-gray-50'>
          {activeImage ? (
            <img
              src={activeImage}
              alt={title}
              className='max-h-full max-w-full object-contain bg-gray-100'
            />
          ) : (
            <div className='w-full h-full flex items-center justify-center bg-gray-100 text-gray-400'>
              No Image Available
            </div>
          )}
        </div>
      </Card>

      {/* Thumbnails (Only show if more than 1 image) */}
      {images.length > 1 && (
        <div className='flex gap-2 overflow-x-auto pb-2'>
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveImage(img)}
              className={`relative h-20 w-20 flex-shrink-0 rounded-md overflow-hidden border-2 transition-all ${
                activeImage === img
                  ? 'border-blue-600 ring-1 ring-blue-600'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <img src={img} className='w-full h-full object-cover' />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
