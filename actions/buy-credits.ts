'use server';

import { auth } from '@/auth';
import { redirect } from 'next/navigation';

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY!;
const CREDIT_PRICE_KOBO = 1000 * 100; // GH₵ 10 per credit (Example)

export async function initializeCreditPurchase(quantity: number) {
  const session = await auth();
  if (!session?.user?.email) redirect('/login');

  const amount = quantity * CREDIT_PRICE_KOBO;

  const response = await fetch(
    'https://api.paystack.co/transaction/initialize',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: session.user.email,
        amount: amount,
        currency: 'GHS',
        channels: ['card', 'mobile_money'],
        callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/credits/callback`, // Different callback!
        metadata: {
          userId: session.user.id,
          type: 'CREDIT_PURCHASE',
          quantity: quantity,
        },
      }),
    },
  );

  const data = await response.json();
  if (!data.status) throw new Error('Payment Init Failed');

  redirect(data.data.authorization_url);
}
