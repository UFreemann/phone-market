'use server';

import { auth } from '@/auth';
import prisma from '@/lib/db';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { sendNewStockAlert } from '@/lib/mail';

export async function addProduct(formData: FormData) {
  const session = await auth();
  if (!session || !session.user) {
    redirect('/login');
  }

  // 1. Fetch Dealer & Current Count
  const dealerUser = await prisma.dealerProfile.findUnique({
    where: { userId: session.user.id },
    include: {
      _count: { select: { products: true } },
    },
  });

  if (!dealerUser) return { error: 'Dealer not found' };

  // 2. ENFORCE LIMITS
  const currentCount = dealerUser._count.products;
  const plan = dealerUser.subscriptionTier;

  const LIMITS = {
    FREE: 3,
    GOLD: 50,
    PLATINUM: 9999,
  };

  if (currentCount >= LIMITS[plan]) {
    return {
      error: `You have reached the limit of ${LIMITS[plan]} phones for the ${plan} plan. Please upgrade to post more.`,
    };
  }

  // 3. Extract Data
  const title = formData.get('title') as string;
  const brand = formData.get('brand') as string;
  const model = formData.get('model') as string;
  const price = parseFloat(formData.get('price') as string);
  const condition = formData.get('condition') as 'NEW' | 'USED' | 'REFURBISHED';
  const description = formData.get('description') as string;
  const isNegotiable = formData.get('isNegotiable') === 'on';

  // NEW: Category Field
  const category = formData.get('category') as
    | 'PHONE'
    | 'LAPTOP'
    | 'ACCESSORY'
    | 'TABLET'
    | 'OTHER';

  // --- IMAGE HANDLING UPDATE ---
  // We expect a comma-separated string of URLs
  const imageUrlsString = formData.get('imageUrls') as string;
  const images = imageUrlsString
    ? imageUrlsString.split(',').filter(Boolean)
    : [];

  if (images.length === 0) {
    return { error: 'Please upload at least one image.' };
  }
  // -----------------------------

  // 4. Save to Database
  try {
    const newProduct = await prisma.product.create({
      data: {
        dealerId: dealerUser.id,
        title,
        brand,
        model: model || 'Generic', // Fallback for accessories
        price,
        condition,
        category: category || 'PHONE',
        images: images,
        isSold: false,
        isNegotiable: isNegotiable,
        description: description || null,
      },
    });

    // 5. Send Notifications (Fire and Forget)
    (async () => {
      try {
        const followers = await prisma.follow.findMany({
          where: { dealerId: dealerUser.id },
          include: { visitor: { select: { email: true, name: true } } },
        });

        for (const follow of followers.slice(0, 50)) {
          if (follow.visitor.email) {
            await sendNewStockAlert(
              follow.visitor.email,
              follow.visitor.name || 'Customer',
              dealerUser.shopName,
              title,
              price,
              newProduct.id,
            );
          }
        }
      } catch (err) {
        console.error('Failed to send alerts', err);
      }
    })();
  } catch (error) {
    console.error('Database Error:', error);
    return { error: 'Failed to save product.' };
  }

  revalidatePath('/dashboard');
  revalidatePath('/dashboard/inventory');
  redirect('/dashboard/inventory');
}
