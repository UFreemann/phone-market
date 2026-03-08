'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { resetPassword } from '@/actions/reset';
import { Loader2, Mail, CheckCircle, ArrowLeft, KeyRound } from 'lucide-react';

export default function ResetPage() {
  const router = useRouter();
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
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    }
  };

  return (
    <div className='min-h-screen relative flex items-center justify-center p-4 overflow-hidden'>
      {/* 1. BACKGROUND IMAGE */}
      <div className='absolute inset-0 z-0'>
        <Image
          src='/vs1.jpg'
          alt='Background'
          fill
          className='object-cover'
          priority
        />
        {/* Dark Overlay */}
        <div className='absolute inset-0 bg-gradient-to-br from-slate-900/95 via-slate-900/90 to-blue-900/60' />
      </div>

      {/* 2. THE FROSTED CARD */}
      <div className='relative z-10 w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-500'>
        {/* HEADER */}
        <div className='p-8 pb-4 text-center'>
          <div
            className={`inline-flex items-center justify-center p-3 rounded-full mb-4 transition-colors ${status === 'success' ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'}`}
          >
            {status === 'success' ? (
              <CheckCircle className='h-8 w-8' />
            ) : (
              <KeyRound className='h-8 w-8' />
            )}
          </div>

          <h1 className='text-3xl font-bold text-white mb-2 tracking-tight'>
            {status === 'success' ? 'Check your Inbox' : 'Forgot Password?'}
          </h1>
          <p className='text-blue-100 text-sm'>
            {status === 'success'
              ? 'We sent a reset link to your email.'
              : 'Enter your email to reset your password.'}
          </p>
        </div>

        <div className='px-8 pb-8'>
          {/* SUCCESS STATE */}
          {status === 'success' ? (
            <div className='space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 text-center'>
              <p className='text-slate-300 text-sm'>
                Redirecting to login in 3 seconds...
              </p>
              <div className='w-full bg-white/10 h-1 rounded-full overflow-hidden'>
                <div className='h-full bg-green-500 animate-[progress_3s_ease-out_forwards] w-full origin-left' />
              </div>
              <Button
                onClick={() => router.push('/login')}
                variant='outline'
                className='w-full h-12 bg-transparent text-white border-white/30 hover:bg-white/10 hover:text-white'
              >
                Back to Login
              </Button>
            </div>
          ) : (
            /* FORM STATE */
            <form onSubmit={onSubmit} className='space-y-5'>
              <div className='space-y-1'>
                <Label className='text-white/80 text-xs uppercase font-semibold ml-1'>
                  Email Address
                </Label>
                <Input
                  name='email'
                  type='email'
                  placeholder='name@example.com'
                  required
                  disabled={status === 'loading'}
                  className='bg-black/20 border-white/10 text-white placeholder:text-white/30 h-12 rounded-lg focus-visible:ring-blue-400 focus-visible:border-blue-400 transition-all'
                />
              </div>

              {/* Error Message */}
              {msg && (
                <div className='p-3 text-sm text-red-200 bg-red-900/40 border border-red-500/40 rounded-lg text-center backdrop-blur-sm animate-in fade-in'>
                  {msg}
                </div>
              )}

              {/* Submit Button */}
              <Button
                type='submit'
                disabled={status === 'loading'}
                className={`w-full h-12 text-base font-bold shadow-lg transition-all duration-300 ${
                  status === 'loading'
                    ? 'bg-blue-600/80 text-white'
                    : 'bg-white text-blue-900 hover:bg-blue-50'
                }`}
              >
                {status === 'loading' ? (
                  <>
                    {' '}
                    <Loader2 className='ml-2 h-5 w-5 animate-spin' />{' '}
                    Sending...{' '}
                  </>
                ) : (
                  <>
                    {' '}
                    <Mail className='ml-2 h-5 w-5' /> Send Reset Link{' '}
                  </>
                )}
              </Button>
            </form>
          )}

          {/* Footer Links */}
          {status !== 'success' && (
            <div className='mt-6 pt-6 border-t border-white/10 text-center text-sm text-slate-400'>
              Remember your password?{' '}
              <Link
                href='/login'
                className='text-blue-300 hover:text-white font-semibold hover:underline transition-colors'
              >
                Login here
              </Link>
            </div>
          )}
        </div>
      </div>

      <Link
        href='/'
        className='absolute top-6 left-6 z-20 text-white/70 hover:text-white flex items-center gap-2 text-sm transition-colors'
      >
        <ArrowLeft size={16} /> Back to Home
      </Link>
    </div>
  );
}
