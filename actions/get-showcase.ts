'use server';

import prisma from '@/lib/db';

export async function getShowcaseProducts() {
  const products = await prisma.product.findMany({
    where: { isSold: false, dealer: { subscriptionStatus: 'ACTIVE' } },
    take: 20, // Fetch 20 items for the slider
    orderBy: { createdAt: 'desc' },
    include: { dealer: { select: { shopName: true } } },
  });

  return products.map((p) => ({
    ...p,
    price: Number(p.price),
  }));
}
