'use server';

import { auth } from '@/auth';
import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';

// 1. Create or Update Plan
export async function upsertPlan(formData: FormData) {
  const session = await auth();
  if (session?.user.role !== 'ADMIN') return { error: 'Unauthorized' };

  const id = formData.get('id') as string;

  const data = {
    name: formData.get('name') as string,
    tier: formData.get('tier') as string,
    price: parseFloat(formData.get('price') as string),
    description: formData.get('description') as string,
    buttonText: formData.get('buttonText') as string,
    isPopular: formData.get('isPopular') === 'on',
    features: (formData.get('features') as string)
      .split('\n')
      .filter((l) => l.trim()),
    // Theme Fields
    headerBg: formData.get('headerBg') as string,
    textColor: formData.get('textColor') as string,
    badgeColor: formData.get('badgeColor') as string,
    iconColor: formData.get('iconColor') as string,
  };

  try {
    if (id) {
      await prisma.subscriptionPlan.update({ where: { id }, data });
    } else {
      await prisma.subscriptionPlan.create({ data });
    }

    revalidatePath('/subscribe');
    revalidatePath('/admin');
    return { success: 'Plan saved successfully' };
  } catch (error) {
    return { error: 'Failed to save plan' };
  }
}

// 2. Delete Plan
export async function deletePlan(id: string) {
  const session = await auth();
  if (session?.user.role !== 'ADMIN') return { error: 'Unauthorized' };

  await prisma.subscriptionPlan.delete({ where: { id } });
  revalidatePath('/subscribe');
  revalidatePath('/admin');
  return { success: 'Plan deleted' };
}

// 3. Update Grid Settings (NEW)
export async function updateGridSettings(cols: number) {
  const session = await auth();
  if (session?.user.role !== 'ADMIN') return { error: 'Unauthorized' };

  // Use 'settings' hardcoded ID as we defined earlier
  await prisma.siteSettings.upsert({
    where: { id: 'settings' },
    update: { planGridCols: cols },
    create: { id: 'settings', planGridCols: cols },
  });

  revalidatePath('/subscribe'); // Update the public page
  return { success: 'Grid updated' };
}
