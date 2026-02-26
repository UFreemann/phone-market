// 'use server';

// import { auth } from '@/auth';
// import prisma from '@/lib/db'; // Ensure we import prisma
// import { redirect } from 'next/navigation';

// const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY!;

// export async function initializePayment(formData: FormData) {
//   const session = await auth();
//   if (!session || !session.user || !session.user.email) redirect('/login');

//   const tier = formData.get('tier') as string;

//   // 1. Handle FREE Plan (7-DAY TRIAL)
//   if (tier === 'FREE') {
//     console.log('Activating 7-Day Trial for:', session.user.id);

//     // Calculate 7 Days from now
//     const sevenDaysFromNow = new Date();
//     sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

//     try {
//       await prisma.dealerProfile.update({
//         where: { userId: session.user.id },
//         data: {
//           subscriptionStatus: 'ACTIVE',
//           subscriptionTier: 'FREE',
//           subscriptionEnd: sevenDaysFromNow, // <--- SET EXPIRY

//           // REMOVE BADGE FOR FREE USERS
//           isVerified: false,
//         },
//       });
//     } catch (error) {
//       console.error('Error activating trial:', error);
//       // If this fails, it usually means the DealerProfile doesn't exist for this User ID.
//       // In a real app, you might want to create it here if missing.
//       throw new Error('Could not activate plan. Please contact support.');
//     }

//     // Redirect MUST happen outside the try/catch block (or be re-thrown)
//     // because redirect() works by throwing a special error.
//     redirect('/dashboard');
//   }

//   // ------------------------------------------------------------------
//   // 2. Handle PAID Plans (Paystack Logic)
//   // ------------------------------------------------------------------

//   // Prices in Ghana Cedis (Pesewas)
//   let amount = 0;
//   if (tier === 'GOLD') amount = 50 * 100; // GH₵ 50.00
//   if (tier === 'PLATINUM') amount = 150 * 100; // GH₵ 150.00

//   const response = await fetch(
//     'https://api.paystack.co/transaction/initialize',
//     {
//       method: 'POST',
//       headers: {
//         Authorization: `Bearer ${PAYSTACK_SECRET}`,
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         email: session.user.email,
//         amount: amount,
//         currency: 'GHS',
//         channels: ['card', 'mobile_money'],
//         callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/callback`,
//         metadata: {
//           userId: session.user.id,
//           tier: tier,
//         },
//       }),
//     }
//   );

//   const data = await response.json();

//   if (!data.status) {
//     console.error('Paystack Init Error:', data);
//     throw new Error('Payment initialization failed');
//   }

//   redirect(data.data.authorization_url);
// }

// 'use server';

// import { auth } from '@/auth';
// import prisma from '@/lib/db';
// import { redirect } from 'next/navigation';

// const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY!;

// // Pricing Configuration (Centralized Logic)
// const PRICING: any = {
//   GOLD: {
//     '1_MONTH': 50,
//     '3_MONTHS': 150,
//     '6_MONTHS': 270,
//     '1_YEAR': 480,
//   },
//   PLATINUM: {
//     '1_MONTH': 150,
//     '3_MONTHS': 450,
//     '6_MONTHS': 810,
//     '1_YEAR': 1440,
//   },
// };

// export async function initializePayment(formData: FormData) {
//   const session = await auth();
//   if (!session || !session.user || !session.user.email) redirect('/login');

//   const tier = formData.get('tier') as string;
//   const duration = formData.get('duration') as string; // "1_MONTH", "1_YEAR", etc.

//   // 1. FREE Plan Logic
//   if (tier === 'FREE') {
//     // ... (Keep existing Free/Trial logic) ...
//     const sevenDaysFromNow = new Date();
//     sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

//     await prisma.dealerProfile.update({
//       where: { userId: session.user.id },
//       data: {
//         subscriptionStatus: 'ACTIVE',
//         subscriptionTier: 'FREE',
//         subscriptionEnd: sevenDaysFromNow,
//         isVerified: false,
//       },
//     });
//     redirect('/dashboard');
//   }

//   // 2. Validate Duration & Calculate Price
//   const amountInGHS = PRICING[tier]?.[duration];

//   if (!amountInGHS) {
//     throw new Error('Invalid plan configuration.');
//   }

//   // Convert to Pesewas (x100)
//   const amountInKobo = amountInGHS * 100;

//   // 3. Initialize Paystack
//   const response = await fetch(
//     'https://api.paystack.co/transaction/initialize',
//     {
//       method: 'POST',
//       headers: {
//         Authorization: `Bearer ${PAYSTACK_SECRET}`,
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         email: session.user.email,
//         amount: amountInKobo,
//         currency: 'GHS',
//         channels: ['card', 'mobile_money'],
//         callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/callback`,
//         metadata: {
//           userId: session.user.id,
//           tier: tier,
//           duration: duration, // Pass duration to metadata so we can read it in callback
//         },
//       }),
//     },
//   );

//   const data = await response.json();

//   if (!data.status) {
//     throw new Error('Payment initialization failed');
//   }

//   redirect(data.data.authorization_url);
// }

'use server';

import { auth } from '@/auth';
import prisma from '@/lib/db';
import { redirect } from 'next/navigation';

export async function initializePayment(formData: FormData) {
  const session = await auth();
  if (!session?.user?.email) redirect('/login');

  const tier = formData.get('tier') as string;
  const duration = formData.get('duration') as string;
  const planId = formData.get('planId') as string;

  // 1. FREE Plan Logic
  if (tier === 'FREE') {
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

    await prisma.dealerProfile.update({
      where: { userId: session.user.id },
      data: {
        subscriptionStatus: 'ACTIVE',
        subscriptionTier: 'FREE',
        subscriptionEnd: sevenDaysFromNow,
        isVerified: false,
      },
    });
    redirect('/dashboard');
  }

  // 2. FETCH PLAN FROM DB
  const plan = await prisma.subscriptionPlan.findUnique({
    where: { id: planId },
  });
  if (!plan) throw new Error('Invalid Plan');

  // 3. CALCULATE TOTAL
  let basePrice = plan.price;
  let multiplier = 1;
  let discount = 0;

  if (duration === '3_MONTHS') {
    multiplier = 3;
  }
  if (duration === '6_MONTHS') {
    multiplier = 6;
    discount = 0.1;
  }
  if (duration === '1_YEAR') {
    multiplier = 12;
    discount = 0.2;
  }

  const totalAmountGHS = basePrice * multiplier * (1 - discount);
  const totalAmountKobo = Math.round(totalAmountGHS * 100);

  // 4. PAYSTACK INIT
  const response = await fetch(
    'https://api.paystack.co/transaction/initialize',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: session.user.email,
        amount: totalAmountKobo,
        currency: 'GHS',
        channels: ['card', 'mobile_money', 'bank_transfer'],
        callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/callback`,
        metadata: {
          userId: session.user.id,
          tier: plan.tier, // Use system tier (GOLD/PLATINUM)
          duration: duration,
        },
      }),
    },
  );

  const data = await response.json();
  // if (!data.status) throw new Error('Payment Init Failed');
  // DEBUG LOG
  if (!data.status) {
    console.error('---------------- PAYSTACK ERROR ----------------');
    console.error('Message:', data.message);
    console.error('Details:', JSON.stringify(data, null, 2)); // Print full object
    console.error('Payload Sent:', {
      email: session.user.email,
      amount: totalAmountKobo,
      currency: 'GHS',
    });
    console.error('------------------------------------------------');

    throw new Error(`Payment Init Failed: ${data.message}`);
  }

  redirect(data.data.authorization_url);
}
