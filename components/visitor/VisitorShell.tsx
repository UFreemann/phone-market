'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User, Heart, Store, LogOut, Menu, Sparkles, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { handleSignOut } from '@/actions/signout';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { useState } from 'react';

export default function VisitorShell({
  children,
  userName,
}: {
  children: React.ReactNode;
  userName: string;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const links = [
    { href: '/profile', icon: <Store size={20} />, label: 'Following' },
    { href: '/save', icon: <Heart size={20} />, label: 'Saved Items' },
    { href: '/feed', icon: <Sparkles size={20} />, label: 'For You' },
  ];

  return (
    <div className='min-h-screen bg-gray-50 md:flex'>
      {/* DESKTOP SIDEBAR */}
      <aside className='hidden md:flex flex-col w-64 bg-white border-r fixed h-full z-10'>
        <div className='p-6 border-b h-16 flex items-center'>
          <Link
            href='/'
            className='font-bold text-xl text-blue-600 flex items-center gap-2'
          >
            <Home size={20} /> PhoneMarket
          </Link>
        </div>

        <div className='p-4 flex-1 space-y-1'>
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                pathname === link.href
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              {link.icon}
              {link.label}
            </Link>
          ))}
        </div>

        <div className='p-4 border-t'>
          <div className='flex items-center gap-3 px-2 mb-4'>
            <div className='h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600'>
              {userName.charAt(0)}
            </div>
            <div className='text-sm font-medium text-gray-700'>{userName}</div>
          </div>
          <form action={handleSignOut}>
            <Button
              variant='outline'
              className='w-full text-red-600 hover:bg-red-50 border-red-100'
            >
              <LogOut className='mr-2 h-4 w-4' /> Sign Out
            </Button>
          </form>
        </div>
      </aside>

      {/* MOBILE HEADER */}
      <div className='md:hidden sticky top-0 z-20 bg-white border-b px-4 h-14 flex items-center justify-between'>
        <Link href='/' className='font-bold text-lg text-blue-600'>
          PhoneMarket
        </Link>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant='ghost' size='icon'>
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent side='right'>
            <SheetHeader className='text-left mb-6'>
              <SheetTitle>My Account</SheetTitle>
            </SheetHeader>
            <div className='space-y-2'>
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium ${
                    pathname === link.href
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600'
                  }`}
                >
                  {link.icon}
                  {link.label}
                </Link>
              ))}
              <div className='pt-4 border-t mt-4'>
                <form action={handleSignOut}>
                  <Button variant='outline' className='w-full text-red-600'>
                    Sign Out
                  </Button>
                </form>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* MAIN CONTENT */}
      <main className='flex-1 md:ml-64 p-4 md:p-8'>{children}</main>
    </div>
  );
}
