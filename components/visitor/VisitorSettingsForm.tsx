'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { changeUserPassword } from '@/actions/change-password'; // Generic Action
import { toast } from 'sonner';
import { Lock, ShieldCheck, Loader2 } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';

export default function VisitorSettingsForm() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const res = await changeUserPassword(formData);

    if (res.error) toast.error(res.error);
    else {
      toast.success('Password updated successfully.');
      (e.target as HTMLFormElement).reset();
    }
    setLoading(false);
  };

  return (
    <Card className='shadow-lg border-blue-100 overflow-hidden'>
      <div className='h-2 bg-blue-600 w-full' />

      <CardHeader className='flex flex-row items-start gap-4 space-y-0 pb-6 border-b bg-blue-50/30'>
        <div className='bg-blue-100 p-3 rounded-full shrink-0 text-blue-600 shadow-sm border border-blue-200'>
          <ShieldCheck size={28} />
        </div>
        <div>
          <CardTitle className='text-xl font-bold text-gray-900'>
            Security
          </CardTitle>
          <CardDescription className='text-gray-500 mt-1 leading-relaxed'>
            Update your password to keep your account safe.
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className='p-8'>
        <form onSubmit={handleSubmit} className='space-y-6'>
          <div className='space-y-4'>
            <div className='space-y-2'>
              <Label>Current Password</Label>
              <div className='relative'>
                <Lock className='absolute left-3 top-2.5 h-5 w-5 text-gray-400' />
                <Input
                  name='currentPassword'
                  type='password'
                  required
                  className='pl-10'
                />
              </div>
            </div>
            <div className='space-y-2'>
              <Label>New Password</Label>
              <div className='relative'>
                <Lock className='absolute left-3 top-2.5 h-5 w-5 text-gray-400' />
                <Input
                  name='newPassword'
                  type='password'
                  required
                  className='pl-10'
                />
              </div>
            </div>
          </div>
          <div className='pt-4 flex justify-end border-t mt-6'>
            <Button
              type='submit'
              disabled={loading}
              className='bg-blue-600 hover:bg-blue-700'
            >
              {loading ? (
                <Loader2 className='animate-spin mr-2' />
              ) : (
                'Update Password'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
