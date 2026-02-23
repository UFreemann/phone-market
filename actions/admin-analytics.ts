'use server';
import prisma from '@/lib/db';
import { format, subDays } from 'date-fns';

export async function getAdminAnalytics() {
  const thirtyDaysAgo = subDays(new Date(), 30);

  // 1. Fetch Dealers joined in last 30 days
  const dealers = await prisma.dealerProfile.findMany({
    where: { createdAt: { gte: thirtyDaysAgo } },
    select: { createdAt: true },
  });

  // 2. Map to { date: "Mar 10", count: 5 }
  // We need to fill in zero-days for a nice chart
  const chartData = [];
  for (let i = 29; i >= 0; i--) {
    const d = subDays(new Date(), i);
    const dateKey = format(d, 'yyyy-MM-dd');
    const label = format(d, 'MMM d');

    const count = dealers.filter(
      (u) => format(u.createdAt, 'yyyy-MM-dd') === dateKey,
    ).length;
    chartData.push({ date: label, count });
  }

  return chartData;
}
