'use server';

import { auth } from '@/auth';
import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function addReel(formData: FormData) {
  const session = await auth();
  if (!session?.user) return { error: 'Unauthorized' };

  const videoUrl = formData.get('videoUrl') as string;
  const caption = formData.get('caption') as string;

  if (!videoUrl) return { error: 'Video is required' };

  const dealer = await prisma.dealerProfile.findUnique({
    where: { userId: session.user.id },
  });
  if (!dealer) return { error: 'Dealer not found' };

  await prisma.reel.create({
    data: {
      dealerId: dealer.id,
      videoUrl,
      caption,
    },
  });

  revalidatePath('/dashboard/reels');
  redirect('/dashboard/reels');
}
