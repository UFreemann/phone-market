import type { Metadata } from 'next';
import { getDealerById } from '@/actions/get-dealer';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/public/ProductCard';
import { MapPin, ShieldCheck, BadgeCheck, Search, Home } from 'lucide-react';
import {
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaTiktok,
  FaSnapchatGhost,
  FaGlobe,
} from 'react-icons/fa';
import { trackDealerView } from '@/actions/track-view';
import BackButton from '@/components/ui/BackButton';
import ProfileContactButton from '@/components/public/ProfileContactButton';
import FollowButton from '@/components/public/FollowButton';
import ShopSearchBar from '@/components/public/ShopSearchBar';
import Link from 'next/link';
import { getProductById } from '@/actions/get-product';
import Image from 'next/image';
// We will build this Follow Button next
// import FollowButton from "@/components/public/FollowButton";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ q?: string }>;
};

// METADATA
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const data = await getDealerById(id);
  if (!data) return { title: 'Shop Not Found' };

  return {
    title: `${data.dealer.shopName} - PhoneMarket Shop`,
    description:
      data.dealer.description ||
      `Visit ${data.dealer.shopName} to see their inventory.`,
    openGraph: {
      images: data.dealer.image ? [data.dealer.image] : [],
    },
  };
}

export default async function DealerProfilePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ q?: string }>;
}) {
  const { id } = await params;
  const { q } = await searchParams;

  const product = await getProductById(id);
  if (!product) notFound();

  // Pass query to fetch function
  const data = await getDealerById(id, q);

  if (!data) notFound();
  // --- TRACKING LOGIC ---
  // We call this without 'await' so it runs in the background
  // and doesn't delay the page rendering.
  trackDealerView(id);

  const { dealer, products } = data;
  const isPlatinum = dealer.subscriptionTier === 'PLATINUM';

  // Brand Color Logic (Dynamic Styles)
  const brandStyle = {
    backgroundColor: dealer.brandColor || '#2563EB',
    color: '#ffffff',
  };

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

      {/* 1. HEADER / BANNER AREA */}
      <div className='bg-white pb-6 shadow-sm'>
        {/* Sticky Nav */}
        <div className='sticky top-0 z-30 flex items-center justify-between px-3 md:px-6 h-14 bg-white/80 backdrop-blur-md border-b'>
          {/* Left: Back Button & Name */}
          <div className='flex items-center gap-2 overflow-hidden'>
            <BackButton />
            <span className='ml-2 font-bold text-gray-900 truncate text-sm md:text-base'>
              {dealer.shopName}
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

        {/* Banner Image */}
        <div className='h-48 md:h-64 w-full bg-gray-200 relative'>
          {dealer.coverImage ? (
            <Image
              src={dealer.coverImage}
              alt='Cover'
              fill // Replaces width/height
              className='object-cover'
              priority // Loads faster for LCP
            />
          ) : (
            <div className='w-full h-full bg-gradient-to-r from-blue-700 to-indigo-800' />
          )}
        </div>

        {/* Profile Info Section */}
        <div className='max-w-6xl mx-auto px-4 relative'>
          {/* Logo (Floating over banner) */}
          <div className='-mt-16 mb-4 flex justify-between items-end'>
            {/* Added 'relative' here so Image fill works inside */}
            <div className='h-32 w-32 rounded-full border-4 border-white bg-white overflow-hidden shadow-md relative'>
              {dealer.image ? (
                <Image
                  src={dealer.image}
                  alt='Logo'
                  fill // Replaces width/height
                  className='object-cover'
                />
              ) : (
                <div className='w-full h-full flex items-center justify-center bg-blue-100 text-blue-700 text-4xl font-bold'>
                  {dealer.shopName.charAt(0)}
                </div>
              )}
            </div>

            {/* Actions (Follow / Contact) */}
            <div className='flex gap-2 mb-2'>
              <FollowButton dealerId={dealer.id} />
              {/* <Button style={brandStyle} className='shadow-sm'>
                <Phone className='mr-2 h-4 w-4' /> Contact
              </Button> */}
              <ProfileContactButton
                dealerId={dealer.id}
                phoneNumber={dealer.phone}
                brandColor={dealer.brandColor}
              />
            </div>
          </div>

          {/* Shop Details */}
          <div>
            <div className='flex items-center gap-2'>
              <h1 className='text-2xl font-bold text-gray-900'>
                {dealer.shopName}
              </h1>
              {/* {dealer.isVerified &&
                (isPlatinum ? (
                  <ShieldCheck className='h-4 w-4 md:h-6 md:w-6 text-purple-600 fill-purple-50 flex-shrink-0' />
                ) : (
                  <BadgeCheck className='h-4 w-4 md:h-6 md:w-6 text-yellow-600 fill-yellow-50 flex-shrink-0' />
                ))} */}
              {dealer.isVerified && (
                <>
                  {dealer.subscriptionTier === 'PLATINUM' && (
                    <ShieldCheck className='h-4 w-4 text-purple-600 fill-purple-50 flex-shrink-0' />
                  )}

                  {dealer.subscriptionTier === 'GOLD' && (
                    <BadgeCheck className='h-4 w-4 text-yellow-600 fill-yellow-50 flex-shrink-0' />
                  )}

                  {/* If FREE users somehow get verified, they show nothing, or maybe a simple blue tick? */}
                  {/* For now, Free users show nothing because they won't match above conditions */}
                </>
              )}
            </div>

            <p className='text-gray-500 text-sm mt-1 max-w-2xl'>
              {dealer.description || 'No bio available.'}
            </p>

            <div className='flex flex-wrap gap-4 mt-4 text-sm text-gray-600'>
              <div className='flex items-center gap-1'>
                <MapPin size={16} /> {dealer.city}, {dealer.address}
              </div>
              <div className='flex items-center gap-1'>
                <span className='font-bold text-gray-900'>
                  {dealer._count.followers}
                </span>{' '}
                Followers
              </div>
            </div>

            {/* Social Links Row */}
            <div className='flex gap-4 mt-4 pt-4'>
              {dealer.websiteUrl && (
                <SocialLink
                  href={dealer.websiteUrl}
                  icon={<FaGlobe size={18} />}
                />
              )}
              {dealer.instagram && (
                <SocialLink
                  href={`https://instagram.com/${dealer.instagram}`}
                  icon={<FaInstagram size={18} />}
                />
              )}
              {dealer.twitter && (
                <SocialLink
                  href={`https://twitter.com/${dealer.twitter}`}
                  icon={<FaTwitter size={18} />}
                />
              )}
              {dealer.facebook && (
                <SocialLink
                  href={dealer.facebook}
                  icon={<FaFacebook size={18} />}
                />
              )}
              {dealer.tiktok && (
                <SocialLink
                  href={`https://tiktok.com/@${dealer.tiktok}`}
                  icon={<FaTiktok size={18} />}
                />
              )}
              {dealer.snap && (
                <SocialLink
                  href={`https://snapchat.com/add/${dealer.snap}`}
                  icon={<FaSnapchatGhost size={18} />}
                />
              )}
            </div>

            {/* --- NEW: LOCATION MAP --- */}
            {dealer.address && dealer.city && (
              <div className='mt-8 border-t pt-6'>
                <h3 className='font-bold text-gray-900 mb-4 flex items-center gap-2'>
                  <MapPin className='text-blue-600' /> Visit Shop
                </h3>

                <div className='w-full h-64 bg-gray-100 rounded-xl overflow-hidden border shadow-inner relative'>
                  <iframe
                    width='100%'
                    height='100%'
                    frameBorder='0'
                    scrolling='no'
                    marginHeight={0}
                    marginWidth={0}
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(dealer.address + ', ' + dealer.city)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                    className='absolute inset-0'
                  ></iframe>

                  {/* Overlay for interaction protection (optional) */}
                  <div className='absolute top-2 right-2'>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(dealer.address + ', ' + dealer.city)}`}
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                      <Button
                        size='sm'
                        className='bg-white text-blue-600 hover:bg-gray-50 shadow-md'
                      >
                        Open in Google Maps
                      </Button>
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. INVENTORY GRID */}
      <div className='max-w-7xl mx-auto px-4 mt-8'>
        <div className='flex flex-col sm:flex-row justify-between items-center mb-6 gap-4'>
          <h2 className='text-xl font-bold mb-4'>
            Inventory ({products.length})
          </h2>
          <ShopSearchBar />
        </div>

        {products.length === 0 ? (
          <div className='text-center py-20 text-gray-500 bg-white rounded-xl border border-dashed'>
            {q ? (
              // STATE A: SEARCH FAILED
              <>
                <div className='inline-flex bg-gray-100 p-3 rounded-full mb-3'>
                  <Search className='h-6 w-6 text-gray-400' />
                </div>
                <h3 className='text-lg font-medium text-gray-900'>
                  No matches found
                </h3>
                <p className='text-gray-500 mb-4'>
                  We couldn't find "{q}" in this shop.
                </p>
                {/* Clear Search Button */}
                <a
                  href={`/shop/${dealer.id}`}
                  className='text-blue-600 hover:underline font-medium'
                >
                  View all items
                </a>
              </>
            ) : (
              // STATE B: SHOP EMPTY (No items at all)
              <>
                <p className='text-gray-500'>No active listings yet.</p>
              </>
            )}
          </div>
        ) : (
          <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4'>
            {products.map((product) => (
              <ProductCard
                key={product.id}
                {...product}
                image={product.images[0]}
                dealer={dealer as any} // Pass partial dealer object
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Helper for Social Icons
function SocialLink({ href, icon }: { href: string; icon: React.ReactNode }) {
  // Ensure URL has protocol
  const url = href.startsWith('http') ? href : `https://${href}`;
  return (
    <a
      href={url}
      target='_blank'
      rel='noopener noreferrer'
      className='text-gray-400 hover:text-blue-600 transition-colors bg-white p-2 rounded-full border shadow-sm hover:scale-110'
    >
      {icon}
    </a>
  );
}
