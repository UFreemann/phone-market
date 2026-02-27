'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Megaphone,
  Images,
  Settings,
  LayoutTemplate,
  Menu,
  Ban,
  CreditCard,
  MousePointerClick,
  ShieldUser,
  BarChart3,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { useState } from 'react';
import AdminLogout from './AdminLogout';

export default function AdminShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const links = [
    { href: '/admin', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { href: '/admin/dealers', icon: <Users size={20} />, label: 'Dealers' },
    { href: '/admin/ads', icon: <Megaphone size={20} />, label: 'Ad Manager' },
    { href: '/admin/banners', icon: <Images size={20} />, label: 'Banners' },
    {
      href: '/admin/cta',
      icon: <MousePointerClick size={20} />,
      label: 'Homepage CTA',
    },
    {
      href: '/admin/layout-manager',
      icon: <LayoutTemplate size={20} />,
      label: 'Page Layout',
    },
    { href: '/admin/plans', icon: <CreditCard size={20} />, label: 'Plans' },
    {
      href: '/admin/analytics',
      icon: <BarChart3 size={20} />,
      label: 'Analytics',
    },
    {
      href: '/admin/settings',
      icon: <Settings size={20} />,
      label: 'Settings',
    },
  ];

  const NavContent = () => (
    <div className='space-y-1'>
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          onClick={() => setOpen(false)}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
            pathname === link.href
              ? 'bg-purple-100 text-purple-700'
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          {link.icon}
          {link.label}
        </Link>
      ))}
    </div>
  );

  return (
    <div className='min-h-screen bg-gray-100 flex'>
      {/* DESKTOP SIDEBAR */}
      <aside className='hidden md:flex flex-col w-64 bg-white border-r fixed h-full z-10'>
        <div className='p-6 border-b h-16 flex items-center'>
          <span className='font-bold text-xl text-purple-700 flex items-center gap-2'>
            <ShieldUser className='h-6 w-6' /> Admin
          </span>
        </div>
        <div className='p-4 flex-1'>
          <NavContent />
        </div>
        <div className='p-4 border-t'>
          <AdminLogout />
        </div>
      </aside>

      {/* MOBILE HEADER */}
      <div className='md:hidden fixed top-0 w-full bg-white border-b h-16 z-20 flex items-center justify-between px-4'>
        {/* 1. LEFT: Title */}
        <span className='font-bold text-lg text-purple-700'>Admin Panel</span>

        {/* 2. CENTER: Dashboard Home Icon */}
        <Link
          href='/admin'
          className={`p-2 rounded-full transition-colors ${
            pathname === '/admin'
              ? 'bg-purple-50 text-purple-600'
              : 'text-gray-500 hover:bg-gray-100'
          }`}
        >
          <LayoutDashboard size={22} />
        </Link>

        {/* 3. RIGHT: Menu */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant='ghost' size='icon'>
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent side='left' className='w-64 p-0 pt-10'>
            <SheetHeader className='sr-only'>
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>
            <div className='px-4'>
              <NavContent />
            </div>
            <div className='p-4 border-t mt-auto'>
              <AdminLogout />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* MAIN CONTENT */}
      <main className='flex-1 md:ml-64 pt-16 md:pt-0 p-8 overflow-y-auto h-screen'>
        {children}
      </main>
    </div>
  );
}
