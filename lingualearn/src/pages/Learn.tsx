import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Grid, 
  List, 
  Check, 
  AlertCircle, 
  Star, 
  Layers, 
  BookOpen, 
  X, 
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { useLearning } from '../context/LearningContext';
import { CATEGORIES, CATEGORY_ICONS } from '../data/vocabulary';
import { LANGUAGES } from '../data/languages';
import { VocabularyCard } from '../components/vocabulary/VocabularyCard';
import { EmptyState } from '../components/common/EmptyState';
import { Category, PageId } from '../types';

interface LearnProps {
  initialCategory?: Category | 'All';
  onNavigate: (page: PageId) => void;
}

type StatusFilter = 'all' | 'unlearned' | 'learned' | 'difficult' | 'favorites';

export const Learn: React.FC<LearnProps> = ({ initialCategory = 'All', onNavigate }) => {
  const { 
    selectedLanguage, 
    currentLanguageVocabulary, 
    isLearned, 
    isDifficult, 
    isFavorite,
    learnedCount,
    difficultCount,
    favoriteCount,
    totalWordsCount
  } = useLearning();

  const currentLang = LANGUAGES[selectedLanguage];

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>(initialCategory);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [layout, setLayout] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);

  // Filtered list
  const filteredVocabulary = useMemo(() => {
    return currentLanguageVocabulary.filter(item => {
      // Category filter
      if (selectedCategory !== 'All' && item.category !== selectedCategory) {
        return false;
      }

      // Status filter
      if (statusFilter === 'learned' && !isLearned(item.id)) return false;
      if (statusFilter === 'unlearned' && isLearned(item.id)) return false;
      if (statusFilter === 'difficult' && !isDifficult(item.id)) return false;
      if (statusFilter === 'favorites' && !isFavorite(item.id)) return false;

      // Search Query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const textMatch = item.text.toLowerCase().includes(q);
        const translMatch = item.translation.toLowerCase().includes(q);
        const pronMatch = item.pronunciation.toLowerCase().includes(q);
        const exMatch = item.exampleSentence?.toLowerCase().includes(q);
        return textMatch || translMatch || pronMatch || exMatch;
      }

      return true;
    });
  }, [currentLanguageVocabulary, selectedCategory, statusFilter, searchQuery, isLearned, isDifficult, isFavorite]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setStatusFilter('all');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl leading-none">{currentLang.flag}</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900 dark:text-slate-100 tracking-tight">
              {currentLang.name} Vocabulary Browser
            </h1>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Explore and master all {totalWordsCount} vocabulary words, audio pronunciation, and real sentences.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onNavigate('flashcards')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-xs transition-all active:scale-95"
          >
            <Layers size={16} />
            <span>Practice in Flashcards</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="p-4 sm:p-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-4">
        {/* Search Input and View Switcher */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search ${currentLang.name} word, English translation, or pronunciation...`}
              className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
            {/* View Mode Toggle */}
            <div className="flex items-center p-1 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60">
              <button
                type="button"
                onClick={() => setLayout('grid')}
                title="Grid View"
                aria-label="Grid View"
                className={`p-1.5 rounded-lg transition-colors ${
                  layout === 'grid'
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs'
                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                }`}
              >
                <Grid size={18} />
              </button>
              <button
                type="button"
                onClick={() => setLayout('list')}
                title="List View"
                aria-label="List View"
                className={`p-1.5 rounded-lg transition-colors ${
                  layout === 'list'
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs'
                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                }`}
              >
                <List size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Status Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
          <span className="text-slate-400 dark:text-slate-500 font-medium whitespace-nowrap mr-1 flex items-center gap-1">
            <Filter size={14} /> Status:
          </span>

          <button
            type="button"
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-colors ${
              statusFilter === 'all'
                ? 'bg-indigo-600 text-white shadow-2xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            All Words ({totalWordsCount})
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter('learned')}
            className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              statusFilter === 'learned'
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-emerald-50 hover:text-emerald-700'
            }`}
          >
            <Check size={14} />
            <span>Learned ({learnedCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter('difficult')}
            className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              statusFilter === 'difficult'
                ? 'bg-amber-500 text-white shadow-2xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-amber-50 hover:text-amber-700'
            }`}
          >
            <AlertCircle size={14} />
            <span>Needs Practice ({difficultCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter('favorites')}
            className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              statusFilter === 'favorites'
                ? 'bg-amber-500 text-white shadow-2xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-amber-50 hover:text-amber-700'
            }`}
          >
            <Star size={14} />
            <span>Favorites ({favoriteCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter('unlearned')}
            className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-colors ${
              statusFilter === 'unlearned'
                ? 'bg-indigo-600 text-white shadow-2xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            Unlearned ({totalWordsCount - learnedCount})
          </button>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs border-t border-slate-100 dark:border-slate-800/80 pt-3">
          <span className="text-slate-400 dark:text-slate-500 font-medium whitespace-nowrap mr-1">
            Category:
          </span>

          <button
            type="button"
            onClick={() => setSelectedCategory('All')}
            className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-colors ${
              selectedCategory === 'All'
                ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            All Categories
          </button>

          {CATEGORIES.map((category) => {
            const isSelected = selectedCategory === category;
            const icon = CATEGORY_ICONS[category];
            return (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                <span>{icon}</span>
                <span>{category}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Header Count */}
      <div className="flex items-center justify-between px-1">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Showing {filteredVocabulary.length} of {totalWordsCount} words
        </span>

        {(searchQuery || selectedCategory !== 'All' || statusFilter !== 'all') && (
          <button
            type="button"
            onClick={clearFilters}
            className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-semibold"
          >
            <RotateCcw size={12} />
            <span>Reset Filters</span>
          </button>
        )}
      </div>

      {/* Vocabulary Cards Grid or List */}
      {filteredVocabulary.length > 0 ? (
        <div
          className={
            layout === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
              : 'space-y-3'
          }
        >
          {filteredVocabulary.map((item) => (
            <VocabularyCard key={item.id} item={item} layout={layout} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No vocabulary matches your search"
          description="Try clearing your search query or selecting a different category or status filter."
          actionLabel="Clear Filters"
          onAction={clearFilters}
        />
      )}
    </div>
  );
};
