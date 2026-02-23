// 'use client';

// import { useState } from 'react';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { changeAdminPassword } from '@/actions/admin-auth';
// import { toast } from 'sonner';
// import { Lock } from 'lucide-react';

// export default function AdminSettings() {
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setLoading(true);
//     const formData = new FormData(e.currentTarget);

//     const res = await changeAdminPassword(formData);

//     if (res.error) toast.error(res.error);
//     else {
//       toast.success('Password updated!');
//       (e.target as HTMLFormElement).reset();
//     }
//     setLoading(false);
//   };

//   return (
//     <div className='max-w-md bg-white p-6 rounded-lg border shadow-sm'>
//       <div className='flex items-center gap-2 mb-6 border-b pb-4'>
//         <div className='bg-red-100 p-2 rounded-full'>
//           <Lock className='h-5 w-5 text-red-600' />
//         </div>
//         <div>
//           <h3 className='font-bold text-lg'>Security</h3>
//           <p className='text-sm text-gray-500'>Update Master Password</p>
//         </div>
//       </div>

//       <form onSubmit={handleSubmit} className='space-y-4'>
//         <div className='space-y-2'>
//           <Label>Current Password</Label>
//           <Input name='currentPassword' type='password' required />
//         </div>
//         <div className='space-y-2'>
//           <Label>New Password</Label>
//           <Input name='newPassword' type='password' required />
//         </div>

//         <Button
//           type='submit'
//           disabled={loading}
//           className='w-full bg-red-600 hover:bg-red-700'
//         >
//           {loading ? 'Updating...' : 'Change Password'}
//         </Button>
//       </form>
//     </div>
//   );
// }

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { changeAdminPassword } from '@/actions/admin-auth';
import { toast } from 'sonner';
import { Lock, ShieldCheck, Loader2 } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';

export default function AdminSettings() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const res = await changeAdminPassword(formData);

    if (res.error) toast.error(res.error);
    else {
      toast.success('Security credentials updated.');
      (e.target as HTMLFormElement).reset();
    }
    setLoading(false);
  };

  return (
    <div className='max-w-2xl mx-auto py-10'>
      <Card className='shadow-lg border-red-100 overflow-hidden'>
        <div className='h-2 bg-red-600 w-full' />

        <CardHeader className='flex flex-row items-start gap-4 space-y-0 pb-6 border-b bg-red-50/30'>
          <div className='bg-red-100 p-3 rounded-full shrink-0 text-red-600 shadow-sm border border-red-200'>
            <ShieldCheck size={28} />
          </div>
          <div>
            <CardTitle className='text-xl font-bold text-gray-900'>
              Admin Security
            </CardTitle>
            <CardDescription className='text-gray-500 mt-1 leading-relaxed'>
              Update the master password for the administrative account. This
              change affects all admin sessions immediately.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className='p-8'>
          <form onSubmit={handleSubmit} className='space-y-6'>
            <div className='space-y-4'>
              <div className='space-y-2'>
                <Label className='text-gray-700 font-semibold'>
                  Current Password
                </Label>
                <div className='relative'>
                  <Lock className='absolute left-3 top-2.5 h-5 w-5 text-gray-400' />
                  <Input
                    name='currentPassword'
                    type='password'
                    required
                    placeholder='••••••••'
                    className='pl-10 h-11 bg-gray-50 focus:bg-white transition-colors'
                  />
                </div>
              </div>

              <div className='space-y-2'>
                <Label className='text-gray-700 font-semibold'>
                  New Password
                </Label>
                <div className='relative'>
                  <Lock className='absolute left-3 top-2.5 h-5 w-5 text-gray-400' />
                  <Input
                    name='newPassword'
                    type='password'
                    required
                    placeholder='••••••••'
                    className='pl-10 h-11 bg-gray-50 focus:bg-white transition-colors'
                  />
                </div>
                <p className='text-xs text-gray-500 ml-1'>
                  Must be at least 8 characters long.
                </p>
              </div>
            </div>

            <div className='pt-4 flex justify-end border-t mt-6'>
              <Button
                type='submit'
                disabled={loading}
                className='bg-red-600 hover:bg-red-700 shadow-md font-bold px-8 h-11'
              >
                {loading ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />{' '}
                    Updating...
                  </>
                ) : (
                  'Update Credentials'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
