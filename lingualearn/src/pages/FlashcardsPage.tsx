import React, { useState, useMemo } from 'react';
import { 
  Layers, 
  Sparkles, 
  RotateCcw, 
  HelpCircle, 
  Filter, 
  CheckCircle2, 
  Star, 
  AlertCircle,
  BookOpen
} from 'lucide-react';
import { useLearning } from '../context/LearningContext';
import { CATEGORIES, CATEGORY_ICONS } from '../data/vocabulary';
import { LANGUAGES } from '../data/languages';
import { Flashcard } from '../components/flashcards/Flashcard';
import { EmptyState } from '../components/common/EmptyState';
import { Category, PageId, VocabularyItem } from '../types';

interface FlashcardsPageProps {
  onNavigate: (page: PageId) => void;
}

type DeckFilter = 'all' | 'difficult' | 'favorites' | Category;

export const FlashcardsPage: React.FC<FlashcardsPageProps> = ({ onNavigate }) => {
  const { 
    selectedLanguage, 
    currentLanguageVocabulary, 
    difficultVocabulary, 
    favoriteVocabulary,
    learnedCount,
    totalWordsCount
  } = useLearning();

  const currentLang = LANGUAGES[selectedLanguage];
  const [deckFilter, setDeckFilter] = useState<DeckFilter>('all');
  const [isCompleted, setIsCompleted] = useState(false);
  const [deckKey, setDeckKey] = useState(0); // to force re-render when restarting

  const activeDeckItems = useMemo(() => {
    if (deckFilter === 'difficult') {
      return difficultVocabulary;
    }
    if (deckFilter === 'favorites') {
      return favoriteVocabulary;
    }
    if (deckFilter !== 'all') {
      return currentLanguageVocabulary.filter(item => item.category === deckFilter);
    }
    return currentLanguageVocabulary;
  }, [deckFilter, currentLanguageVocabulary, difficultVocabulary, favoriteVocabulary]);

  const handleDeckChange = (filter: DeckFilter) => {
    setDeckFilter(filter);
    setIsCompleted(false);
    setDeckKey(prev => prev + 1);
  };

  const handleRestartDeck = () => {
    setIsCompleted(false);
    setDeckKey(prev => prev + 1);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl leading-none">{currentLang.flag}</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900 dark:text-slate-100 tracking-tight">
              Interactive Flashcards
            </h1>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Flip cards to test memory retention. Use Space to flip, Arrow keys to navigate.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onNavigate('quiz')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-sm font-semibold transition-all"
          >
            <HelpCircle size={16} />
            <span>Switch to Quiz Mode</span>
          </button>
        </div>
      </div>

      {/* Deck Selector Tabs */}
      <div className="p-4 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
          <span className="text-slate-400 dark:text-slate-500 font-medium whitespace-nowrap mr-1">
            Choose Deck:
          </span>

          <button
            type="button"
            onClick={() => handleDeckChange('all')}
            className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-colors ${
              deckFilter === 'all'
                ? 'bg-indigo-600 text-white shadow-2xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            All Words ({currentLanguageVocabulary.length})
          </button>

          <button
            type="button"
            onClick={() => handleDeckChange('difficult')}
            className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              deckFilter === 'difficult'
                ? 'bg-amber-500 text-white shadow-2xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-amber-50 hover:text-amber-700'
            }`}
          >
            <AlertCircle size={14} />
            <span>Needs Practice ({difficultVocabulary.length})</span>
          </button>

          <button
            type="button"
            onClick={() => handleDeckChange('favorites')}
            className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              deckFilter === 'favorites'
                ? 'bg-amber-500 text-white shadow-2xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-amber-50 hover:text-amber-700'
            }`}
          >
            <Star size={14} />
            <span>Favorites ({favoriteVocabulary.length})</span>
          </button>

          {CATEGORIES.map((category) => {
            const count = currentLanguageVocabulary.filter(v => v.category === category).length;
            const icon = CATEGORY_ICONS[category];
            const isSelected = deckFilter === category;

            return (
              <button
                key={category}
                type="button"
                onClick={() => handleDeckChange(category)}
                className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                <span>{icon}</span>
                <span>{category} ({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Flashcard Stage */}
      {activeDeckItems.length > 0 ? (
        isCompleted ? (
          <div className="w-full max-w-xl mx-auto rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 text-center shadow-xl animate-in fade-in duration-300">
            <div className="mx-auto h-20 w-20 rounded-3xl bg-gradient-to-tr from-indigo-600 to-emerald-500 text-white flex items-center justify-center shadow-md mb-4">
              <CheckCircle2 size={40} />
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900 dark:text-slate-100">
              Deck Completed! 🎉
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-md mx-auto">
              You reviewed all {activeDeckItems.length} flashcards in this set. Active recall is the fastest path to long-term memory!
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
              <button
                type="button"
                onClick={handleRestartDeck}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-xs transition-all active:scale-95"
              >
                <RotateCcw size={16} />
                <span>Review Deck Again</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigate('quiz')}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-700/80 transition-all active:scale-95"
              >
                <HelpCircle size={16} />
                <span>Take a Quiz</span>
              </button>
            </div>
          </div>
        ) : (
          <Flashcard
            key={deckKey}
            items={activeDeckItems}
            onComplete={() => setIsCompleted(true)}
          />
        )
      ) : (
        <EmptyState
          title={`No words in "${deckFilter}" deck`}
          description={
            deckFilter === 'favorites'
              ? 'You have not added any vocabulary to your favorites yet. Star words to study them here.'
              : deckFilter === 'difficult'
              ? 'No words currently marked as difficult. Mark challenging words during practice!'
              : 'There are no items matching this category.'
          }
          actionLabel="Browse Vocabulary"
          onAction={() => onNavigate('learn')}
        />
      )}
    </div>
  );
};
