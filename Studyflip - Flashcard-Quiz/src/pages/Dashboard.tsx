import React, { useState, useMemo, useEffect } from 'react';
import {
  Layers,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Sparkles,
  Plus,
  RotateCcw,
  BookOpen,
  HelpCircle,
} from 'lucide-react';
import { FlashcardItem } from '../types';
import { Flashcard } from '../components/Flashcard';
import { ProgressBar } from '../components/ProgressBar';
import { NavigationControls } from '../components/NavigationControls';
import { StatsCard } from '../components/StatsCard';

interface DashboardProps {
  cards: FlashcardItem[];
  activeStudyCardId?: string | null;
  onClearActiveStudyCard?: () => void;
  onAddCardClick: () => void;
  onEditCard: (card: FlashcardItem) => void;
  onDeleteCard: (card: FlashcardItem) => void;
  onToggleDifficulty: (id: string) => void;
  onRestoreDefaults: () => void;
  onStartQuiz: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  cards,
  activeStudyCardId,
  onClearActiveStudyCard,
  onAddCardClick,
  onEditCard,
  onDeleteCard,
  onToggleDifficulty,
  onRestoreDefaults,
  onStartQuiz,
}) => {
  const [deck, setDeck] = useState<FlashcardItem[]>(cards);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Sync deck when master cards change
  useEffect(() => {
    setDeck(cards);
    if (activeStudyCardId) {
      const targetIdx = cards.findIndex((c) => c.id === activeStudyCardId);
      if (targetIdx !== -1) {
        setCurrentIndex(targetIdx);
        setIsFlipped(false);
      }
      onClearActiveStudyCard?.();
    } else if (currentIndex >= cards.length && cards.length > 0) {
      setCurrentIndex(cards.length - 1);
    }
  }, [cards, activeStudyCardId, onClearActiveStudyCard]);

  // Reset flip state when card index changes
  useEffect(() => {
    setIsFlipped(false);
  }, [currentIndex]);

  const currentCard = deck[currentIndex];

  // Stats calculation
  const stats = useMemo(() => {
    const total = cards.length;
    const needsPractice = cards.filter((c) => c.difficulty === 'needs-practice').length;
    const mastered = total - needsPractice;
    const masteryPercent = total > 0 ? Math.round((mastered / total) * 100) : 0;
    return { total, needsPractice, mastered, masteryPercent };
  }, [cards]);

  const needsPracticeIndices = useMemo(() => {
    const set = new Set<number>();
    deck.forEach((c, idx) => {
      if (c.difficulty === 'needs-practice') set.add(idx);
    });
    return set;
  }, [deck]);

  // Navigation handlers
  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < deck.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleShuffle = () => {
    const shuffled = [...deck].sort(() => Math.random() - 0.5);
    setDeck(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const handleResetOrder = () => {
    setDeck([...cards]);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  // Keyboard navigation on Dashboard
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input or textarea or modal is open
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return;
      }

      if (e.key === 'ArrowRight' || e.key === 'j' || e.key === 'J') {
        if (currentIndex < deck.length - 1) {
          handleNext();
        }
      } else if (e.key === 'ArrowLeft' || e.key === 'k' || e.key === 'K') {
        if (currentIndex > 0) {
          handlePrev();
        }
      } else if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        setIsFlipped((prev) => !prev);
      } else if (e.key === 'm' || e.key === 'M') {
        if (currentCard) {
          onToggleDifficulty(currentCard.id);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, deck, currentCard, onToggleDifficulty]);

  if (cards.length === 0) {
    return (
      <div className="py-16 text-center max-w-lg mx-auto bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-8 shadow-sm">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-4">
          <BookOpen className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2">
          Your Flashcard Deck is Empty
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
          Create your first custom flashcard or restore the default Computer Science study set to get started.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onAddCardClick}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Create First Card
          </button>
          <button
            onClick={onRestoreDefaults}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-sm transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            Restore Sample Cards
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* 1. Statistics Bento Grid Section */}
      <section aria-label="Deck Statistics" className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        <StatsCard
          id="stat-total-cards"
          icon={<Layers className="w-5 h-5" />}
          label="Total Cards"
          value={stats.total}
          sublabel="In active study set"
          colorClass="bg-blue-50 text-blue-600 dark:bg-blue-950/70 dark:text-blue-400"
        />
        <StatsCard
          id="stat-mastered-cards"
          icon={<CheckCircle2 className="w-5 h-5" />}
          label="Mastered"
          value={stats.mastered}
          sublabel="Ready for exam"
          colorClass="bg-emerald-50 text-emerald-600 dark:bg-emerald-950/70 dark:text-emerald-400"
        />
        <StatsCard
          id="stat-needs-practice"
          icon={<AlertCircle className="w-5 h-5" />}
          label="Needs Practice"
          value={stats.needsPractice}
          sublabel="Marked for review"
          colorClass="bg-amber-50 text-amber-600 dark:bg-amber-950/70 dark:text-amber-400"
        />
        <StatsCard
          id="stat-mastery-rate"
          icon={<TrendingUp className="w-5 h-5" />}
          label="Mastery Rate"
          value={`${stats.masteryPercent}%`}
          sublabel="Overall deck progress"
          colorClass="bg-purple-50 text-purple-600 dark:bg-purple-950/70 dark:text-purple-400"
        />
      </section>

      {/* 2. Main Flashcard Section */}
      <section aria-label="Flashcard Viewer" className="flex flex-col items-center">
        <div className="w-full max-w-2xl space-y-5">
          {/* Progress Bar & Jump Dots */}
          <ProgressBar
            currentIndex={currentIndex}
            totalCards={deck.length}
            onSelectIndex={(idx) => {
              setCurrentIndex(idx);
              setIsFlipped(false);
            }}
            needsPracticeIndices={needsPracticeIndices}
          />

          {/* Flashcard Component */}
          {currentCard && (
            <Flashcard
              card={currentCard}
              currentIndex={currentIndex}
              totalCards={deck.length}
              isFlipped={isFlipped}
              onFlip={() => setIsFlipped((prev) => !prev)}
              onToggleDifficulty={() => onToggleDifficulty(currentCard.id)}
            />
          )}

          {/* Navigation Controls (Previous, Next, Edit, Delete, Shuffle) */}
          <NavigationControls
            currentIndex={currentIndex}
            totalCards={deck.length}
            onPrev={handlePrev}
            onNext={handleNext}
            onShuffle={handleShuffle}
            onResetOrder={deck.length > 1 ? handleResetOrder : undefined}
            onEditCurrent={currentCard ? () => onEditCard(currentCard) : undefined}
            onDeleteCurrent={currentCard ? () => onDeleteCard(currentCard) : undefined}
          />
        </div>
      </section>

      {/* 3. Study Helper Bento Card */}
      <section className="max-w-2xl mx-auto p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs flex items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Active Recall Mode
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Say the answer out loud before revealing to strengthen memory retention.
            </p>
          </div>
        </div>
        <button
          onClick={onStartQuiz}
          className="shrink-0 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-xs transition-all active:scale-95"
        >
          Quiz Me
        </button>
      </section>
    </div>
  );
};
