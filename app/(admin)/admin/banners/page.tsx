import prisma from '@/lib/db';
import SlideManager from '@/components/admin/SlideManager';

export default async function AdminBannersPage() {
  const slides = await prisma.heroSlide.findMany({
    orderBy: { createdAt: 'desc' },
  });
  return (
    <div className='space-y-6'>
      <h1 className='text-2xl font-bold'>Homepage Banners</h1>
      <SlideManager initialSlides={slides} />
    </div>
  );
}
