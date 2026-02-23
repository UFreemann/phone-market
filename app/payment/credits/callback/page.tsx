import prisma from '@/lib/db';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle } from 'lucide-react';

type Props = {
  searchParams: Promise<{ reference?: string }>;
};

export default async function CreditCallbackPage(props: Props) {
  const searchParams = await props.searchParams;
  const reference = searchParams.reference;

  if (!reference) return <StatusCard error='No reference found' />;

  // 1. Verify Transaction
  const verifyReq = await fetch(
    `https://api.paystack.co/transaction/verify/${reference}`,
    {
      headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` },
      cache: 'no-store',
    },
  );

  const verifyData = await verifyReq.json();

  if (!verifyData.status || verifyData.data.status !== 'success') {
    return <StatusCard error='Payment failed verification' />;
  }

  // 2. Get Metadata (This is where "quantity" lives)
  const { userId, quantity, type } = verifyData.data.metadata;

  if (type !== 'CREDIT_PURCHASE') {
    return <StatusCard error='Invalid transaction type' />;
  }

  // 3. Add Credits to Dealer
  await prisma.dealerProfile.update({
    where: { userId },
    data: { adCredits: { increment: Number(quantity) } },
  });

  // 4. Success UI
  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50'>
      <Card className='w-[400px] shadow-lg border-orange-200'>
        <CardHeader>
          <div className='mx-auto bg-orange-100 p-3 rounded-full mb-2'>
            <CheckCircle className='h-8 w-8 text-orange-600' />
          </div>
          <CardTitle className='text-center text-orange-700'>
            Top-Up Successful!
          </CardTitle>
        </CardHeader>
        <CardContent className='text-center'>
          <p className='mb-6 text-gray-600'>
            <strong>{quantity} Ad Credits</strong> have been added to your
            balance.
          </p>
          <a
            href='/dashboard/ads'
            className='inline-block px-6 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 w-full'
          >
            Go to Ad Manager
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
