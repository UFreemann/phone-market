'use server';

import { auth } from '@/auth';
import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';

// 1. Create a New Manual Slide
export async function createSlide(formData: FormData) {
  const session = await auth();

  // Strict Admin Check
  if (!session || session.user.role !== 'ADMIN') {
    return { error: 'Unauthorized' };
  }

  const title = formData.get('title') as string;
  const subtitle = formData.get('subtitle') as string;
  const image = formData.get('imageUrl') as string; // Matches the key from the upload form
  const link = formData.get('link') as string;
  const color = formData.get('color') as string;
  const order = parseInt(formData.get('order') as string) || 0;

  if (!title || !image) {
    return { error: 'Title and Image are required.' };
  }

  try {
    await prisma.heroSlide.create({
      data: {
        title,
        subtitle: subtitle || '',
        image,
        link: link || '/', // Default to homepage if no link provided
        order,
        color: color || '#2563EB',
        isActive: true,
      },
    });

    // Refresh pages to show new content immediately
    revalidatePath('/');
    revalidatePath('/admin');

    return { success: 'Slide created successfully!' };
  } catch (error) {
    console.error('Create Slide Error:', error);
    return { error: 'Failed to create slide.' };
  }
}

// 2. Delete a Manual Slide
export async function deleteSlide(slideId: string) {
  const session = await auth();

  if (!session || session.user.role !== 'ADMIN') {
    return { error: 'Unauthorized' };
  }

  try {
    await prisma.heroSlide.delete({
      where: { id: slideId },
    });

    revalidatePath('/');
    revalidatePath('/admin');

    return { success: 'Slide deleted.' };
  } catch (error) {
    console.error('Delete Slide Error:', error);
    return { error: 'Failed to delete slide.' };
  }
}
