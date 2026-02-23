'use server';

import { auth } from '@/auth';
import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function deleteAllLeads() {
  const session = await auth();
  if (!session || !session.user) return;

  const dealer = await prisma.dealerProfile.findUnique({
    where: { userId: session.user.id },
  });

  if (!dealer) throw new Error('Unauthorized');

  // Delete all leads belonging to this dealer
  await prisma.lead.deleteMany({
    where: { dealerId: dealer.id },
  });

  revalidatePath('/dashboard/leads');
}
