import prisma from '@/lib/db';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle } from 'lucide-react';

// Update the type definition for Next.js 15 compatibility
type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function VerifyPage(props: Props) {
  // 1. Await the searchParams (Next.js 15 requirement)
  const searchParams = await props.searchParams;
  const token = searchParams.token as string;

  if (!token) {
    return <TokenError message='No token provided.' />;
  }

  // 2. Find user with this token
  const user = await prisma.user.findFirst({
    where: { verificationToken: token },
  });

  if (!user) {
    return (
      <TokenError message='This verification link is invalid or has expired.' />
    );
  }

  // 3. Activate the user
  await prisma.user.update({
    where: { id: user.id },
    data: {
      emailVerified: new Date(),
      verificationToken: null, // Remove token so it cannot be used twice
    },
  });

  return (
    <div className='flex h-screen items-center justify-center bg-gray-50'>
      <Card className='w-[400px] shadow-lg'>
        <CardHeader>
          <CardTitle className='text-green-600 flex gap-2 items-center justify-center'>
            <CheckCircle className='h-6 w-6' /> Email Verified!
          </CardTitle>
        </CardHeader>
        <CardContent className='text-center'>
          <p className='mb-6 text-gray-600'>
            Your account is now active and ready to use.
          </p>
          <a
            href='/login'
            className='inline-block px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors'
          >
            Go to Login
          </a>
        </CardContent>
      </Card>
    </div>
  );
}

// Helper component for error state
function TokenError({ message }: { message: string }) {
  return (
    <div className='flex h-screen items-center justify-center bg-gray-50'>
      <Card className='w-100 shadow-lg border-red-200'>
        <CardHeader>
          <CardTitle className='text-red-500 flex gap-2 items-center justify-center'>
            <XCircle className='h-6 w-6' /> Verification Failed
          </CardTitle>
        </CardHeader>
        <CardContent className='text-center text-gray-600'>
          {message}
        </CardContent>
      </Card>
    </div>
  );
}
