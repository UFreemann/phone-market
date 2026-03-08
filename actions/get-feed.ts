'use server';

import { auth } from '@/auth';
import prisma from '@/lib/db';

export async function getFollowingFeed(query?: string, page = 1, limit = 20) {
  const session = await auth();

  // Return empty structure if not logged in
  if (!session || !session.user) {
    return { products: [], totalCount: 0 };
  }

  const offset = (page - 1) * limit;

  // 1. Get IDs of dealers I follow
  const following = await prisma.follow.findMany({
    where: { visitorId: session.user.id },
    select: { dealerId: true },
  });

  const dealerIds = following.map((f) => f.dealerId);

  if (dealerIds.length === 0) {
    return { products: [], totalCount: 0 };
  }

  // 2. Build Filter Logic
  const whereClause: any = {
    dealerId: { in: dealerIds }, // Only from followed dealers
    isSold: false,
    // Allow ACTIVE and INACTIVE (Grace Period), hide SUSPENDED
    dealer: { subscriptionStatus: { not: 'SUSPENDED' } },
  };

  // Add Search Query if present
  if (query) {
    whereClause.OR = [
      { title: { contains: query, mode: 'insensitive' } },
      { model: { contains: query, mode: 'insensitive' } },
    ];
  }

  // 3. Fetch Data & Count in Parallel
  const [rawProducts, totalCount] = await Promise.all([
    prisma.product.findMany({
      where: whereClause,
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
      orderBy: { createdAt: 'desc' }, // Newest first
      take: limit,
      skip: offset,
    }),
    prisma.product.count({ where: whereClause }),
  ]);

  // 4. Convert Decimal to Number
  const products = rawProducts.map((p) => ({
    ...p,
    price: Number(p.price),
  }));

  return { products, totalCount };
}
