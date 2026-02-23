import prisma from '@/lib/db';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle } from 'lucide-react';

type Props = {
  searchParams: Promise<{ reference?: string }>;
};

export default async function PaymentCallbackPage(props: Props) {
  const searchParams = await props.searchParams;
  const reference = searchParams.reference;

  if (!reference) {
    return <StatusCard error='No payment reference found.' />;
  }

  // 1. Verify Transaction
  const verifyReq = await fetch(
    `https://api.paystack.co/transaction/verify/${reference}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
      cache: 'no-store',
    },
  );

  const verifyData = await verifyReq.json();

  if (!verifyData.status || verifyData.data.status !== 'success') {
    return <StatusCard error='Payment verification failed.' />;
  }

  const { userId, tier, duration } = verifyData.data.metadata;

  // 2. Fetch Dealer to check Current Expiry Date
  const dealer = await prisma.dealerProfile.findUnique({
    where: { userId: userId },
    select: { subscriptionEnd: true },
  });

  if (!dealer) return <StatusCard error='Dealer profile not found' />;

  // 3. Calculate New Expiry (Early Renewal Logic)
  // If their subscription is still valid (in future), add time to THAT date.
  // If expired or null, start from NOW.
  const now = new Date();
  const currentEnd = dealer.subscriptionEnd
    ? new Date(dealer.subscriptionEnd)
    : null;

  // Use existing date if valid, otherwise use now
  const baseDate = currentEnd && currentEnd > now ? currentEnd : now;

  // Clone to avoid mutation issues
  const newExpiryDate = new Date(baseDate);

  // Add Time
  if (duration === '1_YEAR') {
    newExpiryDate.setFullYear(newExpiryDate.getFullYear() + 1);
  } else if (duration === '6_MONTHS') {
    newExpiryDate.setMonth(newExpiryDate.getMonth() + 6);
  } else if (duration === '3_MONTHS') {
    newExpiryDate.setMonth(newExpiryDate.getMonth() + 3);
  } else {
    newExpiryDate.setMonth(newExpiryDate.getMonth() + 1);
  }

  // 4. Update Database
  await prisma.dealerProfile.update({
    where: { userId: userId },
    data: {
      subscriptionStatus: 'ACTIVE',
      subscriptionTier: tier,
      subscriptionEnd: newExpiryDate,
      // isVerified: true,
    },
  });

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50'>
      <Card className='w-[400px] shadow-lg border-green-200'>
        <CardHeader>
          <div className='mx-auto bg-green-100 p-3 rounded-full mb-2'>
            <CheckCircle className='h-8 w-8 text-green-600' />
          </div>
          <CardTitle className='text-center text-green-700'>
            Payment Successful!
          </CardTitle>
        </CardHeader>
        <CardContent className='text-center'>
          <p className='mb-6 text-gray-600'>
            Your <strong>{tier}</strong> plan is now active until{' '}
            {newExpiryDate.toLocaleDateString()}.
          </p>
          <a
            href='/dashboard'
            className='inline-block px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 w-full'
          >
            Go to Dashboard
          </a>
        </CardContent>
      </Card>
    </div>
  );
}

function StatusCard({ error }: { error: string }) {
  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50'>
      <Card className='w-[400px] border-red-200'>
        <CardHeader>
          <div className='mx-auto bg-red-100 p-3 rounded-full mb-2'>
            <XCircle className='h-8 w-8 text-red-600' />
          </div>
          <CardTitle className='text-center text-red-700'>
            Payment Failed
          </CardTitle>
        </CardHeader>
        <CardContent className='text-center'>
          <p className='mb-4'>{error}</p>
          <a href='/subscribe' className='text-blue-600 underline'>
            Try Again
          </a>
        </CardContent>
      </Card>
    </div>
  );
}
