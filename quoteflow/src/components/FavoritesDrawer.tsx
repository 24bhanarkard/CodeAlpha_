import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Heart, Trash2, Copy, Check, Sparkles, BookOpen } from 'lucide-react';
import { Quote } from '../types';

interface FavoritesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  favorites: Quote[];
  onRemoveFavorite: (quoteId: string) => void;
  onClearFavorites: () => void;
  onSelectQuote: (quote: Quote) => void;
  onCopyQuote: (quote: Quote) => void;
}

export const FavoritesDrawer: React.FC<FavoritesDrawerProps> = ({
  isOpen,
  onClose,
  favorites,
  onRemoveFavorite,
  onClearFavorites,
  onSelectQuote,
  onCopyQuote
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (quote: Quote, e: React.MouseEvent) => {
    e.stopPropagation();
    onCopyQuote(quote);
    setCopiedId(quote.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleRemove = (quoteId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onRemoveFavorite(quoteId);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true" aria-labelledby="favorites-drawer-title">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-stone-950/50 backdrop-blur-xs transition-opacity"
            aria-hidden="true"
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 240 }}
              className="w-screen max-w-md bg-[#FFFBF5] dark:bg-[#140E0C] border-l border-amber-200/70 dark:border-amber-950/80 shadow-2xl flex flex-col"
            >
              {/* Header */}
              <div className="p-6 border-b border-amber-200/60 dark:border-stone-800 flex items-center justify-between bg-white dark:bg-[#1C1412]">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-500 text-white flex items-center justify-center shadow-md shadow-orange-500/25">
                    <Heart className="w-5 h-5 fill-current" />
                  </div>
                  <div>
                    <h2 id="favorites-drawer-title" className="text-lg font-bold text-stone-900 dark:text-stone-100">
                      Your Favorites
                    </h2>
                    <p className="text-xs text-stone-500 dark:text-stone-400">
                      {favorites.length} {favorites.length === 1 ? 'quote' : 'quotes'} saved
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {favorites.length > 0 && (
                    <button
                      id="clear-all-favorites-button"
                      type="button"
                      onClick={onClearFavorites}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold text-stone-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                      title="Clear all saved favorites"
                    >
                      Clear All
                    </button>
                  )}
                  <button
                    id="close-favorites-button"
                    type="button"
                    onClick={onClose}
                    className="p-2 rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-amber-100/60 dark:hover:bg-stone-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 cursor-pointer"
                    aria-label="Close favorites panel"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Favorites Content List */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {favorites.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4 my-auto">
                    <div className="w-16 h-16 rounded-2xl bg-white dark:bg-stone-900 border-2 border-dashed border-amber-200 dark:border-stone-800 flex items-center justify-center text-stone-400">
                      <Heart className="w-8 h-8 stroke-[1.5] text-rose-400" />
                    </div>
                    <div className="space-y-1 max-w-xs">
                      <h3 className="text-base font-bold text-stone-800 dark:text-stone-200">
                        No favorite quotes yet
                      </h3>
                      <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
                        Tap the heart icon on any quote to save it to your personal warm collection.
                      </p>
                    </div>
                  </div>
                ) : (
                  favorites.map((fav) => (
                    <motion.div
                      key={fav.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      onClick={() => {
                        onSelectQuote(fav);
                        onClose();
                      }}
                      className="group relative p-5 bg-white dark:bg-stone-900 rounded-2xl shadow-xs border border-amber-100 dark:border-stone-800 flex flex-col space-y-2 hover:border-amber-300 dark:hover:border-amber-700 transition-all cursor-pointer"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 dark:text-amber-300 bg-amber-100/80 dark:bg-amber-950/60 px-2.5 py-0.5 rounded-full border border-amber-200 dark:border-amber-900/50">
                          <Sparkles className="w-2.5 h-2.5 text-amber-600 dark:text-amber-400" />
                          {fav.category}
                        </span>

                        {/* Actions */}
                        <div className="flex items-center space-x-1">
                          <button
                            type="button"
                            onClick={(e) => handleCopy(fav, e)}
                            className="p-1.5 rounded-lg text-stone-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-stone-800 transition-colors"
                            aria-label={`Copy quote by ${fav.author}`}
                            title="Copy quote"
                          >
                            {copiedId === fav.id ? (
                              <Check className="w-4 h-4 text-emerald-500" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={(e) => handleRemove(fav.id, e)}
                            className="p-1.5 rounded-lg text-stone-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                            aria-label={`Remove quote by ${fav.author} from favorites`}
                            title="Remove from favorites"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <p className="text-sm font-serif italic text-stone-800 dark:text-stone-200 line-clamp-3 leading-relaxed">
                        "{fav.text}"
                      </p>

                      <div className="flex items-center justify-between pt-1">
                        <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                          — {fav.author}
                        </span>
                        <span className="text-[11px] opacity-0 group-hover:opacity-100 text-stone-400 font-medium transition-opacity flex items-center gap-1">
                          <BookOpen className="w-3 h-3 text-amber-500" />
                          Display
                        </span>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>

              {/* Footer */}
              {favorites.length > 0 && (
                <div className="p-4 border-t border-amber-200/60 dark:border-stone-800 bg-white dark:bg-[#1C1412] text-center">
                  <p className="text-xs text-stone-400 dark:text-stone-500">
                    Saved in browser localStorage automatically.
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
