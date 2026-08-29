import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Header } from './components/Header';
import { QuoteCard } from './components/QuoteCard';
import { QuoteActions } from './components/QuoteActions';
import { FavoritesDrawer } from './components/FavoritesDrawer';
import { KeyboardShortcutsModal } from './components/KeyboardShortcutsModal';
import { ShareModal } from './components/ShareModal';
import { Toast } from './components/Toast';
import { QUOTES, CategoryName } from './data/quotes';
import { Quote, ThemeMode, BgMode, ToastInfo } from './types';
import { ArrowLeft, ArrowRight, Heart, X, Sparkles, Image as ImageIcon } from 'lucide-react';

const FAVORITES_STORAGE_KEY = 'quoteflow_favorites_v1';
const THEME_STORAGE_KEY = 'quoteflow_theme_v1';
const BG_STORAGE_KEY = 'quoteflow_bg_mode_v1';

const NATURE_MOUNTAIN_IMG = '/src/assets/images/serene_nature_bg_1787994922188.jpg';
const NATURE_FOREST_IMG = '/src/assets/images/calm_forest_bg_1787994944231.jpg';

export default function App() {
  // Initialize theme from localStorage or system preference
  const [theme, setTheme] = useState<ThemeMode>(() => {
    try {
      const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode | null;
      if (savedTheme === 'dark' || savedTheme === 'light') return savedTheme;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } catch {
      return 'light';
    }
  });

  // Background Mode state
  const [bgMode, setBgMode] = useState<BgMode>(() => {
    try {
      const saved = localStorage.getItem(BG_STORAGE_KEY) as BgMode | null;
      if (saved && ['nature_mountain', 'nature_forest', 'warm_gradient', 'minimal'].includes(saved)) {
        return saved;
      }
    } catch {
      // Fallback
    }
    return 'nature_mountain';
  });

  // Apply theme class to document root and sync
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // Storage unavailable
    }
  }, [theme]);

  // Sync background mode to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(BG_STORAGE_KEY, bgMode);
    } catch {
      // Storage unavailable
    }
  }, [bgMode]);

  const toggleTheme = useCallback(() => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  const handleSetTheme = useCallback((newTheme: ThemeMode) => {
    setTheme(newTheme);
  }, []);

  // Favorites state
  const [favorites, setFavorites] = useState<Quote[]>(() => {
    try {
      const saved = localStorage.getItem(FAVORITES_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // Fallback
    }
    return [];
  });

  // Save favorites to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
    } catch {
      // Storage unavailable
    }
  }, [favorites]);

  // Selected Category filter
  const [selectedCategory, setSelectedCategory] = useState<CategoryName>('All');

  // Filtered quotes based on selected category
  const filteredQuotes = useMemo(() => {
    if (selectedCategory === 'All') return QUOTES;
    return QUOTES.filter(q => q.category === selectedCategory);
  }, [selectedCategory]);

  // Current quote state & history for navigation
  const [currentQuote, setCurrentQuote] = useState<Quote>(() => {
    const randomIndex = Math.floor(Math.random() * QUOTES.length);
    return QUOTES[randomIndex];
  });

  const [history, setHistory] = useState<Quote[]>([currentQuote]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);
  const [viewCount, setViewCount] = useState<number>(1);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  // UI Modals state
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [toast, setToast] = useState<ToastInfo | null>(null);

  // Trigger Toast helper
  const showToast = useCallback((message: string, type: 'success' | 'info' = 'success') => {
    const newToast: ToastInfo = {
      id: `${Date.now()}-${Math.random()}`,
      message,
      type
    };
    setToast(newToast);
    setTimeout(() => {
      setToast(current => (current?.id === newToast.id ? null : current));
    }, 2400);
  }, []);

  // Generate a new random quote (never repeating the current one if > 1 available)
  const generateNewQuote = useCallback(() => {
    setIsGenerating(true);

    const pool = filteredQuotes.length > 0 ? filteredQuotes : QUOTES;
    
    // Filter out current quote if possible to avoid immediate repeats
    let candidates = pool.filter(q => q.id !== currentQuote.id);
    if (candidates.length === 0) candidates = pool;

    const randomIndex = Math.floor(Math.random() * candidates.length);
    const nextQuote = candidates[randomIndex];

    setCurrentQuote(nextQuote);
    setHistory(prev => [...prev.slice(0, historyIndex + 1), nextQuote]);
    setHistoryIndex(prev => prev + 1);
    setViewCount(prev => prev + 1);

    setTimeout(() => setIsGenerating(false), 220);
  }, [filteredQuotes, currentQuote.id, historyIndex]);

  // Navigate to previous quote from history
  const handlePreviousQuote = useCallback(() => {
    if (historyIndex > 0) {
      const prevIndex = historyIndex - 1;
      setHistoryIndex(prevIndex);
      setCurrentQuote(history[prevIndex]);
    }
  }, [historyIndex, history]);

  // Navigate to next quote from history
  const handleNextQuote = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const nextIndex = historyIndex + 1;
      setHistoryIndex(nextIndex);
      setCurrentQuote(history[nextIndex]);
    } else {
      generateNewQuote();
    }
  }, [historyIndex, history, generateNewQuote]);

  // Check if current quote is favorited
  const isCurrentFavorite = useMemo(() => {
    return favorites.some(fav => fav.id === currentQuote.id);
  }, [favorites, currentQuote.id]);

  // Toggle favorite for current quote
  const toggleFavorite = useCallback(() => {
    if (isCurrentFavorite) {
      setFavorites(prev => prev.filter(fav => fav.id !== currentQuote.id));
      showToast('Removed from favorites', 'info');
    } else {
      setFavorites(prev => [currentQuote, ...prev]);
      showToast('Added to your favorite quotes!', 'success');
    }
  }, [isCurrentFavorite, currentQuote, showToast]);

  // Remove specific favorite
  const removeFavorite = useCallback((quoteId: string) => {
    setFavorites(prev => prev.filter(fav => fav.id !== quoteId));
    showToast('Quote removed from favorites', 'info');
  }, [showToast]);

  // Clear all favorites
  const clearAllFavorites = useCallback(() => {
    if (favorites.length === 0) return;
    if (window.confirm('Are you sure you want to clear all saved favorite quotes?')) {
      setFavorites([]);
      showToast('All favorites cleared', 'info');
    }
  }, [favorites.length, showToast]);

  // Copy quote text and author to clipboard
  const copyQuoteToClipboard = useCallback((quoteToCopy: Quote = currentQuote) => {
    const formatted = `"${quoteToCopy.text}"\n— ${quoteToCopy.author}`;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(formatted).then(() => {
        showToast('Quote copied to clipboard!');
      }).catch(() => {
        try {
          const textarea = document.createElement('textarea');
          textarea.value = formatted;
          document.body.appendChild(textarea);
          textarea.select();
          document.execCommand('copy');
          document.body.removeChild(textarea);
          showToast('Quote copied to clipboard!');
        } catch {
          showToast('Unable to copy quote', 'info');
        }
      });
    } else {
      showToast('Clipboard not supported', 'info');
    }
  }, [currentQuote, showToast]);

  // Handle Category Change
  const handleCategoryChange = useCallback((category: CategoryName) => {
    setSelectedCategory(category);
    
    // Immediately pick a quote matching the category
    const pool = category === 'All' ? QUOTES : QUOTES.filter(q => q.category === category);
    if (pool.length > 0) {
      let candidates = pool.filter(q => q.id !== currentQuote.id);
      if (candidates.length === 0) candidates = pool;
      const random = candidates[Math.floor(Math.random() * candidates.length)];
      setCurrentQuote(random);
      setHistory(prev => [...prev, random]);
      setHistoryIndex(prev => prev.length);
      setViewCount(prev => prev + 1);
    }
  }, [currentQuote.id]);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
        return;
      }

      if (e.key === 'Escape') {
        setIsFavoritesOpen(false);
        setIsShortcutsOpen(false);
        setIsShareOpen(false);
        return;
      }

      if (e.code === 'Space' || e.key.toLowerCase() === 'n') {
        e.preventDefault();
        generateNewQuote();
      } else if (e.key.toLowerCase() === 'f') {
        e.preventDefault();
        toggleFavorite();
      } else if (e.key.toLowerCase() === 'c') {
        e.preventDefault();
        copyQuoteToClipboard();
      } else if (e.key.toLowerCase() === 'h') {
        e.preventDefault();
        setIsShareOpen(prev => !prev);
      } else if (e.key.toLowerCase() === 't') {
        e.preventDefault();
        toggleTheme();
      } else if (e.key.toLowerCase() === 's') {
        e.preventDefault();
        setIsFavoritesOpen(prev => !prev);
      } else if (e.key === '?') {
        e.preventDefault();
        setIsShortcutsOpen(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [generateNewQuote, toggleFavorite, copyQuoteToClipboard, toggleTheme]);

  // Current quote index within entire collection
  const currentQuoteIndex = useMemo(() => {
    const idx = QUOTES.findIndex(q => q.id === currentQuote.id);
    return idx >= 0 ? idx : 0;
  }, [currentQuote.id]);

  // Goal calculation (Target: 10 quotes per session)
  const goalTarget = 10;
  const goalProgress = Math.min(100, Math.round((viewCount / goalTarget) * 100));

  // Determine active natural background image
  const activeBgImage = bgMode === 'nature_mountain' ? NATURE_MOUNTAIN_IMG : bgMode === 'nature_forest' ? NATURE_FOREST_IMG : null;

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#FFFDF9] dark:bg-[#140E0C] text-stone-900 dark:text-stone-100 font-sans transition-colors duration-300 selection:bg-amber-200 dark:selection:bg-amber-900/60 relative overflow-x-hidden">
      
      {/* 1. Natural Scenery Background Photo Layer (if selected) */}
      {activeBgImage && (
        <div 
          aria-hidden="true" 
          className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
        >
          <img 
            src={activeBgImage} 
            alt="Scenic Background" 
            className="w-full h-full object-cover object-center filter blur-[1px] transform scale-105 transition-all duration-700 opacity-35 dark:opacity-25"
            referrerPolicy="no-referrer"
          />
          {/* Subtle gradient vignette overlay for perfect contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#FFFDF9]/90 via-[#FFFDF9]/65 to-[#FFFDF9]/80 dark:from-[#140E0C]/90 dark:via-[#140E0C]/75 dark:to-[#140E0C]/85 backdrop-blur-[2px]" />
        </div>
      )}

      {/* 2. Warm Sunset Gradient Orbs Layer */}
      {bgMode === 'warm_gradient' && (
        <div aria-hidden="true" className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute -top-40 -left-40 w-[34rem] h-[34rem] bg-gradient-to-br from-amber-400/25 via-orange-400/20 to-rose-400/10 dark:from-amber-600/20 dark:via-orange-600/15 dark:to-rose-600/10 rounded-full blur-3xl animate-pulse duration-10000" />
          <div className="absolute top-1/3 -right-40 w-[36rem] h-[36rem] bg-gradient-to-bl from-rose-400/25 via-orange-400/15 to-amber-300/15 dark:from-rose-600/20 dark:via-orange-600/10 dark:to-amber-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 left-1/4 w-[34rem] h-[34rem] bg-gradient-to-tr from-amber-500/20 via-orange-400/20 to-rose-500/15 dark:from-orange-600/15 dark:to-amber-600/15 rounded-full blur-3xl" />
        </div>
      )}

      {/* Top Header */}
      <Header
        theme={theme}
        onToggleTheme={toggleTheme}
        onSetTheme={handleSetTheme}
        bgMode={bgMode}
        onSetBgMode={setBgMode}
        favoritesCount={favorites.length}
        onOpenFavorites={() => setIsFavoritesOpen(true)}
        onOpenShortcuts={() => setIsShortcutsOpen(true)}
        currentQuoteIndex={currentQuoteIndex}
        totalQuotes={QUOTES.length}
      />

      {/* Main Content Area in Geometric Balance Layout */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-8 py-6 sm:py-10 w-full grid grid-cols-12 gap-8 lg:gap-10 items-start z-10">
        
        {/* Primary Quote Section (Left 8 Columns on Desktop) */}
        <section className="col-span-12 lg:col-span-8 flex flex-col justify-center space-y-6">
          
          {/* Main Quote Card with Warm Rotated Badge */}
          <div className="pt-2 sm:pt-4">
            <QuoteCard
              quote={currentQuote}
              quoteIndex={currentQuoteIndex}
              totalQuotes={QUOTES.length}
              viewCount={viewCount}
            />
          </div>

          {/* Action Bar & Controls */}
          <div className="w-full">
            <QuoteActions
              currentQuote={currentQuote}
              isFavorite={isCurrentFavorite}
              onNewQuote={generateNewQuote}
              onToggleFavorite={toggleFavorite}
              onCopyQuote={() => copyQuoteToClipboard()}
              onOpenShareModal={() => setIsShareOpen(true)}
              selectedCategory={selectedCategory}
              onSelectCategory={handleCategoryChange}
              isLoading={isGenerating}
            />

            {/* History Navigation pill */}
            {history.length > 1 && (
              <div className="flex items-center justify-between pt-4 px-2 text-xs font-bold text-stone-500 dark:text-stone-400">
                <button
                  type="button"
                  onClick={handlePreviousQuote}
                  disabled={historyIndex === 0}
                  className="flex items-center gap-1.5 hover:text-amber-600 dark:hover:text-amber-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  aria-label="Previous quote in history"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Previous ({historyIndex} back)</span>
                </button>
                
                <span className="text-[11px] font-medium text-stone-400 dark:text-stone-500 hidden sm:inline">
                  Press <kbd className="px-1.5 py-0.5 bg-amber-100/70 dark:bg-stone-800 rounded font-mono text-stone-700 dark:text-stone-300">Space</kbd> or <kbd className="px-1.5 py-0.5 bg-amber-100/70 dark:bg-stone-800 rounded font-mono text-stone-700 dark:text-stone-300">N</kbd> for next • <kbd className="px-1.5 py-0.5 bg-amber-100/70 dark:bg-stone-800 rounded font-mono text-stone-700 dark:text-stone-300">H</kbd> to share
                </span>
                
                <button
                  type="button"
                  onClick={handleNextQuote}
                  className="flex items-center gap-1.5 hover:text-amber-600 dark:hover:text-amber-400 transition-colors cursor-pointer"
                  aria-label="Next quote"
                >
                  <span>{historyIndex < history.length - 1 ? `Next (${history.length - 1 - historyIndex})` : 'New Quote'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

        </section>

        {/* Aside Sidebar (Right 4 Columns on Desktop) */}
        <aside className="col-span-12 lg:col-span-4 flex flex-col space-y-6">
          
          {/* Favorites Card with Warm Frosted Aesthetic */}
          <div className="bg-white/90 dark:bg-[#1C1412]/90 backdrop-blur-md rounded-[2rem] border border-amber-200/70 dark:border-amber-950/80 p-6 sm:p-7 flex flex-col shadow-xl shadow-orange-500/5 dark:shadow-black/40">
            
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center space-x-2.5">
                <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
                <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100">
                  Your Favorites
                </h2>
              </div>
              <span className="bg-gradient-to-r from-amber-500 to-rose-500 text-white text-xs font-black px-2.5 py-1 rounded-lg shadow-xs">
                {favorites.length}
              </span>
            </div>

            {/* Favorite quotes list */}
            <div className="space-y-3">
              {favorites.length === 0 ? (
                <div className="p-6 bg-amber-50/50 dark:bg-stone-900/50 rounded-2xl border border-dashed border-amber-200 dark:border-stone-800 text-center space-y-2">
                  <p className="text-sm font-bold text-stone-700 dark:text-stone-300">
                    No favorite quotes yet
                  </p>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    Click the heart icon on quotes you love to build your personal collection.
                  </p>
                </div>
              ) : (
                <>
                  {favorites.slice(0, 3).map((fav) => (
                    <div
                      key={fav.id}
                      onClick={() => {
                        setCurrentQuote(fav);
                        setHistory(prev => [...prev, fav]);
                        setHistoryIndex(prev => prev.length);
                      }}
                      className="p-3.5 bg-white dark:bg-stone-900 rounded-2xl shadow-xs border border-amber-100 dark:border-stone-800 flex flex-col space-y-1.5 relative group hover:border-amber-300 dark:hover:border-amber-700 transition-all cursor-pointer"
                    >
                      <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-200 line-clamp-2 italic font-serif">
                        "{fav.text}"
                      </p>
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                          {fav.author}
                        </span>
                        <span className="text-[10px] text-stone-400 dark:text-stone-500 uppercase font-bold">
                          {fav.category}
                        </span>
                      </div>
                      
                      {/* Floating Delete Button on hover/focus */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFavorite(fav.id);
                        }}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-rose-500 text-white rounded-full flex items-center justify-center shadow-md opacity-80 group-hover:opacity-100 hover:scale-110 transition-all cursor-pointer"
                        title="Remove from favorites"
                        aria-label={`Remove ${fav.author} quote from favorites`}
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}

                  {favorites.length > 3 && (
                    <button
                      type="button"
                      onClick={() => setIsFavoritesOpen(true)}
                      className="w-full p-3 bg-amber-50/80 dark:bg-amber-950/40 rounded-2xl border border-dashed border-amber-300/70 dark:border-amber-900/60 flex items-center justify-center text-xs text-amber-800 dark:text-amber-300 font-bold hover:bg-amber-100 dark:hover:bg-amber-900/60 transition-colors cursor-pointer"
                    >
                      <span>View {favorites.length - 3} more in library...</span>
                    </button>
                  )}
                </>
              )}
            </div>

          </div>

          {/* Daily Goal / Reading Session Card with Sunset Gradient accents */}
          <div className="bg-gradient-to-br from-stone-900 via-stone-900 to-[#2A1610] text-white p-6 rounded-[2rem] flex items-center justify-between shadow-xl border border-amber-900/30">
            <div>
              <p className="text-[11px] text-amber-400 uppercase tracking-widest font-black mb-1">
                Reading Goal
              </p>
              <p className="text-lg font-bold">
                {viewCount}/{goalTarget} Quotes Read
              </p>
              <p className="text-xs text-stone-400 mt-0.5">
                {viewCount >= goalTarget ? 'Goal completed! Radiant mind.' : `${goalTarget - viewCount} more to reach daily goal`}
              </p>
            </div>
            
            <div className="w-14 h-14 rounded-full border-4 border-amber-500 bg-amber-500/10 flex flex-col items-center justify-center text-xs font-black shadow-inner text-amber-300">
              <span>{goalProgress}%</span>
            </div>
          </div>

          {/* Quick Wallpaper Switcher Card */}
          <div className="p-4 rounded-2xl bg-white/70 dark:bg-[#1C1412]/70 backdrop-blur-md border border-amber-200/60 dark:border-stone-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-stone-600 dark:text-stone-300 font-medium">
              <ImageIcon className="w-4 h-4 text-amber-500" />
              <span>Backdrop:</span>
              <strong className="text-amber-700 dark:text-amber-300 capitalize">
                {bgMode.replace('_', ' ')}
              </strong>
            </div>
            <button
              type="button"
              onClick={() => {
                const modes: BgMode[] = ['nature_mountain', 'nature_forest', 'warm_gradient', 'minimal'];
                const nextIdx = (modes.indexOf(bgMode) + 1) % modes.length;
                setBgMode(modes[nextIdx]);
              }}
              className="px-3 py-1 bg-amber-100/70 dark:bg-stone-800 text-stone-800 dark:text-stone-200 rounded-xl font-bold hover:bg-amber-200 dark:hover:bg-stone-700 transition-colors cursor-pointer"
            >
              Switch
            </button>
          </div>

        </aside>

      </main>

      {/* Footer */}
      <footer className="mt-8 border-t border-amber-200/50 dark:border-stone-900 py-6 px-4 sm:px-8 text-stone-500 dark:text-stone-400 text-xs font-medium uppercase tracking-widest bg-white/50 dark:bg-[#140E0C]/50 backdrop-blur-xs z-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
          <span>QuoteFlow • Daily Inspiration Engine</span>
          <span>105+ Curated Quotes • Natural Serenity</span>
          <span>Status: <span className="text-emerald-600 dark:text-emerald-400 font-bold">Active</span></span>
        </div>
      </footer>

      {/* Drawers & Modals */}
      <FavoritesDrawer
        isOpen={isFavoritesOpen}
        onClose={() => setIsFavoritesOpen(false)}
        favorites={favorites}
        onRemoveFavorite={removeFavorite}
        onClearFavorites={clearAllFavorites}
        onSelectQuote={(quote) => {
          setCurrentQuote(quote);
          setHistory(prev => [...prev, quote]);
          setHistoryIndex(prev => prev.length);
        }}
        onCopyQuote={(quote) => copyQuoteToClipboard(quote)}
      />

      <KeyboardShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />

      {/* Share Modal (Export as Image Card or Copy/Share Formatted Text) */}
      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        quote={currentQuote}
        onShowToast={showToast}
      />

      {/* Toast Feedback */}
      <Toast toast={toast} />

    </div>
  );
}
