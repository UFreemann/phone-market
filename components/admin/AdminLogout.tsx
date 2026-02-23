'use client';

import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react'; // Client-side signout

export default function AdminLogout() {
  const handleLogout = () => {
    // Force redirect to admin login
    signOut({ callbackUrl: '/admin/login' });
  };

  return (
    <Button
      onClick={handleLogout}
      className='bg-red-600 text-white hover:bg-red-700 shadow-sm transition-colors font-medium'
    >
      <LogOut className='mr-2 h-4 w-4' /> Sign Out
    </Button>
  );
}
