'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { newPassword } from '@/actions/new-password';
import {
  Loader2,
  CheckCircle,
  Lock,
  Clock,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

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
      setStatus('expired');
    } else if (data.error) {
      setMsg(data.error);
      setStatus('idle');
    } else {
      setMsg('Password has been reset!');
      setStatus('success');
      setTimeout(() => router.push('/login'), 2000);
    }
  };

  if (!token) {
    return (
      <div className='relative z-10 bg-red-900/80 backdrop-blur-md text-white p-6 rounded-xl border border-red-500/50 text-center max-w-sm'>
        <p className='font-bold mb-2'>Invalid Link</p>
        <p className='text-sm opacity-80'>
          No token found. Please check your email link again.
        </p>
      </div>
    );
  }

  return (
    <div className='relative z-10 w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-500'>
      {/* 1. VIEW: LINK EXPIRED */}
      {status === 'expired' && (
        <div className='p-8 text-center'>
          <div className='inline-flex items-center justify-center p-3 rounded-full mb-4 bg-orange-500/20 text-orange-400'>
            <Clock className='h-8 w-8' />
          </div>
          <h1 className='text-2xl font-bold text-white mb-2'>Link Expired</h1>
          <p className='text-orange-100/80 text-sm mb-8'>
            For security, password links are only valid for 15 minutes.
          </p>
          <Button
            onClick={() => router.push('/reset')}
            className='w-full h-12 bg-orange-500 hover:bg-orange-600 text-white font-bold shadow-lg'
          >
            Request New Link <ArrowRight className='ml-2 h-4 w-4' />
          </Button>
        </div>
      )}

      {/* 2. VIEW: SUCCESS */}
      {status === 'success' && (
        <div className='p-8 text-center'>
          <div className='inline-flex items-center justify-center p-3 rounded-full mb-4 bg-green-500/20 text-green-400'>
            <CheckCircle className='h-8 w-8' />
          </div>
          <h1 className='text-2xl font-bold text-white mb-2'>
            Password Reset!
          </h1>
          <p className='text-green-100/80 text-sm mb-6'>
            Your account is secure. Redirecting to login...
          </p>
          <div className='w-full bg-white/10 h-1 rounded-full overflow-hidden'>
            <div className='h-full bg-green-500 animate-[progress_2s_ease-out_forwards] w-full origin-left' />
          </div>
        </div>
      )}

      {/* 3. VIEW: FORM (Default) */}
      {(status === 'idle' || status === 'loading') && (
        <>
          <div className='p-8 pb-4 text-center'>
            <div className='inline-flex items-center justify-center p-3 rounded-full mb-4 bg-blue-500/20 text-blue-400'>
              <ShieldCheck className='h-8 w-8' />
            </div>
            <h1 className='text-3xl font-bold text-white mb-2 tracking-tight'>
              Set New Password
            </h1>
            <p className='text-blue-100 text-sm'>
              Create a strong password for your account.
            </p>
          </div>

          <div className='px-8 pb-8'>
            <form onSubmit={onSubmit} className='space-y-5'>
              <input type='hidden' name='token' value={token} />

              <div className='space-y-1'>
                <Label className='text-white/80 text-xs uppercase font-semibold ml-1'>
                  New Password
                </Label>
                <div className='relative'>
                  <Lock className='absolute left-3 top-3.5 h-5 w-5 text-white/50' />
                  <Input
                    name='password'
                    type='password'
                    placeholder='••••••••'
                    required
                    disabled={status === 'loading'}
                    className='pl-10 bg-black/20 border-white/10 text-white placeholder:text-white/30 h-12 rounded-lg focus-visible:ring-blue-400 focus-visible:border-blue-400 transition-all'
                  />
                </div>
              </div>

              {msg && (
                <div className='p-3 text-sm text-red-200 bg-red-900/40 border border-red-500/40 rounded-lg text-center backdrop-blur-sm animate-in fade-in'>
                  {msg}
                </div>
              )}

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
                    Resetting...{' '}
                  </>
                ) : (
                  'Reset Password'
                )}
              </Button>
            </form>
          </div>
        </>
      )}
    </div>
  );
}

export default function NewPasswordPage() {
  return (
    <div className='min-h-screen relative flex items-center justify-center p-4 overflow-hidden'>
      {/* BACKGROUND IMAGE */}
      <div className='absolute inset-0 z-0'>
        <Image
          src='/vs1.jpg'
          alt='Background'
          fill
          className='object-cover'
          priority
        />
        <div className='absolute inset-0 bg-gradient-to-br from-slate-900/95 via-slate-900/90 to-blue-900/60' />
      </div>

      <Suspense
        fallback={
          <Loader2 className='animate-spin h-10 w-10 text-white relative z-10' />
        }
      >
        <NewPasswordForm />
      </Suspense>
    </div>
  );
}
