'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { newPassword } from '@/actions/new-password';
import { Loader2, CheckCircle, Lock, Clock, ArrowRight } from 'lucide-react';

function NewPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const router = useRouter();

  const [status, setStatus] = useState<
    'idle' | 'loading' | 'success' | 'expired'
  >('idle');
  const [msg, setMsg] = useState('');

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');
    setMsg('');

    const formData = new FormData(e.currentTarget);
    const data = await newPassword(formData);

    if (data.error === 'EXPIRED') {
      // Handle Expired State specifically
      setStatus('expired');
    } else if (data.error) {
      // Handle generic errors (like database connection)
      setMsg(data.error);
      setStatus('idle');
    } else {
      // Success
      setMsg('Password has been reset!');
      setStatus('success');
      setTimeout(() => router.push('/login'), 2000);
    }
  };

  if (!token) {
    return (
      <div className='text-red-500 text-center'>Error: Missing Link Token</div>
    );
  }

  // 1. VIEW: LINK EXPIRED
  if (status === 'expired') {
    return (
      <Card className='w-100 shadow-lg border-orange-200'>
        <CardHeader>
          <div className='mx-auto bg-orange-100 p-3 rounded-full mb-2'>
            <Clock className='h-8 w-8 text-orange-600' />
          </div>
          <CardTitle className='text-center text-orange-700'>
            Link Expired
          </CardTitle>
          <CardDescription className='text-center'>
            For security, password links are only valid for 5 minutes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={() => router.push('/reset')}
            className='w-full bg-orange-600 hover:bg-orange-700'
          >
            Request New Link <ArrowRight className='ml-2 h-4 w-4' />
          </Button>
        </CardContent>
      </Card>
    );
  }

  // 2. VIEW: SUCCESS
  if (status === 'success') {
    return (
      <Card className='w-100 shadow-lg border-green-200'>
        <CardContent className='pt-10 pb-10'>
          <div className='flex flex-col items-center justify-center animate-in fade-in'>
            <CheckCircle className='h-16 w-16 text-green-600 mb-4' />
            <h3 className='text-xl font-bold text-gray-800'>Password Reset!</h3>
            <p className='text-gray-500 mt-2'>Redirecting to login...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // 3. VIEW: FORM (Default)
  return (
    <Card className='w-100 shadow-lg'>
      <CardHeader>
        <CardTitle className='text-center'>Set New Password</CardTitle>
        <CardDescription className='text-center'>
          Create a strong password for your account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className='space-y-4'>
          <input type='hidden' name='token' value={token} />

          <div className='space-y-2'>
            <div className='relative'>
              <Lock className='absolute left-3 top-3 h-4 w-4 text-gray-400' />
              <Input
                name='password'
                type='password'
                placeholder='New Password'
                className='pl-9'
                required
                disabled={status === 'loading'}
              />
            </div>
          </div>

          {msg && (
            <p className='text-sm text-red-500 bg-red-50 p-2 rounded border border-red-200'>
              {msg}
            </p>
          )}

          <Button
            type='submit'
            className='w-full'
            disabled={status === 'loading'}
          >
            {status === 'loading' ? (
              <>
                <Loader2 className='animate-spin' /> Resetting...
              </>
            ) : (
              'Reset Password'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export default function NewPasswordPage() {
  return (
    <div className='flex justify-center items-center min-h-screen bg-gray-50'>
      <Suspense
        fallback={<Loader2 className='animate-spin h-10 w-10 text-gray-400' />}
      >
        <NewPasswordForm />
      </Suspense>
    </div>
  );
}
