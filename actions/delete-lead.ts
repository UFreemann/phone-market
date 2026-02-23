'use server';

import { auth } from '@/auth';
import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function deleteLead(leadId: string) {
  const session = await auth();
  if (!session?.user) return;

  // Verify ownership
  const lead = await prisma.lead.findUnique({
    where: { id: leadId },
    include: { dealer: true },
  });

  if (!lead || lead.dealer.userId !== session.user.id) {
    throw new Error('Unauthorized');
  }

  await prisma.lead.delete({
    where: { id: leadId },
  });

  revalidatePath('/dashboard/leads');
}
