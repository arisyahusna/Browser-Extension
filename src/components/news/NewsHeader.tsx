import React, { useState } from 'react';
import { Search, Clock } from 'lucide-react';
import { CATEGORIES } from '../../data/mockArticles';
import { useBrowser } from '../../context/BrowserContext';

interface NewsHeaderProps {
  currentCategory?: string;
}

export const NewsHeader: React.FC<NewsHeaderProps> = ({ currentCategory }) => {
  const { navigate } = useBrowser();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const handleCategoryClick = (cat: typeof CATEGORIES[0]) => {
    navigate({
      pathname: cat.path,
      title: cat.id === 'home' 
        ? 'Malaysia News Daily — Credible Malaysian News & Analysis'
        : `${cat.label} — Malaysia News Daily`,
      category: cat.id,
    });
  };

  const handleLogoClick = () => {
    navigate({
      pathname: '/',
      title: 'Malaysia News Daily — Credible Malaysian News & Analysis',
    });
  };

  return (
    <header className="border-b border-slate-200 bg-white sticky top-0 z-20 shadow-xs">
      {/* Top Utility Bar */}
      <div className="border-b border-slate-100 bg-[#FAFBFD] px-4 sm:px-8 py-1.5 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 font-medium text-slate-600">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              Wednesday, 11 November 2026
            </span>
            <span className="hidden sm:inline text-slate-300">|</span>
            <span className="hidden sm:inline text-slate-500">Kuala Lumpur • 31°C Fair</span>
            <span className="hidden md:inline text-slate-300">|</span>
            <span className="hidden md:inline text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px] font-medium border border-emerald-200">
              Edition: Peninsular & East Malaysia
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[11px] text-slate-400">Independent Editorial Simulation</span>
          </div>
        </div>
      </div>

      {/* Main Masthead Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-5 flex items-center justify-between">
        <div className="flex-1 hidden md:block">
          <p className="text-xs uppercase tracking-widest text-slate-400 font-semibold">
            Malaysia's Premier Digital Journal
          </p>
        </div>

        {/* Brand Logo / Masthead */}
        <div
          onClick={handleLogoClick}
          className="cursor-pointer text-center group flex flex-col items-center"
        >
          <div className="flex items-center justify-center gap-2">
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#0F172A] group-hover:text-slate-800 transition-colors">
              MALAYSIA NEWS DAILY
            </h1>
          </div>
          <div className="w-full flex items-center justify-center gap-3 mt-1 text-[11px] tracking-wider uppercase text-slate-500">
            <span>Accuracy</span>
            <span>•</span>
            <span>Perspective</span>
            <span>•</span>
            <span>Integrity</span>
          </div>
        </div>

        {/* Right utility buttons */}
        <div className="flex-1 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => setShowSearch((prev) => !prev)}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors flex items-center gap-1 text-xs"
            title="Search news"
          >
            <Search className="w-4 h-4" />
            <span className="hidden lg:inline font-medium">Search</span>
          </button>
        </div>
      </div>

      {/* Expandable Search Input */}
      {showSearch && (
        <div className="bg-slate-50 border-t border-b border-slate-200 px-4 py-2.5">
          <div className="max-w-3xl mx-auto flex items-center gap-2">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search news, topics, archived stories..."
              className="w-full bg-transparent text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
              autoFocus
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-xs text-slate-400 hover:text-slate-600"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      )}

      {/* Main Editorial Navigation */}
      <nav className="border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between overflow-x-auto no-scrollbar">
          <ul className="flex items-center space-x-1 sm:space-x-3 py-2 text-xs sm:text-sm font-semibold tracking-normal text-slate-700">
            {CATEGORIES.map((cat) => {
              const isActive =
                (cat.id === 'home' && (!currentCategory || currentCategory === 'home')) ||
                currentCategory === cat.id;

              return (
                <li key={cat.id} className="shrink-0">
                  <button
                    type="button"
                    onClick={() => handleCategoryClick(cat)}
                    className={`px-3 py-1.5 rounded-md transition-all duration-150 ${
                      isActive
                        ? 'bg-slate-900 text-white shadow-xs font-semibold'
                        : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100'
                    }`}
                  >
                    {cat.label}
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="hidden lg:flex items-center gap-3 text-xs text-slate-400 pl-4 border-l border-slate-200">
            <span className="inline-block w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            <span className="font-medium text-slate-600 uppercase tracking-wider text-[11px]">
              Live Fact-Checking Ready
            </span>
          </div>
        </div>
      </nav>
    </header>
  );
};
