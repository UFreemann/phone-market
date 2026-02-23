'use server';

import { auth } from '@/auth';
import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';

// 1. Fetch Dealers (with pagination/search support later)
export async function getAdminDealers() {
  const session = await auth();
  if (session?.user.role !== 'ADMIN') return [];

  const dealers = await prisma.dealerProfile.findMany({
    include: {
      user: { select: { email: true } }, // Get email from User table
      _count: { select: { products: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return dealers;
}

// 2. Toggle Verification
export async function toggleVerification(
  dealerId: string,
  currentStatus: boolean,
) {
  const session = await auth();
  if (session?.user.role !== 'ADMIN') return { error: 'Unauthorized' };

  await prisma.dealerProfile.update({
    where: { id: dealerId },
    data: { isVerified: !currentStatus },
  });

  revalidatePath('/admin');
}

// 3. Delete/Ban Dealer
export async function deleteDealer(dealerId: string) {
  const session = await auth();
  if (session?.user.role !== 'ADMIN') return { error: 'Unauthorized' };

  // This will cascade delete User, Products, Leads due to our schema setup
  // We need to delete the USER, not just the profile, to truly ban them.

  // First get the userId
  const dealer = await prisma.dealerProfile.findUnique({
    where: { id: dealerId },
  });
  if (!dealer) return;

  await prisma.user.delete({
    where: { id: dealer.userId },
  });

  revalidatePath('/admin');
}

export async function toggleSuspend(dealerId: string, currentStatus: string) {
  const session = await auth();
  if (session?.user.role !== 'ADMIN') return { error: 'Unauthorized' };

  const newStatus = currentStatus === 'SUSPENDED' ? 'ACTIVE' : 'SUSPENDED';

  await prisma.dealerProfile.update({
    where: { id: dealerId },
    data: { subscriptionStatus: newStatus as any },
  });

  revalidatePath('/admin/dealers');
}

export async function updateDealerPlan(formData: FormData) {
  const session = await auth();
  if (session?.user.role !== 'ADMIN') return { error: 'Unauthorized' };

  // 1. Extract values from the form data object
  const dealerId = formData.get('id') as string;
  const tier = formData.get('tier') as 'GOLD' | 'PLATINUM' | 'FREE';
  const monthsToAdd = parseInt(formData.get('months') as string) || 1;

  if (!dealerId) return { error: 'Missing Dealer ID' };
  try {
    // 2. Logic: Calculate Date
    const dealer = await prisma.dealerProfile.findUnique({
      where: { id: dealerId },
    });

    const currentEnd =
      dealer?.subscriptionEnd && dealer.subscriptionEnd > new Date()
        ? dealer.subscriptionEnd
        : new Date();

    const newEnd = new Date(currentEnd);
    newEnd.setMonth(newEnd.getMonth() + monthsToAdd);

    // 3. Update DB
    await prisma.dealerProfile.update({
      where: { id: dealerId },
      data: {
        subscriptionTier: tier,
        subscriptionStatus: 'ACTIVE',
        subscriptionEnd: newEnd,
        isVerified: true,
      },
    });

    revalidatePath('/admin/dealers');
    return { success: `Updated to ${tier} for ${monthsToAdd} months` };
  } catch (error) {
    return { error: 'Failed to update plan' };
  }
}
