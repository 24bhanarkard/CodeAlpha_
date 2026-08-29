import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles } from 'lucide-react';
import { Quote } from '../types';

interface QuoteCardProps {
  quote: Quote;
  quoteIndex: number;
  totalQuotes: number;
  viewCount: number;
}

export const QuoteCard: React.FC<QuoteCardProps> = ({
  quote,
  quoteIndex,
  totalQuotes,
  viewCount
}) => {
  return (
    <div 
      id="main-quote-card"
      className="w-full bg-white/95 dark:bg-[#1C1412]/95 backdrop-blur-md rounded-[2.25rem] sm:rounded-[2.5rem] p-7 sm:p-12 md:p-16 shadow-2xl shadow-orange-500/10 dark:shadow-black/40 border border-amber-200/70 dark:border-amber-900/40 relative transition-colors duration-300 flex flex-col justify-between min-h-[320px] sm:min-h-[360px]"
    >
      {/* Signature Geometric Rotated Icon Badge in Radiant Warm Sunset Gradient */}
      <div 
        className="absolute -top-4 -left-4 sm:-top-6 sm:-left-6 w-14 h-14 sm:w-20 sm:h-20 bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-500 rounded-2xl flex items-center justify-center shadow-xl shadow-orange-500/35 rotate-3 transition-transform hover:rotate-6 select-none z-20"
        aria-hidden="true"
      >
        <svg className="w-7 h-7 sm:w-10 sm:h-10 text-white fill-current" viewBox="0 0 24 24">
          <path d="M14.017 21L14.017 18C14.017 16.8954 13.1216 16 12.017 16H10.017C8.91243 16 8.017 16.8954 8.017 18V21M12.017 21H12.0171M21 11.4771C21 15.6569 17.6569 19.017 13.4771 19.017C12.3518 19.017 11.2721 18.775 10.2882 18.3411L3 21L5.65888 13.7118C5.22497 12.7279 4.98298 11.6482 4.98298 10.5229C4.98298 6.34315 8.32612 3 12.5059 3C16.6857 3 20.0288 6.34315 20.0288 10.5229C20.0288 10.8465 20.0191 11.1652 20 11.4771Z" strokeWidth="2" />
        </svg>
      </div>

      {/* Top Header inside Card: Category Pill & Counter */}
      <div className="flex items-center justify-between gap-4 mb-6 sm:mb-8 pl-10 sm:pl-12 z-10">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-amber-100/90 via-orange-100/80 to-rose-100/80 dark:from-amber-950/80 dark:via-orange-950/70 dark:to-rose-950/70 text-amber-900 dark:text-amber-300 border border-amber-300/60 dark:border-amber-800/50 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
          {quote.category}
        </span>

        <div className="flex items-center gap-2 text-xs font-medium text-stone-500 dark:text-stone-400">
          <span className="tabular-nums font-semibold" title={`Quote ${quoteIndex + 1} of ${totalQuotes}`}>
            #{quoteIndex + 1} / {totalQuotes}
          </span>
          {viewCount > 1 && (
            <span className="hidden sm:inline text-stone-400 dark:text-stone-500">
              • {viewCount} viewed
            </span>
          )}
        </div>
      </div>

      {/* Animated Quote Content Area */}
      <div className="relative my-auto py-2 z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={quote.id}
            initial={{ opacity: 0, y: 14, filter: 'blur(3px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -14, filter: 'blur(3px)' }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6 sm:space-y-8"
          >
            <blockquote className="text-2xl sm:text-3xl md:text-4xl font-serif text-stone-800 dark:text-stone-100 leading-snug sm:leading-tight italic">
              "{quote.text}"
            </blockquote>

            {/* Geometric Author Footer with Warm Sunset Gradient Divider */}
            <footer className="flex flex-wrap items-center gap-3 sm:gap-4 pt-1">
              <div className="h-[3px] w-10 sm:w-12 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 rounded-full" aria-hidden="true" />
              <cite className="text-lg sm:text-xl font-bold text-stone-800 dark:text-stone-200 not-italic">
                {quote.author}
              </cite>
              {quote.context && (
                <span className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 font-normal">
                  ({quote.context})
                </span>
              )}
            </footer>
          </motion.div>
        </AnimatePresence>
      </div>

    </div>
  );
};
