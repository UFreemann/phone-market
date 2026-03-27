'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Search,
  LogOut,
  LayoutDashboard,
  User,
  Sparkles,
  PlayCircle,
} from 'lucide-react';
import { useSession, signOut } from 'next-auth/react'; // Install this if missing
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useState, useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { FaHeart, FaShoppingBag, FaStore } from 'react-icons/fa';

export default function Navbar() {
  const { data: session } = useSession();
  const [isScrolled, setIsScrolled] = useState(false);
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get('category'); // Get active category

  // Helper for Link Styles
  const getLinkClass = (cat: string) =>
    `hover:text-blue-600 transition-colors ${currentCategory === cat ? 'text-blue-600 font-bold border-b-2 border-blue-600' : ''}`;

  // Scroll effect for sticky navbar
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isVisitor = session?.user?.role === 'VISITOR';
  const isDealer = session?.user?.role === 'DEALER';
  const isAdmin = session?.user?.role === 'ADMIN';

  const pathname = usePathname();

  // Hide Navbar on Dealer Dashboard & Admin Panel
  if (
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/subscribe') ||
    pathname.startsWith('/shop') ||
    pathname.startsWith('/profile') ||
    pathname.startsWith('/feed') ||
    pathname.startsWith('/save')
  ) {
    return null;
  }

  return (
    <>
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 border-b ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-sm py-2'
            : 'bg-white py-5 border-transparent'
        }`}
      >
        <div className='max-w-7xl mx-auto px-4 flex items-center justify-between gap-4'>
          {/* 1. LOGO */}
          <Link href='/' className='flex items-center gap-2 group'>
            <div className='bg-blue-600 p-1.5 rounded-lg group-hover:scale-110 transition-transform'>
              <FaShoppingBag className='text-white h-5 w-5' />
            </div>
            <span className='text-xl font-bold text-blue-900 tracking-tight'>
              PhoneMarket
            </span>
          </Link>

          {/* 2. CENTER LINKS (Desktop) */}
          <div className='hidden md:flex items-center gap-6 text-sm font-medium text-gray-600'>
            <Link href='/category/phone' className={getLinkClass('PHONE')}>
              Phones
            </Link>
            <Link href='/category/laptop' className={getLinkClass('LAPTOP')}>
              Laptops
            </Link>
            {/* <Link
              href='/category/accessory'
              className={getLinkClass('ACCESSORY')}
            >
              Accessories
            </Link>
            <Link href='/category/tablet' className={getLinkClass('TABLET')}>
              Tablets
            </Link> */}
            <Link href='/category' className={getLinkClass('OTHERS')}>
              Others
            </Link>
          </div>

          {/* 3. RIGHT ACTIONS */}
          <div className='flex items-center gap-3'>
            {/* SEARCH ICON (Mobile Only) */}
            <Button variant='ghost' size='icon' className='md:hidden'>
              <Search className='h-5 w-5' />
            </Button>

            {/* AUTH LOGIC */}
            {session ? (
              // LOGGED IN
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant='ghost'
                    className='relative h-10 w-10 rounded-full'
                  >
                    <Avatar className='h-9 w-9 border'>
                      <AvatarImage src={session?.user?.image || ''} />
                      <AvatarFallback className='bg-blue-100 text-blue-700 font-bold'>
                        {session?.user?.name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className='w-56' align='end'>
                  <DropdownMenuLabel>
                    <div className='flex flex-col space-y-1'>
                      <p className='text-sm font-medium leading-none'>
                        {session?.user?.name}
                      </p>
                      <p className='text-xs leading-none text-muted-foreground'>
                        {session?.user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  {/* ADMIN: Only sees Panel */}
                  {isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link
                        href='/admin'
                        className='cursor-pointer text-purple-600'
                      >
                        <LayoutDashboard className='mr-2 h-4 w-4 text-purple-600' />{' '}
                        Admin Panel
                      </Link>
                    </DropdownMenuItem>
                  )}

                  {/* DEALER: Sees Dashboard + Buying Tools */}
                  {isDealer && (
                    <DropdownMenuItem asChild>
                      <Link
                        href='/dashboard'
                        className='cursor-pointer text-blue-600'
                      >
                        <LayoutDashboard className='mr-2 h-4 w-4 text-blue-600' />{' '}
                        Dealer Dashboard
                      </Link>
                    </DropdownMenuItem>
                  )}

                  {/* EVERYONE EXCEPT ADMIN: Sees Buying Tools */}
                  {!isAdmin && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link
                          href='/profile/following'
                          className='cursor-pointer'
                        >
                          <FaStore className='mr-2 h-4 w-4' /> Following
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href='/save' className='cursor-pointer'>
                          <FaHeart className='mr-2 h-4 w-4' /> Saved Items
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href='/profile/reels' className='cursor-pointer'>
                          <PlayCircle className='mr-2 h-4 w-4' /> Reels
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href='/feed' className='cursor-pointer'>
                          <Sparkles className='mr-2 h-4 w-4' /> For You
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}

                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className='text-red-600 cursor-pointer'
                    onClick={() => signOut()}
                  >
                    <LogOut className='mr-2 h-4 w-4 text-red-600' /> Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              // NOT LOGGED IN
              <div className='flex items-center gap-2'>
                <Link href='/join' target='_blank' className='hidden sm:block'>
                  <Button variant='ghost' className='text-gray-600'>
                    Login
                  </Button>
                </Link>
                <Link href='/register' target='_blank'>
                  <Button className='bg-blue-600 hover:bg-blue-700 shadow-sm'>
                    Sell Now
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* INVISIBLE SPACER (Takes up exact height of Nav) */}
      <div className='h-20' />
    </>
  );
}
