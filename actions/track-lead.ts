'use server';

import prisma from '@/lib/db';

export async function trackLead(
  dealerId: string,
  productId: string | undefined | null,
  type: 'VIEW_CONTACT' | 'WHATSAPP',
) {
  // Normalize Date to Midnight (for grouping daily stats)
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  console.log('SERVER: Tracking Lead', { dealerId, productId, type });

  try {
    // 1. Create the Lead Record (Individual Event)
    const result = await prisma.lead.create({
      data: {
        dealerId,
        productId: productId || null,
        // visitorId: ... (We could add this if we required login for buyers later)
        type,
      },
    });

    // 2. Update Daily Stats (Aggregated Counter)
    await prisma.dailyStat.upsert({
      where: {
        dealerId_date: {
          dealerId,
          date: today,
        },
      },
      update: {
        leads: { increment: 1 },
      },
      create: {
        dealerId,
        date: today,
        leads: 1,
        views: 0, // Initialize views to 0 if this is the first event of the day
      },
    });

    console.log('SERVER: Success', result.id);
  } catch (error) {
    console.error('Failed to track lead', error);
  }
}
