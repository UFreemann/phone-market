'use server';

import prisma from '@/lib/db';

export async function getSuggestions(query: string) {
  if (!query || query.length < 2) return [];

  // Fetch unique titles that match the query
  const products = await prisma.product.findMany({
    where: {
      OR: [
        { title: { contains: query, mode: 'insensitive' } },
        { brand: { contains: query, mode: 'insensitive' } },
        { model: { contains: query, mode: 'insensitive' } },
      ],
      isSold: false,
    },
    select: { title: true, brand: true, model: true },
    take: 5, // Limit to 5 suggestions
  });

  // Create a clean list of suggestions (Title or Brand+Model)
  // Using Set to remove duplicates
  const suggestions = Array.from(new Set(products.map((p) => p.title.trim())));

  return suggestions;
}
