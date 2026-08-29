import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  CalendarCheck, 
  Flame, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  RotateCcw, 
  Award,
  Layers,
  BookOpen
} from 'lucide-react';
import { useLearning } from '../context/LearningContext';
import { LANGUAGES } from '../data/languages';
import { Flashcard } from '../components/flashcards/Flashcard';
import { VocabularyCard } from '../components/vocabulary/VocabularyCard';
import { EmptyState } from '../components/common/EmptyState';
import { PageId } from '../types';

interface DailyPracticePageProps {
  onNavigate: (page: PageId) => void;
}

export const DailyPracticePage: React.FC<DailyPracticePageProps> = ({ onNavigate }) => {
  const { 
    selectedLanguage, 
    dailyPractice, 
    dailyPracticeItems, 
    completeDailyPracticeItem,
    markDailyPracticeComplete,
    state 
  } = useLearning();

  const currentLang = LANGUAGES[selectedLanguage];
  const [drillMode, setDrillMode] = useState<'flashcards' | 'list'>('flashcards');

  const handleFinishDrill = () => {
    markDailyPracticeComplete();
    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
      });
    } catch {
      // ignore
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl leading-none">{currentLang.flag}</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900 dark:text-slate-100 tracking-tight">
              Daily Practice Routine
            </h1>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Build fluent memory pathways with 5 curated daily words.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 text-xs font-bold shadow-2xs">
            <Flame size={16} className="text-amber-500 fill-amber-500" />
            <span>{state.streak.count} Day Streak</span>
          </div>
        </div>
      </div>

      {/* Daily Banner Status */}
      {dailyPractice.isCompleted ? (
        <div className="rounded-3xl border border-emerald-200 dark:border-emerald-900/60 bg-gradient-to-r from-emerald-500/10 via-white to-teal-500/10 dark:from-emerald-950/40 dark:via-slate-900 dark:to-teal-950/20 p-6 sm:p-8 text-center shadow-md">
          <div className="mx-auto h-16 w-16 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-sm mb-3">
            <Award size={32} />
          </div>
          <h2 className="text-2xl font-bold font-heading text-slate-900 dark:text-slate-100">
            Daily Goal Achieved! 🎯
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto mt-1">
            You completed today's practice set for {currentLang.name}. Your active streak is at <strong className="text-amber-600 dark:text-amber-400">{state.streak.count} days</strong>!
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
            <button
              type="button"
              onClick={() => onNavigate('quiz')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-xs transition-all active:scale-95"
            >
              <span>Test Knowledge in Quiz</span>
              <ArrowRight size={16} />
            </button>

            <button
              type="button"
              onClick={() => onNavigate('dashboard')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-all active:scale-95"
            >
              <span>Back to Dashboard</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="p-4 sm:p-5 rounded-3xl border border-indigo-100 dark:border-indigo-900/60 bg-indigo-50/50 dark:bg-indigo-950/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <CalendarCheck size={22} />
            </div>
            <div>
              <h3 className="text-base font-bold font-heading text-slate-900 dark:text-slate-100">
                Today's 5 Target Words
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Review each flashcard or study the list below to complete your daily routine.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setDrillMode(drillMode === 'flashcards' ? 'list' : 'flashcards')}
              className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              {drillMode === 'flashcards' ? 'Switch to Grid View' : 'Switch to Flashcard View'}
            </button>

            <button
              type="button"
              onClick={handleFinishDrill}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-all active:scale-95"
            >
              <CheckCircle2 size={15} />
              <span>Mark Today Done</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      {dailyPracticeItems.length > 0 ? (
        drillMode === 'flashcards' ? (
          <div className="space-y-6">
            <Flashcard
              items={dailyPracticeItems}
              onComplete={handleFinishDrill}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dailyPracticeItems.map((item) => (
              <VocabularyCard key={item.id} item={item} layout="grid" />
            ))}
          </div>
        )
      ) : (
        <EmptyState
          title="No daily practice items found"
          description="Browse vocabulary to get started with your daily learning goal."
          actionLabel="Explore Vocabulary"
          onAction={() => onNavigate('learn')}
        />
      )}
    </div>
  );
};
