'use server';

import { auth } from '@/auth';
import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function promoteProduct(productId: string) {
  const session = await auth();
  if (!session?.user) return { error: 'Unauthorized' };

  const dealer = await prisma.dealerProfile.findUnique({
    where: { userId: session.user.id },
  });

  if (!dealer || dealer.adCredits < 1) {
    return { error: 'Insufficient credits. Please buy more.' };
  }

  // Calculate Expiry (7 Days)
  const expiry = new Date();
  expiry.setDate(expiry.getDate() + 7);

  // Transaction: Deduct Credit AND Update Product
  await prisma.$transaction([
    prisma.dealerProfile.update({
      where: { id: dealer.id },
      data: { adCredits: { decrement: 1 } },
    }),
    prisma.product.update({
      where: { id: productId },
      data: { isAd: true, adExpiresAt: expiry },
    }),
  ]);

  revalidatePath('/dashboard');
  return { success: 'Product promoted for 7 days!' };
}
