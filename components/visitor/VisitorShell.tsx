'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  User,
  Heart,
  Store,
  LogOut,
  Menu,
  Sparkles,
  Home,
  LayoutDashboard,
  PlayCircle,
  Settings,
} from 'lucide-react';
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
import { FaShoppingBag } from 'react-icons/fa';

export default function VisitorShell({
  children,
  userName,
  userEmail,
}: {
  children: React.ReactNode;
  userName: string;
  userEmail: string;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const links = [
    {
      href: '/profile',
      icon: <LayoutDashboard size={20} />,
      label: 'Overview',
    },
    {
      href: '/profile/following',
      icon: <Store size={20} />,
      label: 'Following',
    },
    { href: '/save', icon: <Heart size={20} />, label: 'Saved Items' },
    {
      href: '/profile/reels',
      icon: <PlayCircle size={20} />,
      label: 'Reels Feed',
    },
    { href: '/feed', icon: <Sparkles size={20} />, label: 'For You' },
    {
      href: '/profile/settings',
      icon: <Settings size={20} />,
      label: 'Settings',
    },
  ];

  return (
    <div className='min-h-screen bg-gray-50 md:flex'>
      {/* DESKTOP SIDEBAR */}
      <aside className='hidden md:flex flex-col w-64 bg-white border-r fixed h-full z-10'>
        {/* 1. HEADER (Fixed Height) */}
        <div className='p-6 border-b h-16 flex items-center shrink-0'>
          <Link href='/' className='flex items-center gap-2 group'>
            <div className='bg-blue-600 p-1.5 rounded-lg group-hover:scale-110 transition-transform'>
              <FaShoppingBag className='text-white h-5 w-5' />
            </div>
            <span className='text-xl font-bold text-blue-900 tracking-tight'>
              PhoneMarket
            </span>
          </Link>
        </div>

        {/* 2. LINKS (Takes remaining space, scrolls if needed) */}
        <div className='p-4 flex-1 overflow-y-auto no-scrollbar'>
          <div className='space-y-1'>
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
        </div>
        <div className='mt-12 p-4 flex-1 border-t bg-gray-50 shrink-0'>
          <div className='flex items-center gap-3 px-2 mb-4 overflow-hidden'>
            <div className='h-10 w-10 rounded-full bg-blue-100 flex-shrink-0 flex items-center justify-center font-bold text-blue-600'>
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className='min-w-0'>
              <p className='text-sm font-medium text-gray-900 truncate'>
                {userName}
              </p>
              <p className='text-xs text-gray-500 truncate'>{userEmail}</p>
            </div>
          </div>
          <form action={handleSignOut}>
            <Button
              variant='outline'
              className='w-full justify-start text-red-600 hover:bg-red-50 border-red-200'
            >
              <LogOut className='mr-2 h-4 w-4' /> Sign Out
            </Button>
          </form>
        </div>
      </aside>

      {/* MOBILE HEADER */}
      <div className='md:hidden sticky top-0 z-20 bg-white border-b px-4 h-16 flex items-center justify-between shadow-sm'>
        <Link href='/' className='flex items-center gap-2 group'>
          <div className='bg-blue-600 p-1.5 rounded-lg group-hover:scale-110 transition-transform'>
            <FaShoppingBag className='text-white h-5 w-5' />
          </div>
          <span className='text-xl font-bold text-blue-900 tracking-tight'>
            PhoneMarket
          </span>
        </Link>

        {/* 2. CENTER: Dashboard Home Icon (NEW) */}
        <Link
          href='/profile'
          className={`p-2 rounded-full transition-colors ${
            pathname === '/profile'
              ? 'bg-blue-50 text-blue-600'
              : 'text-gray-500 hover:bg-gray-100'
          }`}
        >
          <LayoutDashboard size={22} />
        </Link>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant='ghost' size='icon'>
              <Menu />
            </Button>
          </SheetTrigger>

          {/* FLEX LAYOUT FOR MOBILE SHEET */}
          <SheetContent
            side='right'
            className='w-[85%] sm:w-[300px] p-0 flex flex-col h-full max-h-screen'
          >
            <SheetHeader className='p-6 border-b text-left bg-gray-50 shrink-0'>
              {/* CHANGED: Display Email instead of "My Account" */}
              <SheetTitle className='text-sm font-medium text-gray-500 uppercase tracking-wider'>
                Account
              </SheetTitle>
              <div className='flex items-center gap-3 mt-2'>
                <div className='flex items-center gap-3 px-2 mb-4 overflow-hidden'>
                  <div className='h-10 w-10 rounded-full bg-blue-100 flex-shrink-0 flex items-center justify-center font-bold text-blue-600'>
                    {userName.charAt(0).toUpperCase()}
                  </div>
                  <div className='min-w-0'>
                    <p className='text-sm font-medium text-gray-900 truncate'>
                      {userName}
                    </p>
                    <p className='text-xs text-gray-500 truncate'>
                      {userEmail}
                    </p>
                  </div>
                </div>
              </div>
            </SheetHeader>

            {/* SCROLLABLE LINKS */}
            <div className='flex-1 overflow-y-auto p-4'>
              <div className='space-y-1'>
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      pathname === link.href
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {link.icon}
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* FIXED FOOTER */}
            <div className='p-4 border-t bg-gray-50 shrink-0 mb-safe'>
              <form action={handleSignOut}>
                <Button
                  variant='outline'
                  className='w-full text-red-600 border-red-200 hover:bg-red-50'
                >
                  <LogOut className='mr-2 h-4 w-4' /> Sign Out
                </Button>
              </form>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* MAIN CONTENT */}
      <main className='flex-1 md:ml-64 p-4 md:p-8'>{children}</main>
    </div>
  );
}
