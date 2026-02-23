'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X, Clock, TrendingUp, Sparkles } from 'lucide-react';
import { trackSearch } from '@/actions/track-search';
import { getTrendingSearches } from '@/actions/get-trending';
import { getSuggestions } from '@/actions/get-suggestions';
import { HighlightText } from '@/components/ui/HighlightText';

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [term, setTerm] = useState(searchParams.get('q') || '');
  const [history, setHistory] = useState<string[]>([]);
  const [trending, setTrending] = useState<{ term: string }[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const containerRef = useRef<HTMLFormElement>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  // 1. Load History & Trending on Mount
  useEffect(() => {
    // Local History
    const saved = localStorage.getItem('search_history');
    if (saved) setHistory(JSON.parse(saved));

    // Global Trending
    async function loadTrending() {
      const data = await getTrendingSearches();
      setTrending(data);
    }
    loadTrending();
  }, []);

  // 2. Hide Dropdown when clicking outside
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

  // Helper: Save to Local Storage
  const saveToHistory = (query: string) => {
    if (!query.trim()) return;
    const newHistory = [query, ...history.filter((h) => h !== query)].slice(
      0,
      5,
    );
    setHistory(newHistory);
    localStorage.setItem('search_history', JSON.stringify(newHistory));
  };

  // Helper: Remove item
  const removeFromHistory = (e: React.MouseEvent, item: string) => {
    e.stopPropagation();
    const newHistory = history.filter((h) => h !== item);
    setHistory(newHistory);
    localStorage.setItem('search_history', JSON.stringify(newHistory));
  };

  // Handle Typing
  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTerm(val);

    if (val.length > 2) {
      const results = await getSuggestions(val);
      setSuggestions(results);
      setShowHistory(true); // Keep dropdown open
    } else {
      setSuggestions([]);
    }
  };

  // 3. Handle Submit
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setShowHistory(false);
    if (term.trim()) {
      saveToHistory(term);
      trackSearch(term); // Track in DB
      router.push(`/?q=${encodeURIComponent(term)}`);
    } else {
      router.push('/');
    }
  };

  // 4. Handle Click on Dropdown Item
  const handleHistoryClick = (item: string) => {
    setTerm(item);
    saveToHistory(item);
    trackSearch(item); // Track in DB
    setShowHistory(false);
    router.push(`/?q=${encodeURIComponent(item)}`);
  };

  // 5. Handle Clear Button (X)
  const clearSearch = () => {
    setTerm('');
    router.push('/');
  };

  return (
    <form
      ref={containerRef}
      onSubmit={handleSearch}
      className='relative max-w-lg mx-auto z-50'
    >
      <div className='flex shadow-xl rounded-full overflow-hidden group relative bg-white'>
        <Input
          value={term}
          onChange={handleInputChange}
          // onChange={(e) => setTerm(e.target.value)}
          onFocus={() => setShowHistory(true)}
          placeholder='Search e.g. iPhone 13...'
          className='bg-transparent h-14 pl-6 pr-12 text-lg border-none rounded-none focus-visible:ring-0 text-gray-900 w-full'
        />

        {/* CLEAR BUTTON (X) */}
        {term && (
          <button
            type='button'
            onClick={clearSearch}
            className='absolute right-20 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 p-1'
            title='Clear Search'
          >
            <X className='h-5 w-5' />
          </button>
        )}

        {/* SUBMIT BUTTON (Search Icon) */}
        <Button
          type='submit'
          size='icon'
          className='h-14 w-16 bg-white text-blue-600 hover:bg-gray-100 rounded-none border-l z-10'
        >
          <Search className='h-6 w-6' />
        </Button>
      </div>

      {/* DROPDOWN MENU */}
      {showHistory &&
        (history.length > 0 ||
          trending.length > 0 ||
          suggestions.length > 0) && (
          <div className='absolute top-16 left-0 right-0 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-2'>
            {/* SECTION 0: LIVE SUGGESTIONS (Top Priority) */}
            {suggestions.length > 0 && (
              <>
                <div className='px-4 py-2 bg-blue-50 text-xs font-semibold text-blue-600 uppercase tracking-wider'>
                  Suggestions
                </div>
                <ul>
                  {suggestions.map((item) => (
                    <li key={item}>
                      <button
                        type='button'
                        onClick={() => handleHistoryClick(item)}
                        className='w-full text-left px-4 py-3 hover:bg-gray-100 flex items-center gap-3 text-gray-800 font-medium group transition-colors'
                      >
                        <Sparkles
                          size={16}
                          className='text-blue-400 group-hover:text-blue-600'
                        />

                        <HighlightText text={item} highlight={term} />
                      </button>
                    </li>
                  ))}
                </ul>
              </>
            )}
            {/* SECTION A: PERSONAL HISTORY */}
            {history.length > 0 && (
              <>
                <div className='px-4 py-2 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider flex justify-between items-center'>
                  <span>Recent</span>
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
                        className='w-full text-left px-4 py-3 hover:bg-gray-100 flex items-center justify-between group/item transition-colors cursor-pointer'
                      >
                        <div className='flex items-center gap-3 text-gray-700'>
                          <Clock size={16} className='text-gray-400' />
                          <span>{item}</span>
                        </div>
                        <span
                          onClick={(e) => removeFromHistory(e, item)}
                          className='p-1 text-gray-300 hover:text-red-500 opacity-0 group-hover/item:opacity-100 transition-opacity'
                          title='Remove'
                        >
                          <X size={16} />
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </>
            )}

            {/* SECTION B: GLOBAL TRENDING */}
            {trending.length > 0 && (
              <>
                <div className='px-4 py-2 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider border-t'>
                  Trending Now
                </div>
                <ul>
                  {trending.map((item) => (
                    <li key={item.term}>
                      <button
                        type='button'
                        onClick={() => handleHistoryClick(item.term)}
                        className='w-full text-left px-4 py-3 hover:bg-gray-100 flex items-center gap-3 text-blue-700 font-medium transition-colors cursor-pointer'
                      >
                        <TrendingUp size={16} />
                        <span>{item.term}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        )}
    </form>
  );
}
