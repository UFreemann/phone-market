'use server';

import { auth } from '@/auth';
import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function toggleReelLike(reelId: string) {
  const session = await auth();
  if (!session?.user) return { error: 'Unauthorized' };

  const userId = session.user.id;

  const existing = await prisma.reelLike.findUnique({
    where: { reelId_userId: { reelId, userId } },
  });

  if (existing) {
    // UNLIKE
    await prisma.$transaction([
      prisma.reelLike.delete({ where: { id: existing.id } }),
      prisma.reel.update({
        where: { id: reelId },
        data: { likeCount: { decrement: 1 } },
      }),
    ]);
    return { liked: false };
  } else {
    // LIKE
    await prisma.$transaction([
      prisma.reelLike.create({ data: { reelId, userId } }),
      prisma.reel.update({
        where: { id: reelId },
        data: { likeCount: { increment: 1 } },
      }),
    ]);
    return { liked: true };
  }
}

export async function getReelStatus(reelId: string) {
  const session = await auth();
  if (!session?.user) return false;
  const like = await prisma.reelLike.findUnique({
    where: { reelId_userId: { reelId, userId: session.user.id } },
  });
  return !!like;
}
