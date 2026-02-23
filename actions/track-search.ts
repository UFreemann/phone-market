'use server';

import prisma from '@/lib/db';

export async function trackSearch(term: string) {
  if (!term || term.length < 3) return; // Ignore short inputs

  const cleanTerm = term.trim().toLowerCase();

  try {
    await prisma.searchTerm.upsert({
      where: { term: cleanTerm },
      update: {
        count: { increment: 1 },
        updatedAt: new Date(), // Refresh timestamp
      },
      create: {
        term: cleanTerm,
        count: 1,
      },
    });
  } catch (error) {
    // Ignore errors (analytics shouldn't break the app)
    console.error('Search tracking failed', error);
  }
}
