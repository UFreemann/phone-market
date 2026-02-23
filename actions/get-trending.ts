'use server';

import prisma from '@/lib/db';

export async function getTrendingSearches() {
  const trending = await prisma.searchTerm.findMany({
    orderBy: { count: 'desc' },
    take: 5,
  });
  return trending;
}
