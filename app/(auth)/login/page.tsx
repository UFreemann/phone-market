// 'use client';

// import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
//   CardDescription,
// } from '@/components/ui/card';
// import { loginAction } from '@/actions/login'; // Import from the new file
// import { Loader2, CheckCircle, LogIn } from 'lucide-react';
// import { useSearchParams } from 'next/navigation';
// import { AlertCircle } from 'lucide-react'; // Icon
// import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
// import Link from 'next/link';

// export default function LoginPage() {
//   const router = useRouter();

//   const searchParams = useSearchParams();
//   const errorType = searchParams.get('error');
//   const isSessionExpired = errorType === 'session_expired';

//   // UI States
//   const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
//   const [errorMessage, setErrorMessage] = useState('');

//   async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
//     event.preventDefault(); // Stop standard form refresh
//     setStatus('loading');
//     setErrorMessage('');

//     const formData = new FormData(event.currentTarget);

//     // Call the server action
//     const result = await loginAction(formData);

//     if (result?.error) {
//       // Handle Failure
//       setErrorMessage(result.error);
//       setStatus('idle');
//     } else if (result?.success) {
//       // Handle Success
//       setStatus('success');

//       // Wait 1.5 seconds so the user can enjoy the "Success" checkmark
//       setTimeout(() => {
//         router.push('/dashboard');
//         router.refresh(); // Ensure the dashboard data reloads
//       }, 1500);
//     }
//   }

//   return (
//     <div className='flex items-center justify-center min-h-screen bg-gray-50'>
//       <Card className='w-[400px] shadow-lg'>
//         <CardHeader>
//           <CardTitle className='text-2xl text-center'>Welcome Back</CardTitle>
//           <CardDescription className='text-center'>
//             Get going to your dashboard.
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           {/* --- NEW: SESSION TIMEOUT ALERT --- */}
//           {isSessionExpired && (
//             <div className='mb-6 p-3 bg-orange-50 border border-orange-200 rounded-md flex items-start gap-3'>
//               <AlertCircle className='h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5' />
//               <div className='text-sm text-orange-800'>
//                 <p className='font-semibold'>Session Timed Out</p>
//                 <p>For your security, please sign in again.</p>
//               </div>
//             </div>
//           )}

//           <form onSubmit={onSubmit} className='space-y-4'>
//             <div className='space-y-2'>
//               <Label htmlFor='email'>Email Address</Label>
//               <Input
//                 id='email'
//                 name='email'
//                 type='email'
//                 required
//                 disabled={status !== 'idle'}
//               />
//             </div>

//             <div className='space-y-2'>
//               <Label htmlFor='password'>Password</Label>
//               <Input
//                 id='password'
//                 name='password'
//                 type='password'
//                 required
//                 disabled={status !== 'idle'}
//               />
//             </div>
//             <div className='text-right'>
//               <a
//                 href='/reset'
//                 className='text-sm text-blue-600 hover:underline'
//               >
//                 Forgot Password?
//               </a>
//             </div>

//             {/* Error Message Display */}
//             {errorMessage && (
//               <div className='p-3 text-sm text-red-500 bg-red-50 rounded-md border border-red-200'>
//                 {errorMessage}
//               </div>
//             )}

//             {/* The Smart Button */}
//             <Button
//               type='submit'
//               className={`w-full transition-all duration-300 ${
//                 status === 'success' ? 'bg-green-600 hover:bg-green-700' : ''
//               }`}
//               disabled={status !== 'idle'}
//             >
//               {status === 'idle' && (
//                 <>
//                   <LogIn className='ml-2 h-4 w-4' /> Sign in
//                 </>
//               )}

//               {status === 'loading' && (
//                 <>
//                   <Loader2 className='ml-2 h-4 w-4 animate-spin' />
//                   Signing in...
//                 </>
//               )}

//               {status === 'success' && (
//                 <>
//                   <CheckCircle className='ml-2 h-4 w-4' /> Sign in Successful
//                 </>
//               )}
//             </Button>
//           </form>

//           {/* <div className='mt-4 text-center text-sm'>
//             Don't have an account?{' '}
//             <a href='/register' className='text-blue-600 hover:underline'>
//               Register
//             </a>
//           </div> */}
//           <div className='mt-4 text-center text-sm'>
//             New here?{' '}
//             <Link href='/signup' className='text-blue-600 hover:underline'>
//               Create a Visitor Account
//             </Link>
//             <div className='mt-2 text-xs text-gray-500'>
//               Want to sell?{' '}
//               <Link href='/register' className='underline'>
//                 Become a Dealer
//               </Link>
//             </div>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { loginAction } from '@/actions/login';
import {
  Loader2,
  CheckCircle,
  LogIn,
  AlertCircle,
  ArrowLeft,
  Home,
} from 'lucide-react';
import Image from 'next/image';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const errorType = searchParams.get('error');
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const isSessionExpired = errorType === 'session_expired';

  // UI States
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    const formData = new FormData(event.currentTarget);

    // Pass callbackUrl logic here if needed, or handle in action
    // But currently actions/login.ts handles standard signin
    const result = await loginAction(formData);

    if (result?.error) {
      setErrorMessage(result.error);
      setStatus('idle');
    } else if (result?.success) {
      setStatus('success');
      setTimeout(() => {
        // 1. If going back to the exact same page, force a hard reload
        //    to ensure all Server Components (like Navbar) get the new session
        if (callbackUrl === window.location.pathname || callbackUrl === '/') {
          window.location.href = callbackUrl; // This forces a full browser reload
        } else {
          // 2. If navigating to a new route (like /dashboard), push is fine
          //    but we still call router.refresh() to bust the router cache.
          router.push(callbackUrl);
          router.refresh();
        }
      }, 1500);
    }
  }

  return (
    <div className='min-h-screen relative flex items-center justify-center p-4 overflow-hidden'>
      {/* 1. BACKGROUND IMAGE (Full Screen) */}
      <div className='absolute inset-0 z-0'>
        <Image
          src='/img4.jpg'
          alt='Background'
          fill
          className='object-cover'
          priority
        />
        {/* Dark Gradient Overlay */}
        <div className='absolute inset-0 bg-gradient-to-br from-slate-900/90 via-slate-900/80 to-blue-900/80' />
      </div>

      {/* 2. THE FROSTED CARD */}
      <div className='relative z-10 w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-500'>
        {/* Header */}
        <div className='p-8 pb-6 text-center'>
          <Link
            href='/'
            className='inline-flex items-center justify-center bg-white/20 p-3 rounded-full mb-4 hover:bg-white/30 transition-colors'
          >
            <Home className='h-6 w-6 text-white' />
          </Link>
          <h1 className='text-3xl font-bold text-white mb-2 tracking-tight'>
            Welcome Back
          </h1>
          <p className='text-blue-100 text-sm'>
            Enter your details to continue.
          </p>
        </div>

        <div className='px-8 pb-8'>
          {/* Session Expired Alert */}
          {isSessionExpired && (
            <div className='mb-6 p-3 bg-orange-500/20 border border-orange-400/30 rounded-lg flex items-start gap-3'>
              <AlertCircle className='h-5 w-5 text-orange-200 flex-shrink-0 mt-0.5' />
              <div className='text-sm text-orange-100'>
                <p className='font-semibold'>Session Timed Out</p>
                <p className='opacity-80 text-xs'>
                  For security, please sign in again.
                </p>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={onSubmit} className='space-y-5'>
            <div className='space-y-2'>
              <Label className='text-white/90 text-xs uppercase tracking-wider font-semibold ml-1'>
                Email Address
              </Label>
              <Input
                name='email'
                type='email'
                placeholder='name@example.com'
                required
                disabled={status !== 'idle'}
                // Custom Input Style for Dark Mode
                className='bg-black/20 border-white/10 text-white placeholder:text-white/40 h-12 rounded-lg focus-visible:ring-blue-400 focus-visible:border-blue-400 transition-all'
              />
            </div>

            <div className='space-y-2'>
              <div className='flex justify-between items-center ml-1'>
                <Label className='text-white/90 text-xs uppercase tracking-wider font-semibold'>
                  Password
                </Label>
                <Link
                  href='/reset'
                  className='text-xs text-blue-200 hover:text-white transition-colors'
                >
                  Forgot?
                </Link>
              </div>
              <Input
                name='password'
                type='password'
                placeholder='••••••••'
                required
                disabled={status !== 'idle'}
                className='bg-black/20 border-white/10 text-white placeholder:text-white/40 h-12 rounded-lg focus-visible:ring-blue-400 focus-visible:border-blue-400 transition-all'
              />
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className='p-3 text-sm text-red-200 bg-red-900/30 border border-red-500/30 rounded-lg text-center'>
                {errorMessage}
              </div>
            )}

            {/* Submit Button */}
            <Button
              type='submit'
              disabled={status !== 'idle'}
              className={`w-full h-12 text-base font-bold shadow-lg transition-all duration-300 ${
                status === 'success'
                  ? 'bg-green-500 hover:bg-green-600 text-white'
                  : 'bg-white text-blue-900 hover:bg-blue-50'
              }`}
            >
              {status === 'idle' && 'Sign In'}
              {status === 'loading' && (
                <>
                  <Loader2 className='mr-2 h-5 w-5 animate-spin' /> Signing
                  In...
                </>
              )}
              {status === 'success' && (
                <>
                  <CheckCircle className='mr-2 h-5 w-5' /> Success!
                </>
              )}
            </Button>
          </form>

          {/* Footer Links */}
          <div className='mt-8 pt-6 border-t border-white/10 text-center space-y-4'>
            <div className='text-sm text-blue-100'>
              New here?{' '}
              <Link
                href='/signup'
                className='text-white font-bold hover:underline'
              >
                Create Buyer Account
              </Link>
            </div>
            <div className='text-xs text-blue-200/60'>
              Want to sell?{' '}
              <Link
                href='/register'
                className='text-blue-200 hover:text-white hover:underline transition-colors'
              >
                Become a Dealer
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Optional: Back to Home floating link */}
      <Link
        href='/join'
        className='absolute top-6 left-6 z-20 text-white/70 hover:text-white flex items-center gap-2 text-sm transition-colors'
      >
        <ArrowLeft size={16} /> Back to Gateway
      </Link>
    </div>
  );
}
