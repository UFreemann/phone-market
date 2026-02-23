'use server';

import prisma from '@/lib/db';

export async function getProductById(id: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        dealer: {
          select: {
            id: true, // Needed for tracking leads
            shopName: true,
            city: true,
            isVerified: true,
            subscriptionTier: true,
            image: true,
            coverImage: true,
            phone: true, // WhatsApp Number
            description: true, // Shop Bio
            createdAt: true, // You might need to add createdAt to DealerProfile in schema if missing
          },
        },
      },
    });

    if (!product) return null;

    // Convert Decimal
    return {
      ...product,
      price: Number(product.price),
    };
  } catch (error) {
    return null;
  }
}
