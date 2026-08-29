import React from 'react';

interface ProgressBarProps {
  currentIndex: number;
  totalCards: number;
  onSelectIndex?: (index: number) => void;
  needsPracticeIndices?: Set<number>;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  currentIndex,
  totalCards,
  onSelectIndex,
  needsPracticeIndices = new Set(),
}) => {
  if (totalCards <= 0) return null;

  const progressPercentage = ((currentIndex + 1) / totalCards) * 100;

  return (
    <div className="w-full space-y-2.5 bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs">
      <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></span>
          <span>Deck Progress</span>
        </span>
        <span className="font-extrabold text-slate-800 dark:text-slate-200">{Math.round(progressPercentage)}% Completed</span>
      </div>

      {/* Main Continuous Progress Bar */}
      <div className="relative w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-indigo-600 dark:bg-indigo-500 transition-all duration-300 ease-out rounded-full"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {/* Mini Dot Segment Indicator for jumping when <= 20 cards */}
      {totalCards <= 20 && onSelectIndex && (
        <div className="flex items-center justify-between gap-1.5 pt-0.5">
          {Array.from({ length: totalCards }).map((_, idx) => {
            const isCurrent = idx === currentIndex;
            const isPast = idx < currentIndex;
            const isDifficult = needsPracticeIndices.has(idx);

            return (
              <button
                key={idx}
                onClick={() => onSelectIndex(idx)}
                title={`Jump to Card ${idx + 1}`}
                aria-label={`Jump to Card ${idx + 1}`}
                className={`h-2 flex-1 rounded-full transition-all duration-200 cursor-pointer ${
                  isCurrent
                    ? 'bg-indigo-600 dark:bg-indigo-400 scale-y-125'
                    : isPast
                    ? isDifficult
                      ? 'bg-amber-400 dark:bg-amber-500'
                      : 'bg-indigo-200 dark:bg-indigo-900/70'
                    : 'bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700'
                }`}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};
