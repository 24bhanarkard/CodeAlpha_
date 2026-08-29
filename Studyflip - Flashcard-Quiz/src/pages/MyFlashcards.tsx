import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  AlertCircle,
  CheckCircle2,
  Tag,
  LayoutGrid,
  List as ListIcon,
  SlidersHorizontal,
  Volume2,
  ExternalLink,
  BookOpen,
} from 'lucide-react';
import { FlashcardItem, Difficulty } from '../types';
import { speakText } from '../utils/helpers';

interface MyFlashcardsProps {
  cards: FlashcardItem[];
  onAddCardClick: () => void;
  onEditCard: (card: FlashcardItem) => void;
  onDeleteCard: (card: FlashcardItem) => void;
  onToggleDifficulty: (id: string) => void;
  onStudyCard: (card: FlashcardItem) => void;
}

export const MyFlashcards: React.FC<MyFlashcardsProps> = ({
  cards,
  onAddCardClick,
  onEditCard,
  onDeleteCard,
  onToggleDifficulty,
  onStudyCard,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'all' | Difficulty>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'alphabetical' | 'difficulty'>('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Extract all available categories from the cards
  const categories = useMemo(() => {
    const set = new Set<string>();
    cards.forEach((c) => {
      if (c.category) set.add(c.category);
    });
    return Array.from(set);
  }, [cards]);

  // Filter and sort cards
  const filteredCards = useMemo(() => {
    return cards
      .filter((card) => {
        // Search matching question, answer, category
        const query = searchQuery.toLowerCase().trim();
        const matchesQuery =
          !query ||
          card.question.toLowerCase().includes(query) ||
          card.answer.toLowerCase().includes(query) ||
          (card.category && card.category.toLowerCase().includes(query));

        // Difficulty filtering
        const matchesDifficulty =
          selectedDifficulty === 'all' || card.difficulty === selectedDifficulty;

        // Category filtering
        const matchesCategory =
          selectedCategory === 'all' || card.category === selectedCategory;

        return matchesQuery && matchesDifficulty && matchesCategory;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') return (b.createdAt || 0) - (a.createdAt || 0);
        if (sortBy === 'oldest') return (a.createdAt || 0) - (b.createdAt || 0);
        if (sortBy === 'alphabetical') return a.question.localeCompare(b.question);
        if (sortBy === 'difficulty') {
          if (a.difficulty === 'needs-practice' && b.difficulty !== 'needs-practice') return -1;
          if (a.difficulty !== 'needs-practice' && b.difficulty === 'needs-practice') return 1;
          return 0;
        }
        return 0;
      });
  }, [cards, searchQuery, selectedDifficulty, selectedCategory, sortBy]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Flashcard Library
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Showing {filteredCards.length} of {cards.length} cards
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* View Toggle */}
          <div className="flex items-center p-1 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'grid'
                  ? 'bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 font-bold'
                  : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
              title="Grid View"
              aria-label="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'table'
                  ? 'bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 font-bold'
                  : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
              title="Table View"
              aria-label="Table View"
            >
              <ListIcon className="w-4 h-4" />
            </button>
          </div>

          {/* Add Flashcard Button */}
          <button
            id="btn-add-flashcard-library"
            onClick={onAddCardClick}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Flashcard</span>
          </button>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        {/* Search input */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            id="search-flashcards-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by question, answer, or category..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
        </div>

        {/* Filter Pills and Sort Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
          {/* Difficulty filter tabs */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 mr-1">
              Filter:
            </span>
            <button
              onClick={() => setSelectedDifficulty('all')}
              className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                selectedDifficulty === 'all'
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
              }`}
            >
              All ({cards.length})
            </button>
            <button
              onClick={() => setSelectedDifficulty('needs-practice')}
              className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                selectedDifficulty === 'needs-practice'
                  ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                  : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/60'
              }`}
            >
              Needs Practice ({cards.filter((c) => c.difficulty === 'needs-practice').length})
            </button>
            <button
              onClick={() => setSelectedDifficulty('normal')}
              className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                selectedDifficulty === 'normal'
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                  : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60'
              }`}
            >
              Mastered ({cards.filter((c) => c.difficulty === 'normal').length})
            </button>
          </div>

          {/* Category & Sort controls */}
          <div className="flex items-center gap-2.5 flex-wrap">
            {categories.length > 0 && (
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300 focus:outline-hidden"
              >
                <option value="all">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            )}

            <div className="flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300 focus:outline-hidden"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="alphabetical">Question (A-Z)</option>
                <option value="difficulty">Needs Practice First</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Flashcard List or Empty State */}
      {filteredCards.length === 0 ? (
        <div className="py-16 text-center bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 p-8">
          <BookOpen className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-1">
            No Flashcards Found
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-5">
            {searchQuery
              ? `No flashcards matched "${searchQuery}". Try a different keyword or reset filters.`
              : 'Your flashcard collection is empty.'}
          </p>
          {searchQuery ? (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedDifficulty('all');
                setSelectedCategory('all');
              }}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition-colors"
            >
              Clear All Filters
            </button>
          ) : (
            <button
              onClick={onAddCardClick}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-indigo-600 text-white shadow-md hover:bg-indigo-700 transition-all"
            >
              <Plus className="w-4 h-4" />
              Add First Card
            </button>
          )}
        </div>
      ) : viewMode === 'grid' ? (
        /* GRID VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredCards.map((card) => {
            const isDifficult = card.difficulty === 'needs-practice';
            return (
              <div
                key={card.id}
                className="group relative p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md hover:border-indigo-200 dark:hover:border-indigo-900/60 transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  {/* Card Header Badges */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {card.category && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[11px] font-medium">
                          <Tag className="w-3 h-3 opacity-60" />
                          {card.category}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => onToggleDifficulty(card.id)}
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border transition-all ${
                        isDifficult
                          ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                          : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                      }`}
                    >
                      {isDifficult ? (
                        <>
                          <AlertCircle className="w-3 h-3 text-amber-500" />
                          Needs Practice
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                          Mastered
                        </>
                      )}
                    </button>
                  </div>

                  {/* Question */}
                  <div className="mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                      Question
                    </span>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white line-clamp-2 mt-0.5">
                      {card.question}
                    </h3>
                  </div>

                  {/* Answer Preview */}
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800/80 mb-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
                      Answer
                    </span>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
                      {card.answer}
                    </p>
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => onStudyCard(card)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Study in Viewer
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => speakText(card.question)}
                      title="Read question"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onEditCard(card)}
                      title="Edit card"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-slate-800 transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDeleteCard(card)}
                      title="Delete card"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-800 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* TABLE / LIST VIEW */
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <th className="py-3.5 px-4">Question</th>
                  <th className="py-3.5 px-4 hidden sm:table-cell">Answer Preview</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                {filteredCards.map((card) => (
                  <tr key={card.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white max-w-xs truncate">
                      {card.question}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400 hidden sm:table-cell max-w-sm truncate">
                      {card.answer}
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => onToggleDifficulty(card.id)}
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                          card.difficulty === 'needs-practice'
                            ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800'
                            : 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800'
                        }`}
                      >
                        {card.difficulty === 'needs-practice' ? 'Needs Practice' : 'Mastered'}
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => onStudyCard(card)}
                          title="Study"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-slate-800 transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onEditCard(card)}
                          title="Edit"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-slate-800 transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeleteCard(card)}
                          title="Delete"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-800 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
