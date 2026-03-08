'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  FaFacebook,
  FaInstagram,
  FaShoppingBag,
  FaTwitter,
} from 'react-icons/fa';

export default function Footer() {
  const pathname = usePathname();

  // HIDE ON DASHBOARDS
  if (
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/profile') ||
    pathname.startsWith('/feed') ||
    pathname.startsWith('/profile')
  ) {
    return null;
  }

  return (
    <footer className='bg-slate-900 text-slate-300 py-12 mt-auto border-t border-slate-800'>
      <div className='max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8'>
        {/* Brand */}
        <div className='space-y-4'>
          <div className='flex items-center gap-2 text-white'>
            <FaShoppingBag className='h-6 w-6' />
            <span className='text-xl font-bold'>PhoneMarket</span>
          </div>
          <p className='text-sm text-slate-400 leading-relaxed'>
            The trusted marketplace for buying and selling phones. Verified
            dealers, safe transactions.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className='text-white font-bold mb-4'>Marketplace</h4>
          <ul className='space-y-2 text-sm'>
            <li>
              <Link
                href='/?category=PHONE#latest'
                className='hover:text-white transition'
              >
                Phones
              </Link>
            </li>
            <li>
              <Link
                href='/?category=LAPTOP#latest'
                className='hover:text-white transition'
              >
                Laptops
              </Link>
            </li>
            <li>
              <Link
                href='/?category=ACCESSORY#latest'
                className='hover:text-white transition'
              >
                Accessories
              </Link>
            </li>
          </ul>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className='text-white font-bold mb-4'>Quick Links</h4>
          <ul className='space-y-2 text-sm'>
            <li>
              <Link
                href='/#sponsored'
                className='hover:text-white transition scroll-smooth'
              >
                Sponsored Deals
              </Link>
            </li>
            <li>
              <Link
                href='/#featured'
                className='hover:text-white transition scroll-smooth'
              >
                Featured & Platinum
              </Link>
            </li>
            <li>
              <Link
                href='/#latest'
                className='hover:text-white transition scroll-smooth'
              >
                Latest Arrivals
              </Link>
            </li>
            <li>
              <Link href='/feed' className='hover:text-white transition'>
                For You
              </Link>
            </li>
          </ul>
        </div>

        {/* Account Related */}
        <div>
          <h4 className='text-white font-bold mb-4'>Accounts</h4>
          <ul className='space-y-2 text-sm'>
            <li>
              <Link
                href='/join'
                target='_blank'
                className='hover:text-white transition scroll-smooth'
              >
                Sign up
              </Link>
            </li>
            <li>
              <Link
                href='/login'
                target='_blank'
                className='hover:text-white transition scroll-smooth'
              >
                Login
              </Link>
            </li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 className='text-white font-bold mb-4'>Support</h4>
          <ul className='space-y-2 text-sm'>
            <li>
              <Link href='#' className='hover:text-white transition'>
                Safety Tips
              </Link>
            </li>
            <li>
              <Link href='/contact' className='hover:text-white transition'>
                Contact Us
              </Link>
            </li>
            <li>
              <Link href='#' className='hover:text-white transition'>
                Terms & Conditions
              </Link>
            </li>
          </ul>
        </div>

        {/* Socials */}
        <div>
          <h4 className='text-white font-bold mb-4'>Follow Us</h4>
          <div className='flex gap-4'>
            <SocialIcon icon={<FaFacebook size={20} />} />
            <SocialIcon icon={<FaTwitter size={20} />} />
            <SocialIcon icon={<FaInstagram size={20} />} />
          </div>
        </div>
      </div>

      <div className='max-w-7xl mx-auto px-4 mt-12 pt-8 border-t border-slate-800 text-center text-xs text-slate-500'>
        &copy; {new Date().getFullYear()} PhoneMarket. All rights reserved.
      </div>
    </footer>
  );
}

function SocialIcon({ icon }: { icon: React.ReactNode }) {
  return (
    <a
      href='#'
      className='bg-slate-800 p-2 rounded-full hover:bg-blue-600 hover:text-white transition-colors'
    >
      {icon}
    </a>
  );
}
