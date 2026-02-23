'use server';

import prisma from '@/lib/db';

export async function getSponsoredProducts() {
  const products = await prisma.product.findMany({
    where: {
      isAd: true,
      isSold: false,
      dealer: { subscriptionStatus: 'ACTIVE' },
    },
    include: {
      dealer: {
        select: {
          shopName: true,
          city: true,
          isVerified: true,
          subscriptionTier: true,
          image: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: 8, // Show top 8 ads
  });

  return products.map((p) => ({
    ...p,
    price: Number(p.price),
  }));
}
