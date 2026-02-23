'use server';

import { auth } from '@/auth';
import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';

// 1. Promote a Product (Make it an Ad)
export async function toggleAdStatus(productId: string, isAd: boolean) {
  const session = await auth();
  if (session?.user.role !== 'ADMIN') return { error: 'Unauthorized' };

  await prisma.product.update({
    where: { id: productId },
    data: {
      isAd: isAd,
      // If turning ON, set expiry to 7 days from now (default)
      adExpiresAt: isAd ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) : null,
    },
  });

  revalidatePath('/admin');
  revalidatePath('/'); // Refresh homepage
}

// 2. Fetch All Products (for the admin table)
export async function getAdminProducts(query?: string) {
  const session = await auth();
  if (session?.user.role !== 'ADMIN') return [];

  const rawProducts = await prisma.product.findMany({
    where: query
      ? {
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { dealer: { shopName: { contains: query, mode: 'insensitive' } } },
          ],
        }
      : undefined,
    include: {
      dealer: { select: { shopName: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: 50, // Pagination later
  });

  // --- CONVERSION LOGIC ---
  return rawProducts.map((product) => ({
    ...product,
    price: Number(product.price), // Convert Decimal to Number
  }));
}
