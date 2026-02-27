'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowUp } from 'lucide-react';
import { FaArrowUp, FaChevronUp } from 'react-icons/fa';
import { usePathname } from 'next/navigation';

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const pathname = usePathname();

  // Hide Navbar on Dealer Dashboard Settings Page
  if (pathname.startsWith('/dashboard/settings')) {
    return null;
  }

  if (!isVisible) return null;

  return (
    <Button
      onClick={scrollToTop}
      size='icon'
      className='fixed bottom-6 right-6 z-50 rounded-full h-12 w-12 bg-blue-600 hover:bg-blue-700 shadow-xl animate-in fade-in zoom-in duration-300'
      aria-label='Scroll to top'
    >
      <FaChevronUp className='h-6 w-6 text-white' />
    </Button>
  );
}
