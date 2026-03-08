'use server';
import prisma from '@/lib/db';

export async function getReels() {
  return await prisma.reel.findMany({
    include: {
      dealer: { select: { shopName: true, image: true, id: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: 20,
  });
}

export async function getTrendingReels() {
  return await prisma.reel.findMany({
    take: 10,
    orderBy: { views: 'desc' }, // Most viewed first
    include: { dealer: { select: { shopName: true, image: true } } },
  });
}
