import React, { useState } from 'react';
import { 
  Check, 
  AlertCircle, 
  Star, 
  ChevronDown, 
  ChevronUp, 
  Sparkles,
  BookOpen
} from 'lucide-react';
import { VocabularyItem } from '../../types';
import { useLearning } from '../../context/LearningContext';
import { AudioButton } from '../common/AudioButton';
import { CATEGORY_ICONS } from '../../data/vocabulary';

interface VocabularyCardProps {
  item: VocabularyItem;
  layout?: 'grid' | 'list';
  id?: string;
}

export const VocabularyCard: React.FC<VocabularyCardProps> = ({
  item,
  layout = 'grid',
  id,
}) => {
  const { 
    isLearned, 
    isDifficult, 
    isFavorite, 
    toggleLearned, 
    toggleDifficult, 
    toggleFavorite 
  } = useLearning();

  const [isExpanded, setIsExpanded] = useState(false);

  const learned = isLearned(item.id);
  const difficult = isDifficult(item.id);
  const favorite = isFavorite(item.id);

  const categoryIcon = CATEGORY_ICONS[item.category] || '📖';

  if (layout === 'list') {
    return (
      <div 
        id={id}
        className={`w-full p-4 rounded-xl border transition-all duration-200 bg-white dark:bg-slate-900 ${
          learned
            ? 'border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/20 dark:bg-emerald-950/20'
            : difficult
            ? 'border-amber-200 dark:border-amber-900/60 bg-amber-50/20 dark:bg-amber-950/20'
            : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start sm:items-center gap-3">
            <AudioButton text={item.text} size="sm" variant="secondary" />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-lg font-bold text-slate-900 dark:text-slate-100 font-heading">
                  {item.text}
                </span>
                <span className="text-xs text-slate-400 dark:text-slate-500 font-mono">
                  [{item.pronunciation}]
                </span>
                {learned && (
                  <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    <Check size={12} className="stroke-[3]" /> Learned
                  </span>
                )}
                {difficult && (
                  <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                    <AlertCircle size={12} /> Needs Practice
                  </span>
                )}
              </div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-300 mt-0.5">
                {item.translation}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800/80">
            <span className="text-xs px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center gap-1">
              <span>{categoryIcon}</span>
              <span>{item.category}</span>
            </span>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => toggleFavorite(item.id)}
                title={favorite ? 'Remove from favorites' : 'Add to favorites'}
                aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
                className={`p-1.5 rounded-lg transition-colors ${
                  favorite
                    ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/60'
                    : 'text-slate-400 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Star size={16} className={favorite ? 'fill-amber-400' : ''} />
              </button>

              <button
                type="button"
                onClick={() => toggleDifficult(item.id)}
                title={difficult ? 'Remove from difficult' : 'Mark as difficult'}
                aria-label={difficult ? 'Remove from difficult' : 'Mark as difficult'}
                className={`p-1.5 rounded-lg transition-colors text-xs font-medium ${
                  difficult
                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    : 'text-slate-400 hover:text-amber-600 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <AlertCircle size={16} />
              </button>

              <button
                type="button"
                onClick={() => toggleLearned(item.id)}
                title={learned ? 'Mark as unlearned' : 'Mark as learned'}
                aria-label={learned ? 'Mark as unlearned' : 'Mark as learned'}
                className={`p-1.5 rounded-lg transition-colors text-xs font-medium ${
                  learned
                    ? 'bg-emerald-600 text-white'
                    : 'text-slate-400 hover:text-emerald-600 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Check size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Example sentence expandable */}
        {item.exampleSentence && (
          <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 text-xs">
            <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-medium">
              <span className="text-indigo-600 dark:text-indigo-400 font-bold">Ex:</span>
              <span>{item.exampleSentence}</span>
            </div>
            <div className="text-slate-400 dark:text-slate-500 italic pl-5 mt-0.5">
              "{item.exampleTranslation}"
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      id={id}
      className={`rounded-2xl border transition-all duration-200 bg-white dark:bg-slate-900 flex flex-col justify-between overflow-hidden shadow-2xs hover:shadow-md ${
        learned
          ? 'border-emerald-200 dark:border-emerald-900/60 ring-1 ring-emerald-500/20'
          : difficult
          ? 'border-amber-200 dark:border-amber-900/60 ring-1 ring-amber-500/20'
          : 'border-slate-200/90 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-900'
      }`}
    >
      {/* Top Header Row */}
      <div className="p-4 pb-0 flex items-center justify-between">
        <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
          <span>{categoryIcon}</span>
          <span>{item.category}</span>
        </span>

        <div className="flex items-center gap-1">
          {/* Favorite Star */}
          <button
            type="button"
            onClick={() => toggleFavorite(item.id)}
            title={favorite ? 'Remove from favorites' : 'Add to favorites'}
            aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
            className={`p-1.5 rounded-lg transition-colors ${
              favorite
                ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/60'
                : 'text-slate-400 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Star size={16} className={favorite ? 'fill-amber-400 text-amber-500' : ''} />
          </button>
        </div>
      </div>

      {/* Main Body */}
      <div className="p-4 pt-3 flex-1">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="text-xl font-bold font-heading text-slate-900 dark:text-slate-100 tracking-tight">
            {item.text}
          </h3>
          <AudioButton text={item.text} size="sm" variant="secondary" />
        </div>

        <p className="text-xs text-indigo-600 dark:text-indigo-400 font-mono mb-2.5">
          /{item.pronunciation}/
        </p>

        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 mb-3">
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            {item.translation}
          </p>
        </div>

        {/* Example sentence block */}
        <div className="text-xs space-y-1">
          <div className="flex items-start gap-1.5 text-slate-700 dark:text-slate-300">
            <span className="font-bold text-indigo-600 dark:text-indigo-400 shrink-0">Ex:</span>
            <span className="leading-snug">{item.exampleSentence}</span>
          </div>
          <div className="text-slate-400 dark:text-slate-500 italic pl-5 leading-snug">
            "{item.exampleTranslation}"
          </div>
        </div>
      </div>

      {/* Bottom Status Controls */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between gap-2">
        {/* Difficult Toggle */}
        <button
          type="button"
          onClick={() => toggleDifficult(item.id)}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-lg text-xs font-semibold transition-all ${
            difficult
              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800 border border-transparent'
          }`}
        >
          <AlertCircle size={14} />
          <span>{difficult ? 'Needs Practice' : 'Hard'}</span>
        </button>

        {/* Learned Toggle */}
        <button
          type="button"
          onClick={() => toggleLearned(item.id)}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-lg text-xs font-semibold transition-all ${
            learned
              ? 'bg-emerald-600 text-white shadow-2xs hover:bg-emerald-700'
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-emerald-50 hover:text-emerald-700 dark:hover:bg-emerald-950/40'
          }`}
        >
          <Check size={14} className={learned ? 'stroke-[3]' : ''} />
          <span>{learned ? 'Learned' : 'Mark Learned'}</span>
        </button>
      </div>
    </div>
  );
};
