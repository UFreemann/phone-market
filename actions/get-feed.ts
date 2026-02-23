'use server';

import { auth } from '@/auth';
import prisma from '@/lib/db';

export async function getFollowingFeed() {
  const session = await auth();
  if (!session || !session.user) return [];

  // 1. Get IDs of dealers I follow
  const following = await prisma.follow.findMany({
    where: { visitorId: session.user.id },
    select: { dealerId: true },
  });

  const dealerIds = following.map((f) => f.dealerId);

  if (dealerIds.length === 0) return [];

  // 2. Fetch Products from ONLY those dealers
  const rawProducts = await prisma.product.findMany({
    where: {
      dealerId: { in: dealerIds }, // <--- The Magic Filter
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
    orderBy: { createdAt: 'desc' }, // Newest first
    take: 50, // Limit feed size
  });

  // 3. Convert Decimal
  return rawProducts.map((p) => ({
    ...p,
    price: Number(p.price),
  }));
}
