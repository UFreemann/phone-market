// 'use client';

// import Link from 'next/link';
// import { usePathname } from 'next/navigation';
// import { Home, Grid, Heart, User } from 'lucide-react';
// import { useSession } from 'next-auth/react';

// export default function MobileNav() {
//   const pathname = usePathname();
//   const { data: session } = useSession();

//   // Hide on Dashboard/Admin pages (they have their own nav)
//   if (
//     pathname.startsWith('/dashboard') ||
//     pathname.startsWith('/admin') ||
//     pathname.startsWith('/profile/reel')
//   )
//     return null;

//   const links = [
//     { href: '/', icon: Home, label: 'Home' },
//     { href: '/category', icon: Grid, label: 'Category' },
//     { href: '/save', icon: Heart, label: 'Saved' },
//     // Logic: If logged in -> Profile. If guest -> Login.
//     {
//       href: session ? '/' : '/login',
//       icon: User,
//       label: session ? 'Account' : 'Login',
//     },
//   ];

//   return (
//     <div className='md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-50 pb-[env(safe-area-inset-bottom)]'>
//       <div className='flex justify-around items-center h-16'>
//         {links.map((link) => {
//           const isActive = pathname === link.href;
//           const Icon = link.icon;

//           return (
//             <Link
//               key={link.label}
//               href={link.href}
//               className={`relative flex flex-col items-center justify-center w-full h-full space-y-1 transition-all duration-300 ${
//                 isActive ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'
//               }`}
//             >
//               {/* Active Indicator Line */}
//               {isActive && (
//                 <span className='absolute top-0 w-8 h-1 bg-blue-600 rounded-b-full shadow-sm' />
//               )}

//               {/* Icon with subtle animation */}
//               <Icon
//                 size={24}
//                 className={`transition-transform duration-300 ${isActive ? 'scale-110' : ''}`}
//                 strokeWidth={isActive ? 2.5 : 2}
//                 fill={
//                   isActive && link.label === 'Saved' ? 'currentColor' : 'none'
//                 } // Fill heart if active
//               />

//               <span
//                 className={`text-[10px] font-medium tracking-tight ${isActive ? 'font-bold' : ''}`}
//               >
//                 {link.label}
//               </span>
//             </Link>
//           );
//         })}
//       </div>
//     </div>
//   );
// }

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Grid,
  Heart,
  User,
  LogOut,
  Store,
  PlayCircle,
  Settings,
  Sparkles,
} from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useState } from 'react';

export default function MobileNav() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);

  if (pathname.startsWith('/dashboard') || pathname.startsWith('/admin'))
    return null;

  // Base Links (Always links)
  const links = [
    { href: '/', icon: <Home size={22} />, label: 'Home' },
    { href: '/category', icon: <Grid size={22} />, label: 'Categories' },
    { href: '/save', icon: <Heart size={22} />, label: 'Saved' },
  ];

  return (
    <div className='md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 z-50 pb-safe'>
      <div className='flex justify-around items-center h-16'>
        {/* Render Base Links */}
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.label}
              href={link.href}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
                isActive ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {link.icon}
              <span className='text-[10px] font-medium'>{link.label}</span>
            </Link>
          );
        })}

        {/* 4th Button: Auth Logic */}
        {session ? (
          // LOGGED IN: Open a Menu Sheet (Stays on Homepage)
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button className='flex flex-col items-center justify-center w-full h-full space-y-1 text-gray-400 hover:text-gray-600 transition-colors'>
                <User size={22} />
                <span className='text-[10px] font-medium'>Account</span>
              </button>
            </SheetTrigger>
            <SheetContent side='bottom' className='rounded-t-2xl px-4 py-8'>
              <SheetHeader className='text-left mb-6'>
                <SheetTitle className='text-xl font-bold'>
                  {session.user.name || 'My Account'}
                </SheetTitle>
                <p className='text-sm text-gray-500'>{session.user.email}</p>
              </SheetHeader>

              <div className='space-y-2'>
                {session.user.role === 'DEALER' && (
                  <Link href='/dashboard' onClick={() => setOpen(false)}>
                    <Button
                      className='w-full justify-start bg-blue-50 text-blue-700 hover:bg-blue-100'
                      variant='ghost'
                      size='lg'
                    >
                      <Store className='mr-3 h-5 w-5' /> Dealer Dashboard
                    </Button>
                  </Link>
                )}
                <Link href='/profile/following' onClick={() => setOpen(false)}>
                  <Button
                    className='w-full justify-start'
                    variant='ghost'
                    size='lg'
                  >
                    <Store className='mr-3 h-5 w-5 text-gray-500' /> Shops I
                    Follow
                  </Button>
                </Link>
                <Link href='/save' onClick={() => setOpen(false)}>
                  <Button
                    className='w-full justify-start'
                    variant='ghost'
                    size='lg'
                  >
                    <Heart className='mr-3 h-5 w-5 text-gray-500' /> Bookmarks
                  </Button>
                </Link>
                <Link href='/profile/reels' onClick={() => setOpen(false)}>
                  <Button
                    className='w-full justify-start'
                    variant='ghost'
                    size='lg'
                  >
                    <PlayCircle className='mr-3 h-5 w-5 text-gray-500' /> Reels
                  </Button>
                </Link>
                <Link href='/feed' onClick={() => setOpen(false)}>
                  <Button
                    className='w-full justify-start'
                    variant='ghost'
                    size='lg'
                  >
                    <Sparkles className='mr-3 h-5 w-5 text-gray-500' /> For You
                  </Button>
                </Link>
                <Link href='/profile/settings' onClick={() => setOpen(false)}>
                  <Button
                    className='w-full justify-start'
                    variant='ghost'
                    size='lg'
                  >
                    <Settings className='mr-3 h-5 w-5 text-gray-500' /> Change
                    Password
                  </Button>
                </Link>
                <div className='pt-4 mt-2 border-t'>
                  <Button
                    onClick={async () => {
                      // The 'redirect: true' and 'callbackUrl' forces a clean reload
                      await signOut({ redirect: true, callbackUrl: '/' });
                    }}
                    className='w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700 cursor-pointer'
                    variant='ghost'
                    size='lg'
                  >
                    <LogOut className='mr-3 h-5 w-5' /> Sign Out
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        ) : (
          // NOT LOGGED IN: Go to Login Page
          <Link
            href='/login'
            className='flex flex-col items-center justify-center w-full h-full space-y-1 text-gray-400 hover:text-gray-600 transition-colors'
          >
            <User size={22} />
            <span className='text-[10px] font-medium'>Login</span>
          </Link>
        )}
      </div>
    </div>
  );
}
