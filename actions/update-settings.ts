'use server';

import { auth } from '@/auth';
import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function updateSettings(formData: FormData) {
  const session = await auth();
  if (!session || !session.user) return { error: 'Unauthorized' };

  const shopName = formData.get('shopName') as string;
  const phone = formData.get('phone') as string; // WhatsApp
  const city = formData.get('city') as string;
  const address = formData.get('address') as string;
  const description = formData.get('description') as string;

  // NEW: Check for removal flag
  const shouldRemoveImage = formData.get('removeImage') === 'true';
  const shouldRemoveId = formData.get('removeId') === 'true';
  const imageUrl = formData.get('imageUrl') as string; // Profile Logo
  const coverImageUrl = formData.get('coverImageUrl') as string;
  const shouldRemoveCover = formData.get('removeCover') === 'true';

  const brandColor = formData.get('brandColor') as string;

  // *** NEW: ID CARD LOGIC ***
  const idCardImage = formData.get('idCardImage') as string;

  // NEW: Social Fields
  const websiteUrl = formData.get('websiteUrl') as string;
  const instagram = formData.get('instagram') as string;
  const tiktok = formData.get('tiktok') as string;
  const facebook = formData.get('facebook') as string;
  const twitter = formData.get('twitter') as string;
  const snap = formData.get('snap') as string;

  try {
    await prisma.dealerProfile.update({
      where: { userId: session.user.id },
      data: {
        shopName,
        phone,
        city,
        address,
        description,

        brandColor,
        // SAVE SOCIALS
        websiteUrl,
        instagram,
        tiktok,
        facebook,
        twitter,
        snap,

        // LOGIC:
        // 1. If remove flag is ON -> Set to null
        // 2. Else if new URL exists -> Update it
        // 3. Else -> Do nothing (keep existing)
        ...(shouldRemoveImage
          ? { image: null }
          : imageUrl
            ? { image: imageUrl }
            : {}),
        // Only update image if a new one was uploaded (string is not empty)
        // ...(imageUrl && { image: imageUrl }),
        // COVER IMAGE LOGIC
        ...(shouldRemoveCover
          ? { coverImage: null }
          : coverImageUrl
            ? { coverImage: coverImageUrl }
            : {}),

        ...(shouldRemoveId
          ? { idCardImage: null }
          : idCardImage
            ? { idCardImage }
            : {}),

        // ID Card Logic (Only update if a new one is provided)
        ...(idCardImage ? { idCardImage: idCardImage } : {}),
      },
    });

    revalidatePath('/dashboard');
    return { success: 'Profile updated successfully!' };
  } catch (error) {
    console.error('Settings Update Error:', error);
    return { error: 'Failed to update settings.' };
  }
}
