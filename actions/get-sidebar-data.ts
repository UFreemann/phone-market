'use server';

import prisma from '@/lib/db';

export async function getSidebarData() {
  // 1. Fetch Trending Products (Most Leads)
  const rawTrending = await prisma.product.findMany({
    where: { isSold: false, dealer: { subscriptionStatus: 'ACTIVE' } },
    orderBy: {
      leads: { _count: 'desc' }, // Products with the most interaction
    },
    take: 5,
    include: { dealer: { select: { shopName: true } } },
  });

  const trendingProducts = rawTrending.map((p) => ({
    ...p,
    price: Number(p.price),
  }));

  // 2. Fetch Top Dealers (Most Followers, Platinum/Gold only)
  const topDealers = await prisma.dealerProfile.findMany({
    where: {
      subscriptionStatus: 'ACTIVE',
      subscriptionTier: { in: ['PLATINUM', 'GOLD'] },
    },
    orderBy: {
      followers: { _count: 'desc' }, // Most popular shops
    },
    take: 5,
    select: {
      id: true,
      shopName: true,
      image: true,
      isVerified: true,
      subscriptionTier: true,
      _count: { select: { products: true } },
    },
  });

  return { trendingProducts, topDealers };
}
