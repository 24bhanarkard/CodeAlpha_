import React, { useState } from 'react';
import { Heart, Copy, Check, Share2, Filter, ArrowRight, Sparkles } from 'lucide-react';
import { Quote } from '../types';
import { CATEGORIES, CategoryName } from '../data/quotes';

interface QuoteActionsProps {
  currentQuote: Quote;
  isFavorite: boolean;
  onNewQuote: () => void;
  onToggleFavorite: () => void;
  onCopyQuote: () => void;
  onOpenShareModal: () => void;
  selectedCategory: CategoryName;
  onSelectCategory: (category: CategoryName) => void;
  isLoading?: boolean;
}

export const QuoteActions: React.FC<QuoteActionsProps> = ({
  currentQuote,
  isFavorite,
  onNewQuote,
  onToggleFavorite,
  onCopyQuote,
  onOpenShareModal,
  selectedCategory,
  onSelectCategory,
  isLoading = false
}) => {
  const [copied, setCopied] = useState(false);
  const [showCategories, setShowCategories] = useState(false);

  const handleCopy = () => {
    onCopyQuote();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full space-y-4">
      {/* Primary Action Bar */}
      <div className="mt-4 sm:mt-6 flex flex-wrap items-center justify-between gap-3">
        
        {/* Left Utility Button Group with Geometric 2xl squares */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          
          {/* Copy Button */}
          <button
            id="copy-quote-button"
            type="button"
            onClick={handleCopy}
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl border-2 border-amber-200/80 dark:border-stone-800 bg-white/90 dark:bg-stone-900/90 flex items-center justify-center text-stone-600 dark:text-stone-300 hover:text-amber-600 dark:hover:text-amber-400 hover:border-amber-400 dark:hover:border-amber-700 hover:bg-amber-50/70 dark:hover:bg-amber-950/40 transition-all shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 cursor-pointer"
            aria-label="Copy quote to clipboard"
            title="Copy Quote (C)"
          >
            {copied ? (
              <Check className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-500" />
            ) : (
              <Copy className="w-5 h-5 sm:w-6 sm:h-6" />
            )}
          </button>

          {/* Favorite Button */}
          <button
            id="favorite-quote-button"
            type="button"
            onClick={onToggleFavorite}
            className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl border-2 flex items-center justify-center transition-all shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 cursor-pointer ${
              isFavorite
                ? 'border-rose-300 dark:border-rose-900/80 bg-rose-50/90 dark:bg-rose-950/60 text-rose-500 shadow-rose-500/10'
                : 'border-amber-200/80 dark:border-stone-800 bg-white/90 dark:bg-stone-900/90 text-stone-600 dark:text-stone-400 hover:text-rose-500 hover:border-rose-300 dark:hover:border-rose-900/60 hover:bg-rose-50/50 dark:hover:bg-rose-950/30'
            }`}
            aria-label={isFavorite ? 'Remove quote from favorites' : 'Add quote to favorites'}
            aria-pressed={isFavorite}
            title="Favorite (F)"
          >
            <Heart 
              className={`w-5 h-5 sm:w-6 sm:h-6 transition-transform active:scale-125 ${
                isFavorite ? 'fill-current text-rose-500' : ''
              }`} 
            />
          </button>

          {/* Share as Image or Text Button */}
          <button
            id="share-quote-button"
            type="button"
            onClick={onOpenShareModal}
            className="h-12 sm:h-14 px-3.5 sm:px-4 rounded-2xl border-2 border-amber-200/80 dark:border-stone-800 bg-white/90 dark:bg-stone-900/90 flex items-center gap-2 text-stone-700 dark:text-stone-200 hover:text-orange-600 dark:hover:text-orange-400 hover:border-orange-400 dark:hover:border-orange-700 hover:bg-orange-50/60 dark:hover:bg-orange-950/40 transition-all shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 cursor-pointer text-xs sm:text-sm font-bold"
            aria-label="Share quote as image card or formatted text"
            title="Share Quote (Image & Text)"
          >
            <Share2 className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />
            <span className="hidden sm:inline">Share</span>
          </button>

          {/* Category Filter Toggle */}
          <button
            id="category-filter-toggle-button"
            type="button"
            onClick={() => setShowCategories(!showCategories)}
            className={`h-12 sm:h-14 px-3 sm:px-4 rounded-2xl border-2 flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-bold transition-all shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 cursor-pointer ${
              selectedCategory !== 'All' || showCategories
                ? 'border-amber-400 dark:border-amber-700 bg-amber-100/80 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300'
                : 'border-amber-200/80 dark:border-stone-800 bg-white/90 dark:bg-stone-900/90 text-stone-700 dark:text-stone-300 hover:bg-amber-50/70 dark:hover:bg-stone-800'
            }`}
            aria-expanded={showCategories}
            aria-label="Filter quotes by category"
            title="Filter by Category"
          >
            <Filter className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span className="max-w-[75px] sm:max-w-none truncate">{selectedCategory}</span>
          </button>
        </div>

        {/* Primary Action: New Quote Button in Radiant Warm Sunset Gradient */}
        <button
          id="new-quote-button"
          type="button"
          onClick={onNewQuote}
          disabled={isLoading}
          className="flex-1 sm:flex-none bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 hover:from-amber-600 hover:via-orange-600 hover:to-rose-700 active:from-amber-700 active:to-rose-800 text-white px-6 sm:px-9 py-3.5 sm:py-4 rounded-2xl font-black text-sm sm:text-base md:text-lg shadow-xl shadow-orange-500/25 dark:shadow-orange-950/40 transition-all flex items-center justify-center space-x-2.5 sm:space-x-3 transform active:scale-98 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 cursor-pointer"
          aria-label="Generate a new random quote"
          title="New Quote (Space or N)"
        >
          <span>New Quote</span>
          <ArrowRight className={`w-4 h-4 sm:w-5 sm:h-5 ${isLoading ? 'animate-spin' : ''}`} />
          <kbd className="hidden xl:inline-block px-2 py-0.5 text-[11px] font-mono font-bold bg-white/20 rounded-md border border-white/30 text-white shadow-2xs">
            Space
          </kbd>
        </button>

      </div>

      {/* Category Pills Drawer / Container */}
      {showCategories && (
        <div 
          id="category-pill-container"
          className="p-4 sm:p-5 rounded-2xl bg-white/95 dark:bg-stone-900/95 border border-amber-200/80 dark:border-stone-800 shadow-md transition-all"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-black text-amber-900/70 dark:text-amber-300/80 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-amber-500" />
              Filter by Category ({CATEGORIES.length - 1} categories)
            </span>
            <span className="text-xs text-stone-500 dark:text-stone-400">
              Active: <strong className="text-amber-600 dark:text-amber-400 font-bold">{selectedCategory}</strong>
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => onSelectCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-sm'
                      : 'bg-amber-50 dark:bg-stone-800/90 text-stone-700 dark:text-stone-300 hover:bg-amber-100/80 dark:hover:bg-amber-950/50 hover:text-amber-800 dark:hover:text-amber-300'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
