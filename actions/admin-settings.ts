'use server';

import { auth } from '@/auth';
import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function updateSiteSettings(formData: FormData) {
  const session = await auth();
  const sidebarAdImage = formData.get('sidebarAdImage') as string;
  const sidebarAdLink = formData.get('sidebarAdLink') as string;
  const sidebarAdTitle = formData.get('sidebarAdTitle') as string;
  const sidebarAdSubtitle = formData.get('sidebarAdSubtitle') as string;
  const removeSidebarAd = formData.get('removeSidebarAd') === 'true';

  if (session?.user.role !== 'ADMIN') return { error: 'Unauthorized' };

  // ROBUST BOOLEAN CHECK
  // It is true ONLY if the string is explicitly "on". Anything else ("off", null, undefined) is false.
  const showSecondaryBtn = formData.get('showSecondaryBtn') === 'on';

  // SANITIZE INPUTS (Ensure Strings)
  const ctaTitle =
    formData.get('ctaTitle')?.toString() || 'Are you a Phone Dealer?';
  const ctaSubtitle =
    formData.get('ctaSubtitle')?.toString() ||
    'Join thousands of sellers. Create your shop, verify your identity, and reach millions of buyers today.';
  const ctaGradientFrom =
    formData.get('ctaGradientFrom')?.toString() || '#1e3a8a';
  const ctaGradientTo = formData.get('ctaGradientTo')?.toString() || '#1d4ed8';
  const ctaHighlightText = formData.get('ctaHighlightText')?.toString() || '';
  const ctaHighlightColor =
    formData.get('ctaHighlightColor')?.toString() || '#fde047';

  const btnPrimaryLabel =
    formData.get('btnPrimaryLabel')?.toString() || 'Start Selling';
  const btnPrimaryLink =
    formData.get('btnPrimaryLink')?.toString() || '/register';

  // FALLBACKS for Optional Secondary
  const btnSecondaryLabel =
    formData.get('btnSecondaryLabel')?.toString() || 'Login';
  const btnSecondaryLink =
    formData.get('btnSecondaryLink')?.toString() || '/login';

  await prisma.siteSettings.upsert({
    where: { id: 'settings' },
    update: {
      ctaTitle,
      ctaSubtitle,
      ctaGradientFrom,
      ctaGradientTo,
      ctaHighlightText,
      ctaHighlightColor,
      btnPrimaryLabel,
      btnPrimaryLink,
      btnSecondaryLabel,
      btnSecondaryLink,
      showSecondaryBtn,
      ...(sidebarAdImage && { sidebarAdImage }),
      ...(sidebarAdLink && { sidebarAdLink }),
      ...(sidebarAdTitle && { sidebarAdTitle }),
      ...(sidebarAdSubtitle && { sidebarAdSubtitle }),
      // Logic: If remove flag is true, set to null. Otherwise, update if new image exists.
      ...(removeSidebarAd
        ? { sidebarAdImage: null, sidebarAdLink: null }
        : sidebarAdImage
          ? { sidebarAdImage, sidebarAdLink }
          : {}),
    },
    create: {
      id: 'settings',
      ctaTitle,
      ctaSubtitle,
      ctaGradientFrom,
      ctaGradientTo,
      ctaHighlightText,
      ctaHighlightColor,
      btnPrimaryLabel,
      btnPrimaryLink,
      btnSecondaryLabel,
      btnSecondaryLink,
      showSecondaryBtn,
    },
  });

  revalidatePath('/');
  return { success: 'Settings updated' };
}

export async function getSiteSettings() {
  const settings = await prisma.siteSettings.findUnique({
    where: { id: 'settings' },
  });
  // Return defaults if null
  return (
    settings || {
      ctaTitle: 'Are you a Phone Dealer?',
      ctaSubtitle:
        'Join thousands of sellers. Create your shop, verify your identity, and reach millions of buyers today.',
      ctaGradientFrom: '#1e3a8a',
      ctaGradientTo: '#1d4ed8',
      ctaHighlightText: 'Start your 7-Day Free Trial now.',
      ctaHighlightColor: '#fde047',
      btnPrimaryLabel: 'Start Selling',
      btnPrimaryLink: '/register',
      btnSecondaryLabel: 'Login',
      btnSecondaryLink: '/login',
      showSecondaryBtn: true,
      planGridCols: 3,
      homepageLayout: [
        'HERO',
        'SPONSORED',
        'SHOWCASE',
        'COLLECTION',
        'CTA',
        'FEATURED',
        'LATEST',
      ],
      sidebarAdImage: null, // Default to null (shows placeholder "Advertise Here")
      sidebarAdLink: '',
    }
  );
}
