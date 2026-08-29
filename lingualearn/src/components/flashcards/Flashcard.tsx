import React, { useState, useEffect } from 'react';
import { 
  RotateCw, 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  AlertCircle, 
  Star, 
  Shuffle, 
  Volume2, 
  Sparkles,
  HelpCircle,
  Eye
} from 'lucide-react';
import { VocabularyItem } from '../../types';
import { useLearning } from '../../context/LearningContext';
import { AudioButton } from '../common/AudioButton';
import { soundFx } from '../../utils/audio';
import { CATEGORY_ICONS } from '../../data/vocabulary';

interface FlashcardProps {
  items: VocabularyItem[];
  onComplete?: () => void;
  id?: string;
}

export const Flashcard: React.FC<FlashcardProps> = ({
  items,
  onComplete,
  id,
}) => {
  const { 
    isLearned, 
    isDifficult, 
    isFavorite, 
    toggleLearned, 
    toggleDifficult, 
    toggleFavorite,
    soundEffectsEnabled,
  } = useLearning();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [deck, setDeck] = useState<VocabularyItem[]>(items);

  useEffect(() => {
    setDeck(items);
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [items]);

  const currentItem = deck[currentIndex];

  const handleFlip = () => {
    soundFx.playFlipSound(soundEffectsEnabled);
    setIsFlipped(!isFlipped);
  };

  const handleNext = () => {
    if (currentIndex < deck.length - 1) {
      setIsFlipped(false);
      setCurrentIndex(prev => prev + 1);
    } else if (onComplete) {
      onComplete();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setIsFlipped(false);
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleShuffle = () => {
    soundFx.playFlipSound(soundEffectsEnabled);
    const shuffled = [...deck].sort(() => Math.random() - 0.5);
    setDeck(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is in an input field
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        handleFlip();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if ((e.key === 'l' || e.key === 'L') && currentItem) {
        e.preventDefault();
        toggleLearned(currentItem.id);
      } else if ((e.key === 'd' || e.key === 'D') && currentItem) {
        e.preventDefault();
        toggleDifficult(currentItem.id);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, isFlipped, deck, currentItem, soundEffectsEnabled]);

  if (!currentItem || deck.length === 0) {
    return null;
  }

  const learned = isLearned(currentItem.id);
  const difficult = isDifficult(currentItem.id);
  const favorite = isFavorite(currentItem.id);
  const categoryIcon = CATEGORY_ICONS[currentItem.category] || '📖';

  return (
    <div id={id} className="w-full max-w-xl mx-auto flex flex-col items-center">
      {/* Top Deck Controls & Index counter */}
      <div className="w-full flex items-center justify-between mb-4 px-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            Card {currentIndex + 1} of {deck.length}
          </span>
          <span className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            <span>{categoryIcon}</span>
            <span>{currentItem.category}</span>
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleShuffle}
            title="Shuffle cards"
            aria-label="Shuffle cards"
            className="p-2 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-xs flex items-center gap-1 font-medium"
          >
            <Shuffle size={15} />
            <span className="hidden sm:inline">Shuffle</span>
          </button>
        </div>
      </div>

      {/* 3D Flip Card Container */}
      <div 
        className="w-full h-80 sm:h-96 perspective-1000 cursor-pointer select-none"
        onClick={handleFlip}
      >
        <div
          className={`relative w-full h-full duration-500 transform-style-3d transition-transform ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
        >
          {/* FRONT OF CARD */}
          <div
            className={`absolute inset-0 w-full h-full rounded-3xl p-6 sm:p-8 flex flex-col justify-between backface-hidden border shadow-lg transition-all ${
              learned
                ? 'bg-gradient-to-b from-white to-emerald-50/40 dark:from-slate-900 dark:to-emerald-950/20 border-emerald-200 dark:border-emerald-800/60 ring-2 ring-emerald-500/10'
                : difficult
                ? 'bg-gradient-to-b from-white to-amber-50/40 dark:from-slate-900 dark:to-amber-950/20 border-amber-200 dark:border-amber-800/60 ring-2 ring-amber-500/10'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700'
            }`}
          >
            {/* Front Header */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-3 py-1 rounded-full border border-indigo-100 dark:border-indigo-900">
                Front • Foreign Word
              </span>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(currentItem.id);
                  }}
                  title={favorite ? 'Favorited' : 'Favorite'}
                  className="p-2 rounded-full text-slate-400 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <Star size={18} className={favorite ? 'fill-amber-400 text-amber-500' : ''} />
                </button>
              </div>
            </div>

            {/* Front Center Content */}
            <div className="text-center my-auto flex flex-col items-center">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-heading text-slate-900 dark:text-slate-100 tracking-tight mb-3">
                {currentItem.text}
              </h2>
              
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-mono text-sm sm:text-base">
                <span>/{currentItem.pronunciation}/</span>
                <AudioButton text={currentItem.text} size="sm" variant="ghost" />
              </div>
            </div>

            {/* Front Footer */}
            <div className="flex items-center justify-between text-xs text-slate-400 dark:text-slate-500 pt-3 border-t border-slate-100 dark:border-slate-800/80">
              <span className="flex items-center gap-1 font-medium text-indigo-600 dark:text-indigo-400">
                <Eye size={14} /> Click or Space to reveal
              </span>
              <span className="hidden sm:inline">Use ← / → keys to navigate</span>
            </div>
          </div>

          {/* BACK OF CARD */}
          <div
            className={`absolute inset-0 w-full h-full rounded-3xl p-6 sm:p-8 flex flex-col justify-between backface-hidden rotate-y-180 border shadow-lg ${
              learned
                ? 'bg-gradient-to-b from-white to-emerald-50/50 dark:from-slate-900 dark:to-emerald-950/30 border-emerald-300 dark:border-emerald-700'
                : 'bg-white dark:bg-slate-900 border-indigo-200 dark:border-indigo-900/60 ring-2 ring-indigo-500/10'
            }`}
          >
            {/* Back Header */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-100 dark:border-emerald-900">
                Back • English Meaning
              </span>

              <div className="flex items-center gap-2">
                <AudioButton text={currentItem.text} size="sm" variant="secondary" />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(currentItem.id);
                  }}
                  title={favorite ? 'Favorited' : 'Favorite'}
                  className="p-1.5 rounded-full text-slate-400 hover:text-amber-500"
                >
                  <Star size={18} className={favorite ? 'fill-amber-400 text-amber-500' : ''} />
                </button>
              </div>
            </div>

            {/* Back Center Content */}
            <div className="my-auto text-center flex flex-col items-center">
              <h3 className="text-2xl sm:text-3xl font-bold font-heading text-slate-900 dark:text-slate-100 mb-2">
                {currentItem.translation}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-4">
                Original: <span className="font-semibold text-slate-700 dark:text-slate-300">{currentItem.text}</span>
              </p>

              {/* Example sentence */}
              {currentItem.exampleSentence && (
                <div className="w-full max-w-md p-3 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 text-left">
                  <div className="text-xs font-semibold text-indigo-700 dark:text-indigo-300 mb-0.5">
                    Example: {currentItem.exampleSentence}
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400 italic">
                    "{currentItem.exampleTranslation}"
                  </div>
                </div>
              )}
            </div>

            {/* Back Footer Quick Status Toggles */}
            <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-100 dark:border-slate-800/80">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleDifficult(currentItem.id);
                }}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  difficult
                    ? 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200 border border-amber-300'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-amber-50 hover:text-amber-700'
                }`}
              >
                <AlertCircle size={14} />
                <span>{difficult ? 'Needs Practice' : 'Hard'}</span>
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleLearned(currentItem.id);
                }}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  learned
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-emerald-600 hover:text-white'
                }`}
              >
                <Check size={14} className={learned ? 'stroke-[3]' : ''} />
                <span>{learned ? 'Learned' : 'Mark Learned'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Flashcard Navigation Controls */}
      <div className="w-full flex items-center justify-between gap-3 mt-6">
        <button
          type="button"
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-2xs active:scale-95"
        >
          <ChevronLeft size={18} />
          <span>Previous</span>
        </button>

        <button
          type="button"
          onClick={handleFlip}
          className="px-5 py-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 font-semibold text-sm hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-all active:scale-95 flex items-center gap-1.5 shadow-2xs"
        >
          <RotateCw size={16} />
          <span>{isFlipped ? 'Show Front' : 'Show Answer'}</span>
        </button>

        <button
          type="button"
          onClick={handleNext}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition-all shadow-xs active:scale-95"
        >
          <span>{currentIndex === deck.length - 1 ? 'Finish' : 'Next'}</span>
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Progress Dots / Bar */}
      <div className="w-full mt-4">
        <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-indigo-600 dark:bg-indigo-500 rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / deck.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};
