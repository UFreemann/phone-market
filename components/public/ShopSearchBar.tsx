'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Search, X, Clock } from 'lucide-react';

export default function ShopSearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname(); // Get current shop URL base

  const [term, setTerm] = useState(searchParams.get('q') || '');
  const [history, setHistory] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const containerRef = useRef<HTMLFormElement>(null);

  // 1. Sync URL to Input
  useEffect(() => {
    setTerm(searchParams.get('q') || '');
  }, [searchParams]);

  // 2. Load Global History
  useEffect(() => {
    const saved = localStorage.getItem('search_history');
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  // 3. Click Outside Logic
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowHistory(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const saveToHistory = (query: string) => {
    if (!query.trim()) return;
    // Get fresh history just in case
    const current = JSON.parse(localStorage.getItem('search_history') || '[]');
    const newHistory = [
      query,
      ...current.filter((h: string) => h !== query),
    ].slice(0, 5);
    setHistory(newHistory);
    localStorage.setItem('search_history', JSON.stringify(newHistory));
  };

  const removeFromHistory = (e: React.MouseEvent, item: string) => {
    e.stopPropagation();
    const newHistory = history.filter((h) => h !== item);
    setHistory(newHistory);
    localStorage.setItem('search_history', JSON.stringify(newHistory));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setShowHistory(false);
    if (term.trim()) {
      saveToHistory(term);
      router.push(`${pathname}?q=${encodeURIComponent(term)}`);
    } else {
      router.push(pathname);
    }
  };

  const handleHistoryClick = (item: string) => {
    setTerm(item);
    saveToHistory(item); // Bump to top
    setShowHistory(false);
    router.push(`${pathname}?q=${encodeURIComponent(item)}`);
  };

  const clearSearch = () => {
    setTerm('');
    router.push(pathname);
  };

  return (
    <form
      ref={containerRef}
      onSubmit={handleSearch}
      className='relative w-full max-w-sm group z-20'
    >
      <div className='relative'>
        <Input
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          onFocus={() => setShowHistory(true)}
          placeholder='Search in this shop...'
          className='pl-10 pr-10 bg-white border-gray-300 focus-visible:ring-blue-500'
        />

        {/* Left Icon */}
        <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400' />

        {/* Clear Button */}
        {term && (
          <button
            type='button'
            onClick={clearSearch}
            className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 p-1 rounded-full hover:bg-gray-100 transition-colors'
          >
            <X className='h-4 w-4' />
          </button>
        )}
      </div>

      {/* DROPDOWN MENU */}
      {showHistory && history.length > 0 && (
        <div className='absolute top-12 left-0 right-0 bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-1'>
          <div className='px-3 py-2 bg-gray-50 text-[10px] font-bold text-gray-500 uppercase tracking-wider flex justify-between items-center'>
            <span>Recent Searches</span>
            <button
              type='button'
              onClick={() => {
                setHistory([]);
                localStorage.removeItem('search_history');
              }}
              className='text-red-500 hover:underline cursor-pointer'
            >
              Clear
            </button>
          </div>
          <ul>
            {history.map((item) => (
              <li key={item}>
                <button
                  type='button'
                  onClick={() => handleHistoryClick(item)}
                  className='w-full text-left px-4 py-2.5 hover:bg-blue-50 flex items-center justify-between group/item transition-colors text-sm text-gray-700'
                >
                  <div className='flex items-center gap-3'>
                    <Clock size={14} className='text-gray-400' />
                    <span>{item}</span>
                  </div>
                  <span
                    onClick={(e) => removeFromHistory(e, item)}
                    className='p-1 text-gray-300 hover:text-red-500 opacity-0 group-hover/item:opacity-100 transition-opacity'
                    title='Remove'
                  >
                    <X size={14} />
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </form>
  );
}
