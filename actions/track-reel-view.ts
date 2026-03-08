'use server';
import prisma from '@/lib/db';

export async function trackReelView(reelId: string) {
  await prisma.reel.update({
    where: { id: reelId },
    data: { views: { increment: 1 } },
  });
}
