'use server';

import prisma from '@/lib/db';

export async function getDealerById(dealerId: string, searchQuery?: string) {
  try {
    const dealer = await prisma.dealerProfile.findUnique({
      where: { id: dealerId },
      include: {
        _count: {
          select: { followers: true, products: true },
        },
      },
    });

    if (!dealer) return null;

    // Filter Products Logic
    const whereClause: any = {
      isSold: false,
      dealerId: dealer.id,
      dealer: { subscriptionStatus: { not: 'SUSPENDED' } }, // Show ACTIVE and INACTIVE, hide SUSPENDED
    };

    // If query exists, filter by Title/Model
    if (searchQuery) {
      whereClause.OR = [
        { title: { contains: searchQuery, mode: 'insensitive' } },
        { model: { contains: searchQuery, mode: 'insensitive' } },
      ];
    }

    // Fetch their products separately (Clean separation)
    const rawProducts = await prisma.product.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
    });

    const products = rawProducts.map((p) => ({
      ...p,
      price: Number(p.price),
    }));

    return { dealer, products };
  } catch (error) {
    return null;
  }
}
