import { auth } from '@/auth';
import prisma from '@/lib/db';
import { redirect } from 'next/navigation';
import DealerShell from '@/components/dealer/DealerShell'; // Import the new component

export const dynamic = 'force-dynamic';

export default async function DealerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session || !session.user || !session.user.id)
    redirect('/login?error=session_expired');

  const dealer = await prisma.dealerProfile.findUnique({
    where: { userId: session.user.id },
    // ADD THIS INCLUDE:
    include: {
      _count: {
        select: { followers: true, leads: true },
      },
    },
  });

  if (!dealer) redirect('/');

  const now = new Date();
  const endDate = dealer.subscriptionEnd
    ? new Date(dealer.subscriptionEnd)
    : null;

  // 1. AUTO-EXPIRE LOGIC
  if (dealer.subscriptionStatus === 'ACTIVE' && endDate && now > endDate) {
    // Update DB to Inactive
    await prisma.dealerProfile.update({
      where: { id: dealer.id },
      data: { subscriptionStatus: 'INACTIVE', isVerified: false },
    });
    // Redirect to renewal
    redirect('/subscribe?reason=expired');
  }

  // 2. Existing Gate
  if (dealer.subscriptionStatus === 'INACTIVE') {
    redirect('/subscribe');
  }

  return <DealerShell dealer={dealer}>{children}</DealerShell>;
}
