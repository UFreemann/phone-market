'use server';

import prisma from '@/lib/db';

export async function trackDealerView(dealerId: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize to midnight

  try {
    await prisma.dealerProfile.update({
      where: { id: dealerId },
      data: {
        views: { increment: 1 },
      },
    });

    // 2. Update Daily Stat (Upsert)
    await prisma.dailyStat.upsert({
      where: { dealerId_date: { dealerId, date: today } },
      update: { views: { increment: 1 } },
      create: { dealerId, date: today, views: 1 },
    });
  } catch (error) {
    // Fail silently. Analytics shouldn't crash the app.
    console.error('Failed to track view:', error);
  }
}
