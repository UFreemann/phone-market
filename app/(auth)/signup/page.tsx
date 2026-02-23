// 'use client';

// import { useState } from 'react';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from '@/components/ui/card';
// import { registerVisitor } from '@/actions/register-visitor';
// import { useSearchParams } from 'next/navigation';
// import Link from 'next/link';
// import { ArrowRight, Loader2, Mail, UserPlus } from 'lucide-react';
// import { useRouter } from 'next/navigation';

// export default function VisitorSignup() {
//   const router = useRouter();

//   const searchParams = useSearchParams();
//   const callbackUrl = searchParams.get('callbackUrl');
//   const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
//   const [errorMessage, setErrorMessage] = useState('');
//   const [submittedEmail, setSubmittedEmail] = useState(''); // Track the email for the success screen

//   async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
//     e.preventDefault();
//     setStatus('loading');
//     setErrorMessage('');

//     const formData = new FormData(e.currentTarget);
//     const email = formData.get('email') as string;
//     const res = await registerVisitor(formData);

//     if (res.error) {
//       setErrorMessage(res.error);
//       setStatus('idle');
//     } else {
//       setSubmittedEmail(email); // Save email to display it
//       setStatus('success');
//     }
//   }

//   return (
//     <div className='flex items-center justify-center min-h-screen bg-gray-50'>
//       <Card className='w-[400px] shadow-lg'>
//         <CardHeader>
//           <CardTitle className='text-2xl text-center'>
//             {status === 'success' ? 'Check your Inbox' : 'Join as a Visitor'}
//           </CardTitle>
//           <CardDescription className='text-center'>
//             {status === 'success'
//               ? 'We need to verify your identity before you can log in.'
//               : 'Create your account to start buying.'}
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           {/* SUCCESS STATE: "Check your Email" Instructions */}
//           {status === 'success' ? (
//             <div className='text-center py-6 space-y-6 animate-in fade-in duration-500'>
//               <div className='bg-blue-50 p-4 rounded-full w-20 h-20 mx-auto flex items-center justify-center'>
//                 <Mail className='h-10 w-10 text-blue-600' />
//               </div>

//               <div className='space-y-2'>
//                 <h3 className='font-semibold text-lg'>
//                   Verification Link Sent
//                 </h3>
//                 <p className='text-gray-500 text-sm'>
//                   We have sent a confirmation email to:
//                 </p>
//                 <p className='font-medium text-gray-900 bg-gray-100 py-1 px-3 rounded inline-block'>
//                   {submittedEmail}
//                 </p>
//               </div>

//               <div className='text-sm text-gray-500 border-t pt-4'>
//                 <p className='mb-4'>
//                   Click the link in that email to activate your account.
//                 </p>

//                 {/* Manual Navigation Button */}
//                 <Button
//                   onClick={() => router.push('/login')}
//                   variant='outline'
//                   className='w-full'
//                 >
//                   I have verified my email{' '}
//                   <ArrowRight className='ml-2 h-4 w-4' />
//                 </Button>
//               </div>
//             </div>
//           ) : (
//             <form onSubmit={onSubmit} className='space-y-4'>
//               <Input name='name' placeholder='Name' required />
//               <Input
//                 name='email'
//                 type='email'
//                 placeholder='visitor@example.com'
//                 required
//                 disabled={status !== 'idle'}
//               />
//               <Input
//                 name='password'
//                 type='password'
//                 placeholder='Password'
//                 required
//                 disabled={status !== 'idle'}
//               />

//               {errorMessage && (
//                 <div className='p-3 text-sm text-red-500 bg-red-50 rounded-md border border-red-200'>
//                   {errorMessage}
//                 </div>
//               )}
//               <Button
//                 type='submit'
//                 className='w-full'
//                 disabled={status !== 'idle'}
//               >
//                 {status === 'idle' && (
//                   <>
//                     <UserPlus className='ml-2 h-4 w-4' /> Sign up
//                   </>
//                 )}
//                 {status === 'loading' && (
//                   <>
//                     <Loader2 className='ml-2 h-4 w-4 animate-spin' />
//                     Signing up...{' '}
//                   </>
//                 )}
//               </Button>
//             </form>
//           )}

//           {status !== 'success' && (
//             <div className='text-center mt-4 text-sm'>
//               {/* <Link
//               href={
//                 callbackUrl ? `/login?callbackUrl=${callbackUrl}` : '/login'
//               }
//             >
//               Already have an account? Login
//             </Link> */}
//               Already have an account?{' '}
//               <a
//                 href={
//                   callbackUrl ? `/login?callbackUrl=${callbackUrl}` : '/login'
//                 }
//                 className='text-blue-600 hover:underline'
//               >
//                 Login
//               </a>
//             </div>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label'; // Add Label component if missing
import { registerVisitor } from '@/actions/register-visitor';
import {
  ArrowRight,
  Loader2,
  Mail,
  UserPlus,
  ShoppingBag,
  ArrowLeft,
} from 'lucide-react';

export default function VisitorSignup() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl');

  // UX States
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [submittedEmail, setSubmittedEmail] = useState('');

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;
    const res = await registerVisitor(formData);

    if (res.error) {
      setErrorMessage(res.error);
      setStatus('idle');
    } else {
      setSubmittedEmail(email);
      setStatus('success');
    }
  }

  return (
    <div className='min-h-screen relative flex items-center justify-center p-4 overflow-hidden'>
      {/* 1. BACKGROUND IMAGE */}
      <div className='absolute inset-0 z-0'>
        <Image
          src='/vs12.jpg'
          alt='Background'
          fill
          className='object-cover'
          priority
        />
        {/* Blue Gradient Overlay */}
        <div className='absolute inset-0 bg-gradient-to-br from-blue-900/95 via-indigo-900/90 to-purple-900/40' />
      </div>

      {/* 2. THE FROSTED CARD */}
      <div className='relative z-10 w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-500'>
        {/* HEADER */}
        <div className='p-8 pb-4 text-center'>
          <div
            className={`inline-flex items-center justify-center p-3 rounded-full mb-4 transition-colors ${status === 'success' ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'}`}
          >
            {status === 'success' ? (
              <Mail className='h-8 w-8' />
            ) : (
              <Link href='/'>
                <ShoppingBag className='h-8 w-8' />
              </Link>
            )}
          </div>

          <h1 className='text-3xl font-bold text-white mb-2 tracking-tight'>
            {status === 'success' ? 'Check your Inbox' : 'Join as a Buyer'}
          </h1>
          <p className='text-blue-100 text-sm'>
            {status === 'success'
              ? 'We need to verify your identity before you can log in.'
              : 'Create your account to start following shops and saving deals.'}
          </p>
        </div>

        <div className='px-8 pb-8'>
          {/* SUCCESS STATE */}
          {status === 'success' ? (
            <div className='space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500'>
              <div className='bg-white/5 border border-white/10 rounded-lg p-4 text-center'>
                <p className='text-blue-200 text-xs mb-1 uppercase tracking-wide font-semibold'>
                  Verification Sent To
                </p>
                <p className='text-white font-medium text-lg break-all'>
                  {submittedEmail}
                </p>
              </div>

              <div className='space-y-3'>
                <p className='text-blue-100 text-sm text-center'>
                  Click the link in the email to activate your account.
                </p>
                <Button
                  onClick={() => router.push('/login')}
                  variant='outline'
                  className='w-full h-12 bg-transparent text-white border-white/30 hover:bg-white/10 hover:text-white'
                >
                  I have verified my email{' '}
                  <ArrowRight className='ml-2 h-4 w-4' />
                </Button>
              </div>
            </div>
          ) : (
            /* FORM STATE */
            <form onSubmit={onSubmit} className='space-y-5'>
              {/* Name */}
              <div className='space-y-1'>
                <Label className='text-white/80 text-xs uppercase font-semibold ml-1'>
                  Full Name
                </Label>
                <Input
                  name='name'
                  placeholder='John Doe'
                  required
                  disabled={status !== 'idle'}
                  className='bg-black/20 border-white/10 text-white placeholder:text-white/30 h-11 rounded-lg focus-visible:ring-blue-400 focus-visible:border-blue-400'
                />
              </div>

              {/* Email */}
              <div className='space-y-1'>
                <Label className='text-white/80 text-xs uppercase font-semibold ml-1'>
                  Email Address
                </Label>
                <Input
                  name='email'
                  type='email'
                  placeholder='visitor@example.com'
                  required
                  disabled={status !== 'idle'}
                  className='bg-black/20 border-white/10 text-white placeholder:text-white/30 h-11 rounded-lg focus-visible:ring-blue-400 focus-visible:border-blue-400'
                />
              </div>

              {/* Password */}
              <div className='space-y-1'>
                <Label className='text-white/80 text-xs uppercase font-semibold ml-1'>
                  Password
                </Label>
                <Input
                  name='password'
                  type='password'
                  placeholder='••••••••'
                  required
                  disabled={status !== 'idle'}
                  className='bg-black/20 border-white/10 text-white placeholder:text-white/30 h-11 rounded-lg focus-visible:ring-blue-400 focus-visible:border-blue-400'
                />
              </div>

              {/* Error Message */}
              {errorMessage && (
                <div className='p-3 text-sm text-red-200 bg-red-900/40 border border-red-500/40 rounded-lg text-center backdrop-blur-sm'>
                  {errorMessage}
                </div>
              )}

              {/* Submit Button */}
              <Button
                type='submit'
                disabled={status !== 'idle'}
                className={`w-full h-12 text-base font-bold shadow-lg transition-all duration-300 ${
                  status === 'loading'
                    ? 'bg-blue-600/80 text-white'
                    : 'bg-white text-blue-900 hover:bg-blue-50'
                }`}
              >
                {status === 'idle' && (
                  <>
                    {' '}
                    <UserPlus className='ml-2 h-5 w-5' /> Create Account{' '}
                  </>
                )}
                {status === 'loading' && (
                  <>
                    {' '}
                    <Loader2 className='ml-2 h-5 w-5 animate-spin' /> Signing
                    up...{' '}
                  </>
                )}
              </Button>
            </form>
          )}

          {/* Footer Links */}
          {status !== 'success' && (
            <div className='mt-6 pt-6 border-t border-white/10 text-center text-sm text-blue-200/80'>
              Already have an account?{' '}
              <Link
                href={
                  callbackUrl ? `/login?callbackUrl=${callbackUrl}` : '/login'
                }
                className='text-white font-semibold hover:underline transition-colors'
              >
                Login here
              </Link>
            </div>
          )}
        </div>
      </div>

      <Link
        href='/join'
        className='absolute top-6 left-6 z-20 text-white/70 hover:text-white flex items-center gap-2 text-sm transition-colors'
      >
        <ArrowLeft size={16} /> Back to Gateway
      </Link>
    </div>
  );
}
