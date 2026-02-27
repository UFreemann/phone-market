'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Smartphone,
  Settings,
  LogOut,
  MessageSquare,
  Menu,
  Zap,
  Users,
  BarChart3,
  Megaphone,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { CreditCard } from 'lucide-react';
import { handleSignOut } from '@/actions/signout';
import NotificationBell from '@/components/dealer/NotificationBell';
import { MdVerified } from 'react-icons/md';

type DealerShellProps = {
  children: React.ReactNode;
  dealer: {
    shopName: string;
    image: string | null;
    subscriptionTier: string;
    views: number;
    isVerified: boolean;
    subscriptionEnd: Date | null;
    idCardImage: string | null;

    _count?: {
      followers: number;
      leads: number;
    };
  };
};

export default function DealerShell({ children, dealer }: DealerShellProps) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const getTierColor = (tier: string) => {
    if (tier === 'PLATINUM')
      return 'bg-purple-100 text-purple-700 border-purple-200';
    if (tier === 'GOLD')
      return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    return 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const menuItems = [
    {
      href: '/dashboard',
      icon: <LayoutDashboard size={20} />,
      label: 'Overview',
    },
    {
      href: '/dashboard/inventory',
      icon: <Smartphone size={20} />,
      label: 'My Inventory',
    },
    {
      href: '/dashboard/ads',
      icon: <Megaphone size={20} />,
      label: 'Ad Manager',
    },
    {
      href: '/dashboard/followers',
      icon: <Users size={20} />,
      label: 'Followers',
    },
    {
      href: '/dashboard/leads',
      icon: <MessageSquare size={20} />,
      label: 'Leads',
    },
    {
      href: '/subscribe',
      icon: <CreditCard size={20} />,
      label: 'Billing & Plan',
    },
    {
      href: '/dashboard/analytics',
      icon: <BarChart3 size={20} />,
      label: 'Analytics',
    },

    {
      href: '/dashboard/settings',
      icon: <Settings size={20} />,
      label: 'Settings',
    },
  ];

  const renderVerifiedBadge = () => {
    if (!dealer.isVerified) return null;

    if (dealer.subscriptionTier === 'PLATINUM') {
      return (
        // <ShieldCheck className='h-4 w-4 text-purple-600 fill-purple-50 shrink-0' />
        <MdVerified className='h-4 w-4 text-purple-500' />
      );
    }

    if (dealer.subscriptionTier === 'GOLD') {
      return <MdVerified className='h-4 w-4 text-yellow-500' />;
    }
    return null;
    // ADD THIS for Free Users
    // if (dealer.subscriptionTier === 'FREE') {
    //   return (
    //     <BadgeCheck className='h-4 w-4 text-blue-500 fill-blue-50 shrink-0' />
    //   );
    // }
  };

  return (
    <div className='min-h-screen bg-gray-50 flex flex-col md:flex-row'>
      {/* ================= MOBILE HEADER ================= */}
      <div className='md:hidden h-16 bg-white border-b flex items-center justify-between px-3 sticky top-0 z-30 shadow-sm gap-2'>
        {/* 1. LEFT: Info */}
        <Link
          href='/dashboard/settings'
          className='flex items-center gap-2 min-w-0'
        >
          <div className='h-8 w-8 rounded-full bg-gray-100 border overflow-hidden shrink-0'>
            {dealer.image ? (
              <img
                src={dealer.image}
                alt='Logo'
                className='h-full w-full object-cover'
              />
            ) : (
              <div className='h-full w-full flex items-center justify-center bg-blue-100 text-blue-700 font-bold text-xs'>
                {dealer.shopName.charAt(0)}
              </div>
            )}
          </div>
          <div className='flex flex-col min-w-0'>
            <div className='flex items-center gap-1'>
              <span className='font-bold text-gray-800 text-sm truncate max-w-22.5 leading-tight'>
                {dealer.shopName}
              </span>
              {renderVerifiedBadge()}
            </div>
            <span
              className={`text-[10px] font-bold px-1 rounded w-fit mt-0.5 ${getTierColor(
                dealer.subscriptionTier,
              )}`}
            >
              {dealer.subscriptionTier}
            </span>
          </div>
        </Link>

        {/* 2. CENTER: Dashboard Icon */}
        <Link
          href='/dashboard'
          className={`p-2 rounded-full transition-colors ${
            pathname === '/dashboard'
              ? 'bg-blue-50 text-blue-600'
              : 'text-gray-500 hover:bg-gray-100'
          }`}
        >
          <LayoutDashboard size={20} />
        </Link>

        {/* 3. RIGHT: Actions */}
        <div className='flex items-center gap-1'>
          {/* NOTIFICATION BELL (Mobile) */}
          <NotificationBell
            endDate={dealer.subscriptionEnd}
            isVerified={dealer.isVerified}
            tier={dealer.subscriptionTier}
            hasID={!!dealer.idCardImage}
          />

          {/* Upgrade Button */}
          <Link href='/subscribe'>
            <Button
              size='sm'
              variant='outline'
              className='h-8 px-2 text-xs border-blue-200 text-blue-700 hover:bg-blue-50 cursor-pointer hidden sm:flex'
            >
              <Zap
                size={14}
                className='mr-1 h-4 w-4 text-blue-700 fill-blue-700'
              />
              Upgrade
            </Button>
            {/* Icon only for very small screens */}
            <Button
              size='icon'
              variant='ghost'
              className='h-8 w-8 sm:hidden text-blue-700'
            >
              <Zap size={18} />
            </Button>
          </Link>

          {/* Menu */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant='ghost' size='icon' className='h-9 w-9'>
                <Menu className='h-6 w-6 text-gray-700' />
              </Button>
            </SheetTrigger>
            <SheetContent
              side='right'
              className='w-[85%] sm:w-[320px] p-0 flex flex-col h-full max-h-screen'
            >
              <SheetHeader className='sr-only'>
                <SheetTitle>Mobile Navigation Menu</SheetTitle>
              </SheetHeader>

              {/* Header Profile */}
              <div className='p-6 bg-gradient-to-br from-blue-600 to-blue-800 text-white shrink-0'>
                <div className='flex items-center gap-3 mb-4'>
                  <div className='h-12 w-12 rounded-full bg-white/20 border-2 border-white/30 overflow-hidden backdrop-blur-sm'>
                    {dealer.image ? (
                      <img
                        src={dealer.image}
                        alt='Logo'
                        className='h-full w-full object-cover'
                      />
                    ) : (
                      <div className='h-full w-full flex items-center justify-center text-white font-bold text-lg'>
                        {dealer.shopName.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div>
                    <div className='flex items-center gap-1'>
                      <span className='font-bold text-lg leading-tight'>
                        {dealer.shopName}
                      </span>
                      {renderVerifiedBadge()}
                    </div>
                    <div className='flex items-center gap-2 mt-1'>
                      <Badge
                        variant='secondary'
                        className='bg-white/20 text-white hover:bg-white/30 border-none text-[10px]'
                      >
                        {dealer.subscriptionTier}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className='flex gap-0 pt-2 border-t border-white/20 mt-2'>
                  <Link
                    href='/dashboard/followers'
                    onClick={() => setIsMobileMenuOpen(false)}
                    className='flex-1 text-center hover:bg-white/10 rounded-lg py-2 transition-colors cursor-pointer'
                  >
                    <p className='text-xl font-bold'>
                      {dealer._count?.followers || 0}
                    </p>
                    <p className='text-xs opacity-70'>Followers</p>
                  </Link>
                  <Link
                    href='/dashboard/leads'
                    onClick={() => setIsMobileMenuOpen(false)}
                    className='flex-1 text-center border-l border-white/20 hover:bg-white/10 rounded-lg py-2 transition-colors cursor-pointer'
                  >
                    <p className='text-xl font-bold'>
                      {dealer._count?.leads || 0}
                    </p>
                    <p className='text-xs opacity-70'>Leads</p>
                  </Link>
                  <div className='flex-1 text-center border-l border-white/20 py-2'>
                    <p className='text-xl font-bold'>{dealer.views}</p>
                    <p className='text-xs opacity-70'>Profile Views</p>
                  </div>
                </div>
              </div>

              {/* Links */}
              <div className='flex-1 overflow-y-auto p-4'>
                <div className='space-y-1'>
                  {menuItems.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-colors ${isActive ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-gray-600 hover:bg-gray-100'}`}
                      >
                        {link.icon}
                        <span className='text-sm'>{link.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Sign Out */}
              <div className='p-4 border-t bg-gray-50 shrink-0 mb-safe'>
                {/* 'mb-safe' helps with iPhone home bar, or just use pb-6 */}
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
      </div>

      {/* ================= DESKTOP SIDEBAR ================= */}
      <aside className='hidden md:flex flex-col fixed h-full z-20 bg-white border-r shadow-sm w-64'>
        <div className='p-6 h-20 flex items-center border-b'>
          <span className='font-bold text-2xl text-blue-700'>Phone Market</span>
        </div>

        <nav className='flex-1 p-4 space-y-2 mt-2 overflow-y-auto no-scrollbar'>
          {menuItems.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive ? 'bg-blue-600 text-white shadow-md font-medium' : 'text-gray-600 hover:bg-blue-50 hover:text-blue-700'}`}
              >
                <div className='shrink-0'>{link.icon}</div>
                <span className='text-sm font-medium'>{link.label}</span>
                {isActive && (
                  <div className='absolute right-0 top-1/2 -translate-y-1/2 h-8 w-1 bg-blue-800 rounded-l-full' />
                )}
              </Link>
            );
          })}
        </nav>

        <div className='p-2 border-t bg-gray-50/50'>
          <div className='flex items-center gap-3 p-3 rounded-lg bg-white border shadow-sm mb-3'>
            <div className='h-10 w-10 rounded-full bg-gray-100 border shrink-0 overflow-hidden'>
              {dealer.image ? (
                <img
                  src={dealer.image}
                  alt='Logo'
                  className='h-full w-full object-cover'
                />
              ) : (
                <div className='h-full w-full flex items-center justify-center bg-blue-100 text-blue-700 font-bold'>
                  {dealer.shopName.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            <div className='overflow-hidden'>
              <div className='flex items-center gap-1.5 mb-0.5'>
                <p
                  className='text-sm font-bold truncate text-gray-900 max-w-[110px]'
                  title={dealer.shopName}
                >
                  {dealer.shopName}
                </p>
                {renderVerifiedBadge()}
              </div>
              <p className='text-xs text-gray-500 capitalize flex items-center gap-1'>
                <span
                  className={`h-1.5 w-1.5 rounded-full ${dealer.subscriptionTier === 'PLATINUM' ? 'bg-purple-500' : dealer.subscriptionTier === 'GOLD' ? 'bg-yellow-500' : 'bg-gray-400'}`}
                ></span>
                {dealer.subscriptionTier} Plan
              </p>
            </div>
          </div>

          {/* Actions: Bell, Upgrade, Sign Out */}
          <div className='flex items-center gap-2'>
            <Link href='/subscribe' className='flex-1'>
              <Button
                variant='outline'
                className='w-full h-9 px-2 text-xs border-blue-200 text-blue-700 hover:bg-blue-50 cursor-pointer'
              >
                <Zap size={14} className='mr-1.5' /> Upgrade
              </Button>
            </Link>

            <form action={handleSignOut} className='flex-1'>
              <Button
                variant='outline'
                className='w-full h-9 px-2 text-xs border-red-100 text-red-600 hover:bg-red-50 cursor-pointer'
                type='submit'
              >
                <LogOut size={14} className='mr-1.5' /> LogOut
              </Button>
            </form>
          </div>
        </div>
      </aside>

      <main className='flex-1 p-4 md:p-8 md:ml-64 transition-all duration-300'>
        {children}
      </main>
    </div>
  );
}
