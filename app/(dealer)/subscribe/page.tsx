import { auth } from '@/auth';
import prisma from '@/lib/db';
import { redirect } from 'next/navigation';
import SubscribeClient from './SubscribeClient';

export default async function SubscribePage() {
  const session = await auth();
  if (!session || !session.user) redirect('/login');

  // 1. Fetch User Status
  const dealer = await prisma.dealerProfile.findUnique({
    where: { userId: session.user.id },
    select: { subscriptionTier: true, subscriptionStatus: true },
  });

  // 2. Fetch Plans
  const plans = await prisma.subscriptionPlan.findMany({
    orderBy: { price: 'asc' },
  });

  // 3. Format Data for Client
  const formattedPlans = plans.map((p) => ({
    id: p.id,
    name: p.name,
    tier: p.tier,
    price: p.price,
    features: p.features,
    isPopular: p.isPopular,
    buttonText: p.buttonText,
    theme: {
      headerBg: p.headerBg,
      textColor: p.textColor,
      badgeColor: p.badgeColor,
      iconColor: p.iconColor,
    },
  }));

  return (
    <SubscribeClient
      currentTier={(dealer?.subscriptionTier || 'FREE') as string}
      isActive={dealer?.subscriptionStatus === 'ACTIVE'}
      dbPlans={formattedPlans}
    />
  );
}
