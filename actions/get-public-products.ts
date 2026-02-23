'use server';

import prisma from '@/lib/db';

export async function getPublicProducts(
  searchQuery?: string,
  brand?: string,
  condition?: string,
  minPrice?: number,
  maxPrice?: number,
  category?: string,
) {
  // 1. Build the Filter Logic
  // We always want unsold phones.
  // If a search query exists, we look inside Title, Brand, or Model.
  const whereClause: any = {
    isSold: false, // Only show available items
    dealer: {
      // subscriptionStatus: 'ACTIVE', // Only show items from active dealers
      subscriptionStatus: { not: 'SUSPENDED' }, // Show ACTIVE and INACTIVE, hide SUSPENDED
    },

    ...(category && { category: category as any }),
    ...(brand && { brand: { equals: brand, mode: 'insensitive' } }),
    ...(condition && { condition: condition as any }), // "NEW", "USED"
    ...(minPrice && { price: { gte: minPrice } }),
    ...(maxPrice && { price: { lte: maxPrice } }),
  };

  if (searchQuery) {
    whereClause.OR = [
      { title: { contains: searchQuery, mode: 'insensitive' } },
      { brand: { contains: searchQuery, mode: 'insensitive' } },
      { model: { contains: searchQuery, mode: 'insensitive' } },
      { dealer: { shopName: { contains: searchQuery, mode: 'insensitive' } } },
    ];
  }

  // 2. Fetch from Database
  const rawProducts = await prisma.product.findMany({
    where: whereClause,
    include: {
      dealer: {
        select: {
          shopName: true,
          city: true,
          isVerified: true,
          subscriptionTier: true,
          image: true, // Fetch Dealer Logo for the card
        },
      },
    },
    orderBy: [
      // --- THE RANKING ALGORITHM ---
      // We sort by Subscription Tier (Descending: Z -> A)
      // P (Platinum) -> G (Gold) -> F (Free)
      { dealer: { subscriptionTier: 'desc' } },

      // Secondary Sort: Newest items first
      { createdAt: 'desc' },
    ],
  });

  // 3. Convert Decimal to Number
  // (Required because Next.js Client Components can't handle Prisma Decimals)
  const products = rawProducts.map((product) => ({
    ...product,
    price: Number(product.price),
  }));

  return products;
}
