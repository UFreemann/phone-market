'use server';

import { auth } from '@/auth';
import { redirect } from 'next/navigation';

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY!;

export async function initializeCreditPurchase(quantity: number) {
  const session = await auth();
  if (!session?.user?.email) redirect('/login');

  // DEFINE PRICING LOGIC HERE (Match your UI)
  let totalGHS = 0;

  if (quantity === 5) totalGHS = 50;
  else if (quantity === 10)
    totalGHS = 90; // Discounted
  else if (quantity === 20) totalGHS = 180;
  else {
    // Fallback for custom amounts (e.g. 10 GHS per credit)
    totalGHS = quantity * 10;
  }

  const amountInCedis = totalGHS * 100; // Convert to Pesewas

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
        amount: amountInCedis,
        currency: 'GHS',
        // channels: ['card', 'mobile_money', 'bank_transfer'],
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
