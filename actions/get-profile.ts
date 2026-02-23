'use server';

import { auth } from '@/auth';
import prisma from '@/lib/db';

export async function getDealerProfile() {
  const session = await auth();
  if (!session?.user) return null;

  const dealer = await prisma.dealerProfile.findUnique({
    where: { userId: session.user.id },
  });

  return dealer;
}
