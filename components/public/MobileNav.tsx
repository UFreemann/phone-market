'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Grid, Heart, User } from 'lucide-react';
import { useSession } from 'next-auth/react';

export default function MobileNav() {
  const pathname = usePathname();
  const { data: session } = useSession();

  // Hide on Dashboard/Admin pages (they have their own nav)
  if (
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/profile/reel')
  )
    return null;

  const links = [
    { href: '/', icon: Home, label: 'Home' },
    { href: '/category', icon: Grid, label: 'Category' },
    { href: '/save', icon: Heart, label: 'Saved' },
    // Logic: If logged in -> Profile. If guest -> Login.
    {
      href: session ? '/profile' : '/login',
      icon: User,
      label: session ? 'Account' : 'Login',
    },
  ];

  return (
    <div className='md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-50 pb-[env(safe-area-inset-bottom)]'>
      <div className='flex justify-around items-center h-16'>
        {links.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;

          return (
            <Link
              key={link.label}
              href={link.href}
              className={`relative flex flex-col items-center justify-center w-full h-full space-y-1 transition-all duration-300 ${
                isActive ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {/* Active Indicator Line */}
              {isActive && (
                <span className='absolute top-0 w-8 h-1 bg-blue-600 rounded-b-full shadow-sm' />
              )}

              {/* Icon with subtle animation */}
              <Icon
                size={24}
                className={`transition-transform duration-300 ${isActive ? 'scale-110' : ''}`}
                strokeWidth={isActive ? 2.5 : 2}
                fill={
                  isActive && link.label === 'Saved' ? 'currentColor' : 'none'
                } // Fill heart if active
              />

              <span
                className={`text-[10px] font-medium tracking-tight ${isActive ? 'font-bold' : ''}`}
              >
                {link.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
