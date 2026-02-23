'use server';

import { auth } from '@/auth';
import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';

// 1. Mark as Sold / Available
export async function toggleSoldStatus(
  productId: string,
  currentStatus: boolean
) {
  const session = await auth();
  if (!session || !session.user) return;

  // Verify ownership (Security check)
  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: { dealer: true },
  });

  // Ensure the user trying to change it actually owns the phone
  if (!product || product.dealer.userId !== session.user.id) {
    throw new Error('Unauthorized');
  }

  // Update DB
  await prisma.product.update({
    where: { id: productId },
    data: { isSold: !currentStatus },
  });

  // Refresh Dashboard
  revalidatePath('/dashboard');
  revalidatePath('/dashboard/inventory');
}

// 2. Delete Product
export async function deleteProduct(productId: string) {
  const session = await auth();
  if (!session || !session.user) return;

  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: { dealer: true },
  });

  if (!product || product.dealer.userId !== session.user.id) {
    throw new Error('Unauthorized');
  }

  // Delete from DB
  await prisma.product.delete({
    where: { id: productId },
  });

  revalidatePath('/dashboard');
  revalidatePath('/dashboard/inventory');
}

// 3. Bulk Delete
export async function deleteBulkProducts(productIds: string[]) {
  const session = await auth();
  if (!session || !session.user) return;

  // Security: We use deleteMany with a specific where clause
  // ensuring the user can ONLY delete products they own.
  await prisma.product.deleteMany({
    where: {
      id: { in: productIds }, // Delete any ID in this list...
      dealer: { userId: session.user.id }, // ...BUT ONLY if it belongs to this dealer
    },
  });

  revalidatePath('/dashboard');
  revalidatePath('/dashboard/inventory');
}
