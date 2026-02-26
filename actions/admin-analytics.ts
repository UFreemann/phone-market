'use server';
import prisma from '@/lib/db';
import { format, subDays } from 'date-fns';

export async function getAdminAnalytics(startDate?: Date, endDate?: Date) {
  // const thirtyDaysAgo = subDays(new Date(), 30);
  // Use passed dates or default to 30 days
  const start = startDate || subDays(new Date(), 30);
  const end = endDate || new Date();

  // 1. Fetch Dealers joined in range
  const dealers = await prisma.dealerProfile.findMany({
    where: { createdAt: { gte: start, lte: end } },
    select: { createdAt: true },
  });

  // 2. Map to { date: "Mar 10", count: 5 }
  // We need to fill in zero-days for a nice chart

  // 2. Map chart data (Dynamic loop based on days diff)
  const chartData = [];
  const daysDiff = Math.ceil(
    (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24),
  );

  for (let i = daysDiff; i >= 0; i--) {
    const d = subDays(end, i);
    const dateKey = format(d, 'yyyy-MM-dd');
    const label = format(d, 'MMM d');

    const count = dealers.filter(
      (u) => format(u.createdAt, 'yyyy-MM-dd') === dateKey,
    ).length;
    chartData.push({ date: label, count });
  }

  return chartData;
}
