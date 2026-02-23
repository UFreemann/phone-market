'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react'; // Use Client Side signIn for easier error handling here
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { ShieldAlert, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminLogin() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);

    // We use client-side signIn to handle the redirect logic manually
    const result = await signIn('credentials', {
      email: formData.get('email'),
      password: formData.get('password'),
      redirect: false, // Don't redirect automatically
    });

    if (result?.error) {
      toast.error('Invalid Admin Credentials');
      setLoading(false);
    } else {
      // SUCCESS: Force redirect to Admin Dashboard
      router.push('/admin');
      router.refresh();
    }
  }

  return (
    <div className='flex items-center justify-center min-h-screen bg-slate-900'>
      <Card className='w-[400px] border-slate-700 bg-slate-800 text-white'>
        <CardHeader>
          <div className='flex justify-center mb-4'>
            <div className='p-3 bg-red-500/20 rounded-full'>
              <ShieldAlert className='h-10 w-10 text-red-500' />
            </div>
          </div>
          <CardTitle className='text-2xl text-center'>Admin Portal</CardTitle>
          <CardDescription className='text-center text-slate-400'>
            Restricted Access. Staff Only.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className='space-y-4'>
            <div className='space-y-2'>
              <Label className='text-slate-300'>Admin Email</Label>
              <Input
                name='email'
                type='email'
                required
                className='bg-slate-900 border-slate-700 text-white'
              />
            </div>
            <div className='space-y-2'>
              <Label className='text-slate-300'>Password</Label>
              <Input
                name='password'
                type='password'
                required
                className='bg-slate-900 border-slate-700 text-white'
              />
            </div>
            <Button
              type='submit'
              className='w-full bg-red-600 hover:bg-red-700'
              disabled={loading}
            >
              {loading ? (
                <Loader2 className='animate-spin' />
              ) : (
                'Access Dashboard'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
