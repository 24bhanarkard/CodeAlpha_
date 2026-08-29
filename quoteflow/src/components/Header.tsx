import React, { useState, useRef, useEffect } from 'react';
import { Moon, Sun, Heart, Command, Mountain, Trees, Sparkles, Layers, Image as ImageIcon } from 'lucide-react';
import { ThemeMode, BgMode } from '../types';

interface HeaderProps {
  theme: ThemeMode;
  onToggleTheme: () => void;
  onSetTheme: (theme: ThemeMode) => void;
  bgMode: BgMode;
  onSetBgMode: (mode: BgMode) => void;
  favoritesCount: number;
  onOpenFavorites: () => void;
  onOpenShortcuts: () => void;
  currentQuoteIndex: number;
  totalQuotes: number;
}

export const Header: React.FC<HeaderProps> = ({
  theme,
  onToggleTheme,
  onSetTheme,
  bgMode,
  onSetBgMode,
  favoritesCount,
  onOpenFavorites,
  onOpenShortcuts,
  currentQuoteIndex,
  totalQuotes
}) => {
  const [isBgMenuOpen, setIsBgMenuOpen] = useState(false);
  const bgMenuRef = useRef<HTMLDivElement | null>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (bgMenuRef.current && !bgMenuRef.current.contains(event.target as Node)) {
        setIsBgMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const bgOptions: { id: BgMode; label: string; icon: React.ReactNode; desc: string }[] = [
    {
      id: 'nature_mountain',
      label: 'Misty Mountains',
      icon: <Mountain className="w-4 h-4 text-amber-500" />,
      desc: 'Serene warm morning mist'
    },
    {
      id: 'nature_forest',
      label: 'Calm Forest',
      icon: <Trees className="w-4 h-4 text-emerald-500" />,
      desc: 'Gentle sunlit forest canopy'
    },
    {
      id: 'warm_gradient',
      label: 'Sunset Glow',
      icon: <Sparkles className="w-4 h-4 text-orange-500" />,
      desc: 'Radiant atmospheric gradient'
    },
    {
      id: 'minimal',
      label: 'Pure Minimal',
      icon: <Layers className="w-4 h-4 text-stone-500" />,
      desc: 'Soft ivory & obsidian canvas'
    }
  ];

  return (
    <header className="w-full bg-[#FFFBF5]/80 dark:bg-[#140E0C]/80 backdrop-blur-lg sticky top-0 z-30 transition-colors duration-300 border-b border-amber-200/50 dark:border-amber-950/60 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-18 sm:h-20 flex items-center justify-between">
        
        {/* Brand with Warm Sunset Gradient */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/25 text-white transition-transform hover:scale-105 select-none">
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-white fill-current" aria-hidden="true">
              <path d="M14.017 21L14.017 18C14.017 16.8954 13.1216 16 12.017 16H10.017C8.91243 16 8.017 16.8954 8.017 18V21M12.017 21H12.0171M21 11.4771C21 15.6569 17.6569 19.017 13.4771 19.017C12.3518 19.017 11.2721 18.775 10.2882 18.3411L3 21L5.65888 13.7118C5.22497 12.7279 4.98298 11.6482 4.98298 10.5229C4.98298 6.34315 8.32612 3 12.5059 3C16.6857 3 20.0288 6.34315 20.0288 10.5229C20.0288 10.8465 20.0191 11.1652 20 11.4771Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-stone-900 dark:text-stone-100">
              Quote<span className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 bg-clip-text text-transparent">Flow</span>
            </h1>
            <p className="text-[11px] font-medium text-stone-500 dark:text-stone-400 hidden sm:block">
              Daily inspiration & natural serenity
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2.5 sm:space-x-3.5">
          
          {/* Nature Background / Wallpaper Selector Dropdown */}
          <div className="relative" ref={bgMenuRef}>
            <button
              id="bg-selector-button"
              type="button"
              onClick={() => setIsBgMenuOpen(!isBgMenuOpen)}
              className="p-2 sm:px-3 sm:py-2 rounded-xl text-stone-700 dark:text-stone-300 hover:bg-amber-100/70 dark:hover:bg-stone-800 border border-amber-200/70 dark:border-stone-800 bg-white/70 dark:bg-stone-900/70 transition-all flex items-center gap-1.5 text-xs font-bold shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 cursor-pointer"
              aria-expanded={isBgMenuOpen}
              aria-label="Change Background Theme"
              title="Nature Background Wallpaper"
            >
              <ImageIcon className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span className="hidden md:inline">Wallpaper</span>
            </button>

            {isBgMenuOpen && (
              <div 
                className="absolute right-0 mt-2 w-64 p-2 bg-white dark:bg-stone-900 rounded-2xl shadow-xl border border-amber-200/80 dark:border-stone-800 z-50 animate-in fade-in zoom-in-95 duration-150"
                role="menu"
              >
                <div className="px-3 py-2 text-[11px] font-extrabold uppercase tracking-wider text-amber-900/70 dark:text-amber-300/80 border-b border-amber-100 dark:border-stone-800 mb-1">
                  Background Backdrop
                </div>
                <div className="space-y-1">
                  {bgOptions.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => {
                        onSetBgMode(opt.id);
                        setIsBgMenuOpen(false);
                      }}
                      className={`w-full p-2.5 rounded-xl text-left text-xs flex items-center gap-3 transition-colors cursor-pointer ${
                        bgMode === opt.id
                          ? 'bg-amber-100/80 dark:bg-amber-950/60 font-bold text-amber-900 dark:text-amber-200'
                          : 'hover:bg-amber-50 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 font-medium'
                      }`}
                      role="menuitem"
                    >
                      <div className="p-1.5 rounded-lg bg-white dark:bg-stone-800 shadow-2xs">
                        {opt.icon}
                      </div>
                      <div>
                        <div className="font-bold">{opt.label}</div>
                        <div className="text-[10px] text-stone-400 dark:text-stone-500">{opt.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Light / Dark Mode Switcher */}
          <div 
            className="flex items-center bg-amber-100/70 dark:bg-stone-900/90 p-1 rounded-full border border-amber-200/70 dark:border-amber-900/40 shadow-xs"
            role="group"
            aria-label="Theme switcher"
          >
            <button
              id="theme-light-button"
              type="button"
              onClick={() => onSetTheme('light')}
              className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                theme === 'light'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
              }`}
              aria-pressed={theme === 'light'}
            >
              <Sun className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Light</span>
            </button>
            <button
              id="theme-dark-button"
              type="button"
              onClick={() => onSetTheme('dark')}
              className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                theme === 'dark'
                  ? 'bg-gradient-to-r from-orange-600 to-rose-600 text-white shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
              }`}
              aria-pressed={theme === 'dark'}
            >
              <Moon className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Dark</span>
            </button>
          </div>

          <div className="hidden lg:block h-6 w-px bg-amber-200/60 dark:bg-stone-800"></div>

          {/* Keyboard Shortcuts Trigger */}
          <button
            id="shortcuts-button"
            type="button"
            onClick={onOpenShortcuts}
            className="hidden sm:flex p-2 sm:px-3 sm:py-2 rounded-xl text-stone-600 dark:text-stone-300 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-100/60 dark:hover:bg-stone-800/80 border border-transparent hover:border-amber-200/60 dark:hover:border-stone-700 transition-all items-center gap-1.5 text-xs font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 cursor-pointer"
            aria-label="Keyboard Shortcuts"
            title="Keyboard Shortcuts (?)"
          >
            <Command className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span className="font-semibold">Keys</span>
          </button>

          {/* Favorites Button */}
          <button
            id="favorites-drawer-button"
            type="button"
            onClick={onOpenFavorites}
            className="relative flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl bg-white dark:bg-stone-900 hover:bg-amber-50 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-200 border border-amber-200/80 dark:border-stone-700/80 transition-all font-bold text-xs sm:text-sm shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 cursor-pointer"
            aria-label={`Open favorites (${favoritesCount} saved)`}
            title="View Favorites (S)"
          >
            <Heart className={`w-4 h-4 ${favoritesCount > 0 ? 'fill-rose-500 text-rose-500' : 'text-stone-400 dark:text-stone-500'}`} />
            <span className="hidden sm:inline">Favorites</span>
            {favoritesCount > 0 && (
              <span className="px-1.5 py-0.5 text-xs font-bold rounded-md bg-gradient-to-r from-amber-500 to-rose-500 text-white min-w-5 text-center shadow-xs">
                {favoritesCount}
              </span>
            )}
          </button>

        </div>

      </div>
    </header>
  );
};
