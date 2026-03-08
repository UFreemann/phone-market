import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import BackButton from '@/components/ui/BackButton';

export default function CategoriesPage() {
  const categories = [
    {
      name: 'Smartphones',
      slug: 'phone',
      image: '/phone2.jpg',
      count: 'iPhone, Samsung, Tecno',
    },
    {
      name: 'Laptops',
      slug: 'laptop',
      image: '/phone12.jpg',
      count: 'MacBook, Dell, HP',
    },
    {
      name: 'Accessories',
      slug: 'accessory',
      image:
        'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=800&q=80',
      count: 'Headphones, Chargers',
    },
    {
      name: 'Tablets',
      slug: 'tablet',
      image:
        'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=80',
      count: 'iPad, Samsung Tab',
    },
    {
      name: 'Other Gadgets',
      slug: 'other',
      image: '/phone5.jpg',
      count: 'Smartwatches, Cameras',
    },
  ];

  return (
    <div className='min-h-screen bg-black text-white relative overflow-hidden pb-20'>
      {/* 1. BACKGROUND AMBIENCE */}
      <div className='absolute top-0 left-0 w-full h-[50vh] bg-gradient-to-b from-blue-900/40 to-black z-0 pointer-events-none' />
      <div className='absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none' />
      <div className='absolute top-[20%] left-[-10%] w-[400px] h-[400px] bg-blue-600/20 rounded-full blur-[100px] pointer-events-none' />

      <div className='max-w-7xl mx-auto px-4 relative z-10'>
        {/* 2. HEADER */}
        <div className='pt-8 mb-12 flex items-center gap-4'>
          <BackButton />
          {/* Note: Ensure BackButton has 'text-white' style or wrap it */}
          <div>
            <h1 className='text-4xl md:text-5xl font-bold tracking-tight'>
              Explore Categories
            </h1>
            <p className='text-gray-400 mt-2 text-lg'>
              Find the perfect device for your needs.
            </p>
          </div>
        </div>

        {/* 3. MASONRY GRID */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
          {categories.map((cat, index) => (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              className={`group relative rounded-3xl overflow-hidden cursor-pointer shadow-2xl transition-all duration-500 hover:shadow-blue-900/20 hover:-translate-y-2
                        ${index === 0 ? 'lg:col-span-2 lg:row-span-2 h-[400px] lg:h-[500px]' : 'h-[240px]'}
                    `}
            >
              {/* Image with Zoom Effect */}
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                className='object-cover group-hover:scale-110 transition-transform duration-700 ease-out'
                sizes='(max-width: 768px) 100vw, 50vw'
              />

              {/* Gradient Overlay */}
              <div className='absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity' />

              {/* Content */}
              <div className='absolute bottom-0 left-0 p-6 w-full'>
                <div className='flex justify-between items-end'>
                  <div>
                    <h2
                      className={`font-bold mb-1 group-hover:text-blue-300 transition-colors ${index === 0 ? 'text-3xl md:text-4xl' : 'text-xl'}`}
                    >
                      {cat.name}
                    </h2>
                    <p className='text-gray-300 text-sm font-medium opacity-80'>
                      {cat.count}
                    </p>
                  </div>

                  {/* Floating Icon Button */}
                  <div className='bg-white/10 backdrop-blur-md p-3 rounded-full border border-white/20 group-hover:bg-white group-hover:text-black transition-all'>
                    <ArrowUpRight size={20} />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
