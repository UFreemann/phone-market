import type { Metadata } from 'next';
import { getProductById } from '@/actions/get-product';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { BadgeCheck, Home, MapPin, ShieldCheck } from 'lucide-react';
import ImageGallery from '@/components/public/ImageGallery';
import ContactButtons from '@/components/public/ContactButtons';
import BackButton from '@/components/ui/BackButton'; // Import BackButton
import Link from 'next/link';
import { MdVerified } from 'react-icons/md';

type Props = {
  params: Promise<{ id: string }>;
};

// 1. EXPORT METADATA FUNCTION
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params; // Await params in Next.js 15
  const product = await getProductById(id);

  if (!product) return { title: 'Product Not Found' };

  return {
    title: `${product.title} - Buy in Ghana`,
    description: `Buy ${product.title} from ${product.dealer.shopName}. Price: GH₵ ${product.price}. Verified Dealer.`,
    openGraph: {
      images: product.images[0] ? [product.images[0]] : [],
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) notFound();

  const isPlatinum = product.dealer.subscriptionTier === 'PLATINUM';

  let cardStyle = 'bg-white border-gray-200'; // Default

  if (product.dealer.subscriptionTier === 'PLATINUM') {
    cardStyle = 'bg-purple-50 border-purple-200';
  } else if (product.dealer.subscriptionTier === 'GOLD') {
    cardStyle = 'bg-yellow-50 border-yellow-200';
  }

  return (
    <div className='min-h-screen bg-gray-50 pb-20'>
      {/* --- SEO SCRIPT GOES HERE --- */}
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: product.title,
            image: product.images,
            description: product.description,
            offers: {
              '@type': 'Offer',
              priceCurrency: 'GHS',
              price: product.price,
              availability: 'https://schema.org/InStock',
              seller: {
                '@type': 'Organization',
                name: product.dealer.shopName,
              },
            },
          }),
        }}
      />

      {/* --- STICKY HEADER (ADDED) --- */}
      <div className='sticky top-0 z-30 flex items-center justify-between px-3 md:px-6 h-14 bg-white/80 backdrop-blur-md border-b'>
        {/* Left: Back Button & Name */}
        <div className='flex items-center gap-2 overflow-hidden'>
          <BackButton />
          <span className='ml-2 font-bold text-gray-900 truncate text-sm md:text-base'>
            {product.title}
          </span>
        </div>

        {/* Right: Home Link (NEW) */}
        <Link
          href='/'
          className='flex items-center justify-center h-9 w-9 rounded-full bg-gray-100 text-gray-600 hover:bg-blue-100 hover:text-blue-600 transition-colors flex-shrink-0 ml-2'
        >
          <Home size={20} />
        </Link>
      </div>

      <div className='max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8'>
        {/* LEFT: IMAGE GALLERY (2/3 width) */}
        <div className='md:col-span-2 space-y-6'>
          <ImageGallery images={product.images} title={product.title} />

          {/* Description Card */}
          <Card className='p-6'>
            <h3 className='font-bold text-lg mb-4'>Description</h3>
            <p className='text-gray-600 whitespace-pre-wrap leading-relaxed'>
              {product.description || 'No description provided.'}
            </p>
          </Card>
        </div>

        {/* RIGHT: DETAILS & DEALER (1/3 width) */}
        <div className='space-y-6'>
          {/* Price Card */}
          <Card className='p-6 shadow-lg border-t-4 border-t-blue-600'>
            <h1 className='text-2xl font-bold text-gray-900 mb-2'>
              {product.title}
            </h1>

            <div className='flex flex-wrap gap-2 mb-4'>
              <Badge variant='secondary'>{product.condition}</Badge>
              <Badge variant='outline'>{product.brand}</Badge>
              {product.isNegotiable && (
                <Badge className='bg-green-100 text-green-700 hover:bg-green-100 border-green-200'>
                  Negotiable
                </Badge>
              )}
            </div>

            <div className='text-3xl font-bold text-blue-700 mb-6'>
              GH₵ {product.price.toLocaleString()}
            </div>

            {/* CONTACT BUTTONS */}
            <ContactButtons
              phoneNumber={product.dealer.phone}
              productId={product.id}
              dealerId={product.dealer.id}
            />
          </Card>

          {/* Dealer Profile Card */}

          <Card className={`p-6 ${cardStyle}`}>
            <div className='flex items-center gap-3 mb-4'>
              <div className='h-12 w-12 rounded-full bg-white border overflow-hidden'>
                {product.dealer.image ? (
                  <img
                    src={product.dealer.image}
                    className='w-full h-full object-cover'
                  />
                ) : (
                  <div className='w-full h-full flex items-center justify-center font-bold text-gray-400'>
                    {product.dealer.shopName.charAt(0)}
                  </div>
                )}
              </div>
              <div>
                <div className='flex items-center gap-1'>
                  <h3 className='font-bold'>{product.dealer.shopName}</h3>
                  {/* {product.dealer.isVerified && (
                    <ShieldCheck size={16} className='text-blue-600' />
                  )} */}
                  {/* {product.dealer.isVerified &&
                    (isPlatinum ? (
                      <ShieldCheck className='h-4 w-4 text-purple-600 fill-purple-50 flex-shrink-0' />
                    ) : (
                      <BadgeCheck className='h-4 w-4 text-yellow-600 fill-yellow-50 flex-shrink-0' />
                    ))} */}
                  {product.dealer.isVerified && (
                    <>
                      {product.dealer.subscriptionTier === 'PLATINUM' && (
                        <MdVerified className='h-4 w-4 text-purple-500' />
                      )}

                      {product.dealer.subscriptionTier === 'GOLD' && (
                        <MdVerified className='h-4 w-4 text-yellow-500' />
                      )}

                      {/* If FREE users somehow get verified, they show nothing, or maybe a simple blue tick? */}
                      {/* For now, Free users show nothing because they won't match above conditions */}
                    </>
                  )}
                </div>
                <p className='text-sm text-gray-500 flex items-center gap-1'>
                  <MapPin size={12} /> {product.dealer.city}
                </p>
              </div>
            </div>

            <Button variant='outline' className='w-full' asChild>
              <Link href={`/shop/${product.dealer.id}`}>View Shop Profile</Link>
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
