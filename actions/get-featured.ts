'use server';

import prisma from '@/lib/db';

export async function getFeaturedProducts() {
  // Fetch products ONLY from Platinum Dealers
  // Limit to top 4 or 8 to keep the homepage fast
  const products = await prisma.product.findMany({
    where: {
      dealer: {
        subscriptionTier: 'PLATINUM',
        subscriptionStatus: 'ACTIVE',
      },
      isSold: false, // Only available phones
    },
    include: {
      dealer: {
        select: {
          shopName: true,
          city: true,
          isVerified: true,
          image: true, // We might want to show the dealer logo too
          subscriptionTier: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: 8, // Show top 8 featured items
  });

  // Convert Decimal to Number for the frontend
  return products.map((p) => ({
    ...p,
    price: Number(p.price),
  }));
}
