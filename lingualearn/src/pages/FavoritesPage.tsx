import React, { useState, useMemo } from 'react';
import { 
  Star, 
  Layers, 
  HelpCircle, 
  Trash2, 
  Search, 
  Sparkles,
  BookOpen,
  ArrowRight
} from 'lucide-react';
import { useLearning } from '../context/LearningContext';
import { LANGUAGES } from '../data/languages';
import { VocabularyCard } from '../components/vocabulary/VocabularyCard';
import { EmptyState } from '../components/common/EmptyState';
import { Modal } from '../components/common/Modal';
import { PageId } from '../types';

interface FavoritesPageProps {
  onNavigate: (page: PageId) => void;
}

export const FavoritesPage: React.FC<FavoritesPageProps> = ({ onNavigate }) => {
  const { 
    selectedLanguage, 
    favoriteVocabulary, 
    resetFavorites 
  } = useLearning();

  const currentLang = LANGUAGES[selectedLanguage];
  const [searchQuery, setSearchQuery] = useState('');
  const [showClearModal, setShowClearModal] = useState(false);

  const filteredFavorites = useMemo(() => {
    if (!searchQuery.trim()) return favoriteVocabulary;
    const q = searchQuery.toLowerCase();
    return favoriteVocabulary.filter(
      item => 
        item.text.toLowerCase().includes(q) ||
        item.translation.toLowerCase().includes(q) ||
        item.pronunciation.toLowerCase().includes(q)
    );
  }, [favoriteVocabulary, searchQuery]);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl leading-none">{currentLang.flag}</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900 dark:text-slate-100 tracking-tight">
              Starred Favorites ({favoriteVocabulary.length})
            </h1>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Your personalized collection of bookmarked {currentLang.name} vocabulary.
          </p>
        </div>

        {favoriteVocabulary.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => onNavigate('flashcards')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold shadow-xs transition-all active:scale-95"
            >
              <Layers size={16} />
              <span>Practice in Flashcards</span>
            </button>

            <button
              type="button"
              onClick={() => setShowClearModal(true)}
              className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 border border-slate-200 dark:border-slate-800 transition-colors"
              title="Clear all favorites"
              aria-label="Clear all favorites"
            >
              <Trash2 size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Main Content */}
      {favoriteVocabulary.length > 0 ? (
        <div className="space-y-4">
          {/* Search bar if many favorites */}
          {favoriteVocabulary.length > 3 && (
            <div className="relative w-full max-w-md">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search favorite words..."
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          )}

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredFavorites.map((item) => (
              <VocabularyCard key={item.id} item={item} layout="grid" />
            ))}
          </div>
        </div>
      ) : (
        <EmptyState
          icon={Star}
          title="No favorite words yet"
          description={`You haven't saved any ${currentLang.name} words to your favorites list. Star words in the vocabulary browser or flashcards to access them quickly here.`}
          actionLabel="Explore Vocabulary"
          onAction={() => onNavigate('learn')}
        />
      )}

      {/* Clear Favorites Modal */}
      <Modal
        isOpen={showClearModal}
        onClose={() => setShowClearModal(false)}
        title="Clear All Favorites?"
        description={`This will unstar all favorite words in ${currentLang.name}. This action cannot be undone.`}
        type="danger"
        confirmLabel="Clear Favorites"
        onConfirm={() => resetFavorites(true)}
      />
    </div>
  );
};
