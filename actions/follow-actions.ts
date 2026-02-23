'use server';

import { auth } from '@/auth';
import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';

// 1. Toggle (Follow/Unfollow)
export async function toggleFollow(dealerId: string) {
  const session = await auth();

  // Return error so Client can redirect to Login
  if (!session || !session.user || !session.user.id) {
    return { error: 'Unauthorized' };
  }

  const visitorId = session.user.id;

  // 2. SELF-FOLLOW CHECK (New Logic)
  // We need to check if the 'dealerId' (Profile) belongs to this 'visitorId' (User)
  const targetDealer = await prisma.dealerProfile.findUnique({
    where: { id: dealerId },
    select: { userId: true },
  });

  if (targetDealer && targetDealer.userId === visitorId) {
    // You are trying to follow your own shop
    return { error: 'You cannot follow your own shop.' };
    // Ideally, the UI handles this error, but for now this stops the DB write.
  }

  // Check if already following
  const existingFollow = await prisma.follow.findUnique({
    where: {
      visitorId_dealerId: {
        visitorId,
        dealerId,
      },
    },
  });

  if (existingFollow) {
    // UNFOLLOW (Delete)
    await prisma.follow.delete({
      where: { id: existingFollow.id },
    });

    // Refresh relevant pages
    revalidatePath(`/shop/${dealerId}`);
    revalidatePath('/profile'); // Refresh visitor dashboard

    return { isFollowing: false };
  } else {
    // FOLLOW (Create)
    await prisma.follow.create({
      data: {
        visitorId,
        dealerId,
      },
    });

    // Refresh relevant pages
    revalidatePath(`/shop/${dealerId}`);
    revalidatePath('/profile');

    return { isFollowing: true };
  }
}

// 2. Check Status (Initial Load)
export async function getFollowStatus(dealerId: string) {
  const session = await auth();

  // If not logged in, they definitely aren't following
  if (!session || !session.user || !session.user.id) return false;

  const follow = await prisma.follow.findUnique({
    where: {
      visitorId_dealerId: {
        visitorId: session.user.id,
        dealerId,
      },
    },
  });

  return !!follow; // Returns true if found, false if null
}
