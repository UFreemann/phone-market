'use server';

import prisma from '@/lib/db';

export async function getSliderData() {
  // 1. Fetch Manual Slides
  const manualSlides = await prisma.heroSlide.findMany({
    where: { isActive: true },
    orderBy: { order: 'asc' },
  });

  // 2. Fetch Top 3 Featured Products (to mix in)
  // const featuredProducts = await prisma.product.findMany({
  //   where: { isAd: true, isSold: false },
  //   take: 3,
  //   include: { dealer: { select: { shopName: true } } },
  //   orderBy: { createdAt: 'desc' },
  // });
  // 2. Fetch Top Platinum Ads (Strictly PLATINUM)
  // Logic: Must be an Ad AND sold by a Platinum Dealer
  const platinumAds = await prisma.product.findMany({
    where: {
      isAd: true,
      isSold: false,
      dealer: {
        subscriptionStatus: 'ACTIVE',
        subscriptionTier: 'PLATINUM', // <--- THE KEY RESTRICTION
      },
    },
    take: 3, // Limit to top 3 so we don't overwhelm the slider
    include: { dealer: { select: { shopName: true } } },
    orderBy: { createdAt: 'desc' },
  });

  // 3. Transform Products into Slide Format
  const productSlides = platinumAds.map((p) => ({
    id: p.id,
    title: p.title,
    subtitle: `Platinum Deal by ${p.dealer.shopName} - GH₵ ${Number(p.price).toLocaleString()}`,
    image: p.images[0],
    link: `/phone/${p.id}`,
    isProduct: true, // Flag to identify
    // color: '#7e22ce', // Optional: Force Purple button for Platinum slides
  }));

  // 4. Combine (Manual First, then Products)
  return [...manualSlides, ...productSlides];
}
