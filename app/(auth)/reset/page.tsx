'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // 1. Import Router
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { resetPassword } from '@/actions/reset';
import { Loader2, Mail, CheckCircle } from 'lucide-react';

export default function ResetPage() {
  const router = useRouter(); // 2. Initialize Router
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [msg, setMsg] = useState('');

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');
    setMsg('');

    const formData = new FormData(e.currentTarget);
    const data = await resetPassword(formData);

    if (data.error) {
      setMsg(data.error);
      setStatus('idle');
    } else {
      setMsg('Reset email sent successfully!');
      setStatus('success');

      // 3. Redirect after 3 seconds
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    }
  };

  return (
    <div className='flex justify-center items-center min-h-screen bg-gray-50'>
      <Card className='w-100 shadow-lg'>
        <CardHeader>
          <CardTitle className='text-center'>Forgot Password?</CardTitle>
          <CardDescription className='text-center'>
            Enter your email to reset it.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {status === 'success' ? (
            <div className='flex flex-col items-center justify-center py-6 space-y-4 animate-in fade-in'>
              <div className='h-12 w-12 bg-green-100 rounded-full flex items-center justify-center'>
                <CheckCircle className='h-6 w-6 text-green-600' />
              </div>
              <div className='text-center'>
                <h3 className='font-semibold text-gray-900'>
                  Check your Inbox
                </h3>
                <p className='text-sm text-gray-500 mt-1'>
                  We have sent a password reset link to your email.
                </p>
              </div>
              <p className='text-xs text-gray-400 mt-4'>
                Redirecting to login in 3 seconds...
              </p>
            </div>
          ) : (
            <form onSubmit={onSubmit} className='space-y-4'>
              <div className='space-y-2'>
                <Input
                  name='email'
                  type='email'
                  placeholder='name@example.com'
                  required
                  disabled={status === 'loading'}
                />
              </div>

              {status === 'idle' && msg && (
                <div className='p-3 text-sm text-red-500 bg-red-50 rounded border border-red-200'>
                  {msg}
                </div>
              )}

              <Button
                type='submit'
                className='w-full'
                disabled={status === 'loading'}
              >
                {status === 'loading' ? (
                  <>
                    <Loader2 className='ml-2 h-4 w-4 animate-spin' /> Sending...
                  </>
                ) : (
                  <>
                    <Mail className='ml-2 h-4 w-4' /> Send Reset Email
                  </>
                )}
              </Button>

              <div className='text-center text-sm'>
                <a href='/login' className='text-gray-500 hover:text-gray-900'>
                  Back to Login
                </a>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
