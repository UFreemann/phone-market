'use server';

import { auth } from '@/auth';
import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function updateHomepageLayout(newOrder: string[]) {
  const session = await auth();
  if (session?.user.role !== 'ADMIN') return { error: 'Unauthorized' };

  try {
    await prisma.siteSettings.upsert({
      where: { id: 'settings' },
      update: { homepageLayout: newOrder },
      create: { homepageLayout: newOrder },
    });

    revalidatePath('/'); // Update homepage immediately
    return { success: 'Layout updated successfully' };
  } catch (error) {
    return { error: 'Failed to update layout' };
  }
}
