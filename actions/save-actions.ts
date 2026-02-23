'use server';

import { auth } from '@/auth';
import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function toggleSave(productId: string) {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    return { error: 'Unauthorized' };
  }
  const userId = session.user.id;

  const existing = await prisma.savedItem.findUnique({
    where: {
      userId_productId: { userId, productId },
    },
  });

  if (existing) {
    // UNSAVE
    await prisma.savedItem.delete({ where: { id: existing.id } });
    revalidatePath('/saved');
    return { isSaved: false };
  } else {
    // SAVE
    await prisma.savedItem.create({
      data: { userId, productId },
    });
    revalidatePath('/saved');
    return { isSaved: true };
  }
}

export async function getSaveStatus(productId: string) {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    return false;
  }

  const saved = await prisma.savedItem.findUnique({
    where: { userId_productId: { userId: session.user.id, productId } },
  });
  return !!saved;
}
