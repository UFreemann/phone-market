'use client';

import Link from 'next/link';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import Image from 'next/image';

export default function HeroSlider({ slides }: { slides: any[] }) {
  if (slides.length === 0) return null;

  return (
    <div className='w-full max-w-7xl mx-auto mt-6 px-4'>
      <Carousel plugins={[Autoplay({ delay: 5000 })]} className='w-full'>
        <CarouselContent>
          {slides.map((slide) => (
            <CarouselItem key={slide.id}>
              <Link href={slide.link}>
                <div className='relative h-[200px] md:h-[400px] w-full rounded-2xl overflow-hidden cursor-pointer group'>
                  <Image
                    src={slide.image}
                    alt={slide.title}
                    fill // <--- Replaces width/height
                    priority={true}
                    className='object-cover group-hover:scale-105 transition-transform duration-700'
                    sizes='(max-width: 768px) 100vw, 1200px'
                    // className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-700'
                  />
                  <div className='absolute inset-0 bg-gradient-to-r from-black/80 to-transparent flex flex-col justify-center px-8 md:px-16 text-white'>
                    <h2 className='text-3xl md:text-5xl font-bold mb-2 max-w-lg'>
                      {slide.title}
                    </h2>
                    <p className='text-lg md:text-xl text-gray-200'>
                      {slide.subtitle}
                    </p>
                    <button
                      className='mt-4 px-6 py-2 rounded-full font-medium w-fit text-white shadow-lg transition-transform hover:scale-105'
                      style={{ backgroundColor: slide.color || '#2563EB' }}
                    >
                      Explore Now
                    </button>
                  </div>
                </div>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
        {/* Navigation Arrows (Hidden on mobile) */}
        <CarouselPrevious className='left-4 hidden md:flex' />
        <CarouselNext className='right-4 hidden md:flex' />
      </Carousel>
    </div>
  );
}
