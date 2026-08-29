import React from 'react';
import { ChevronLeft, ChevronRight, Shuffle, Edit3, Trash2, RotateCcw } from 'lucide-react';

interface NavigationControlsProps {
  currentIndex: number;
  totalCards: number;
  onPrev: () => void;
  onNext: () => void;
  onShuffle?: () => void;
  onResetOrder?: () => void;
  onEditCurrent?: () => void;
  onDeleteCurrent?: () => void;
}

export const NavigationControls: React.FC<NavigationControlsProps> = ({
  currentIndex,
  totalCards,
  onPrev,
  onNext,
  onShuffle,
  onResetOrder,
  onEditCurrent,
  onDeleteCurrent,
}) => {
  const isFirst = currentIndex <= 0;
  const isLast = currentIndex >= totalCards - 1;

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4 pt-2">
      {/* Bento Main Navigation Bar */}
      <div className="bg-white dark:bg-slate-900 p-2 sm:p-2.5 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs flex items-center justify-between gap-3">
        {/* Previous Button */}
        <button
          id="btn-prev-card"
          type="button"
          disabled={isFirst}
          onClick={onPrev}
          className="flex items-center gap-1.5 px-4 sm:px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95 border border-slate-200/60 dark:border-slate-700/60"
          aria-label="Previous card"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Prev</span>
        </button>

        {/* Center Progress Text Indicator */}
        <div className="text-center">
          <p className="text-[11px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Card <span className="text-slate-900 dark:text-white font-black">{currentIndex + 1}</span> of {totalCards}
          </p>
        </div>

        {/* Next Button */}
        <button
          id="btn-next-card"
          type="button"
          disabled={isLast}
          onClick={onNext}
          className="flex items-center gap-1.5 px-5 sm:px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm shadow-indigo-500/20 disabled:opacity-30 disabled:cursor-not-allowed disabled:shadow-none transition-all active:scale-95"
          aria-label="Next card"
        >
          <span>Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Bento Secondary Action Toolbar */}
      <div className="flex items-center justify-between flex-wrap gap-2 px-1">
        <div className="flex items-center gap-2">
          {onEditCurrent && (
            <button
              id="btn-edit-current-card"
              type="button"
              onClick={onEditCurrent}
              title="Edit this flashcard"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 transition-all shadow-xs"
            >
              <Edit3 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>Edit Card</span>
            </button>
          )}

          {onDeleteCurrent && (
            <button
              id="btn-delete-current-card"
              type="button"
              onClick={onDeleteCurrent}
              title="Delete this flashcard"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:border-rose-200 dark:hover:border-rose-800 transition-all shadow-xs"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {onShuffle && (
            <button
              id="btn-shuffle-deck"
              type="button"
              onClick={onShuffle}
              title="Shuffle flashcards"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200/90 dark:border-slate-800 transition-colors shadow-xs"
              aria-label="Shuffle cards"
            >
              <Shuffle className="w-3.5 h-3.5" />
              <span>Shuffle</span>
            </button>
          )}

          {onResetOrder && (
            <button
              id="btn-reset-order"
              type="button"
              onClick={onResetOrder}
              title="Reset to default order"
              className="p-1.5 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/90 dark:border-slate-800 transition-colors shadow-xs"
              aria-label="Reset card order"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
