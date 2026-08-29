import React, { useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import {
  Trophy,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Volume2,
  Sparkles,
  ArrowRight,
  Flame,
  Filter,
} from 'lucide-react';
import { FlashcardItem } from '../types';
import { speakText } from '../utils/helpers';

interface QuizProps {
  cards: FlashcardItem[];
  onBackToDashboard: () => void;
  onUpdateCardDifficulty: (id: string, difficulty: 'normal' | 'needs-practice') => void;
}

export const Quiz: React.FC<QuizProps> = ({
  cards,
  onBackToDashboard,
  onUpdateCardDifficulty,
}) => {
  const [quizFilter, setQuizFilter] = useState<'all' | 'needs-practice'>('all');
  const [quizCards, setQuizCards] = useState<FlashcardItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState({ known: 0, practice: 0 });
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [struggledCardIds, setStruggledCardIds] = useState<string[]>([]);

  // Initialize randomized quiz set
  const startQuiz = (filterType: 'all' | 'needs-practice' = quizFilter, customCards?: FlashcardItem[]) => {
    let source = customCards || cards;
    if (filterType === 'needs-practice') {
      const difficultOnes = source.filter((c) => c.difficulty === 'needs-practice');
      source = difficultOnes.length > 0 ? difficultOnes : source;
    }

    const shuffled = [...source].sort(() => Math.random() - 0.5);
    setQuizCards(shuffled);
    setCurrentIndex(0);
    setScore({ known: 0, practice: 0 });
    setIsAnswerRevealed(false);
    setIsCompleted(false);
    setStruggledCardIds([]);
  };

  useEffect(() => {
    if (cards.length > 0 && quizCards.length === 0) {
      startQuiz(quizFilter);
    }
  }, [cards]);

  const currentCard = quizCards[currentIndex];

  const handleScore = (type: 'known' | 'practice') => {
    if (!currentCard) return;

    if (type === 'known') {
      setScore((prev) => ({ ...prev, known: prev.known + 1 }));
      onUpdateCardDifficulty(currentCard.id, 'normal');
    } else {
      setScore((prev) => ({ ...prev, practice: prev.practice + 1 }));
      setStruggledCardIds((prev) => [...prev, currentCard.id]);
      onUpdateCardDifficulty(currentCard.id, 'needs-practice');
    }

    if (currentIndex < quizCards.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setIsAnswerRevealed(false);
    } else {
      setIsCompleted(true);
      // Trigger celebratory confetti burst!
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (err) {
        // Safe fallback if canvas not available
      }
    }
  };

  // Keyboard navigation during active quiz
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isCompleted || !currentCard) return;

      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        setIsAnswerRevealed((prev) => !prev);
      } else if (e.key === '1') {
        handleScore('practice');
      } else if (e.key === '2') {
        handleScore('known');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCompleted, currentCard, isAnswerRevealed, currentIndex, quizCards.length]);

  if (cards.length === 0) {
    return (
      <div className="py-16 text-center max-w-md mx-auto bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-8 shadow-sm">
        <HelpCircle className="w-12 h-12 text-indigo-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
          No Flashcards in Deck
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
          Add some flashcards to your deck before launching a quiz session.
        </p>
        <button
          onClick={onBackToDashboard}
          className="px-6 py-2.5 rounded-xl text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition-all"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  // Quiz Completion Screen
  if (isCompleted) {
    const totalAnswered = score.known + score.practice;
    const scorePercent = totalAnswered > 0 ? Math.round((score.known / totalAnswered) * 100) : 0;
    const isMastery = scorePercent >= 80;

    return (
      <div className="max-w-md mx-auto py-6 animate-in zoom-in-95 duration-300">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-xl border border-slate-200/80 dark:border-slate-800 text-center">
          {/* Trophy Avatar */}
          <div className="relative w-20 h-20 bg-gradient-to-tr from-amber-400 to-amber-500 rounded-3xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-amber-500/25 text-white">
            <Trophy className="w-10 h-10" />
            <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-indigo-600 text-white text-[10px] font-black flex items-center justify-center border-2 border-white dark:border-slate-900">
              ✓
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-1">
            Quiz Completed!
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-6">
            {isMastery ? 'Outstanding recall performance! Keep up the momentum.' : 'Great effort! Review the cards you struggled on.'}
          </p>

          {/* Score Badge */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 mb-6">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              Recall Accuracy
            </p>
            <div className="text-4xl font-black text-indigo-600 dark:text-indigo-400 tracking-tight">
              {scorePercent}%
            </div>
          </div>

          {/* Breakdown Stats */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/60 text-left">
              <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 mb-1">
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-xs font-bold">I Knew It</span>
              </div>
              <p className="text-2xl font-black text-emerald-900 dark:text-emerald-100">
                {score.known}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/60 text-left">
              <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 mb-1">
                <AlertCircle className="w-4 h-4" />
                <span className="text-xs font-bold">Needs Practice</span>
              </div>
              <p className="text-2xl font-black text-amber-900 dark:text-amber-100">
                {score.practice}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5">
            {struggledCardIds.length > 0 && (
              <button
                id="btn-retry-struggled"
                onClick={() => {
                  const struggledCards = cards.filter((c) => struggledCardIds.includes(c.id));
                  startQuiz('needs-practice', struggledCards);
                }}
                className="w-full py-3 px-4 rounded-xl text-sm font-bold bg-amber-600 hover:bg-amber-700 text-white shadow-md shadow-amber-500/20 flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <Flame className="w-4 h-4" />
                Practice Struggled Cards ({struggledCardIds.length})
              </button>
            )}

            <button
              id="btn-restart-quiz"
              onClick={() => startQuiz(quizFilter)}
              className="w-full py-3 px-4 rounded-xl text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20 flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <RotateCcw className="w-4 h-4" />
              Restart Full Quiz
            </button>

            <button
              id="btn-quiz-back-home"
              onClick={onBackToDashboard}
              className="w-full py-3 px-4 rounded-xl text-sm font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Active Quiz Question View
  const progressPercent = quizCards.length > 0 ? ((currentIndex + 1) / quizCards.length) * 100 : 0;

  return (
    <div className="max-w-2xl mx-auto py-2 space-y-6 animate-in fade-in duration-300">
      {/* Quiz Top Bar */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            Active Recall Quiz
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Card {currentIndex + 1} of {quizCards.length}
          </p>
        </div>

        {/* Live Score Tally */}
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-bold">
            ✓ {score.known}
          </span>
          <span className="px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-xs font-bold">
            ⚠ {score.practice}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
        <div
          className="bg-indigo-600 h-full transition-all duration-300 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Main Quiz Card Box */}
      {currentCard && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border-2 border-slate-200/80 dark:border-slate-800 shadow-xl p-8 sm:p-12 flex flex-col items-center justify-between min-h-[360px] text-center relative overflow-hidden">
          {/* Top Label */}
          <div className="w-full flex items-center justify-between mb-4">
            <span className="px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold uppercase tracking-wider">
              {isAnswerRevealed ? 'Answer' : 'Question'}
            </span>
            <button
              onClick={() => speakText(isAnswerRevealed ? currentCard.answer : currentCard.question)}
              title="Speak"
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>

          {/* Content Area */}
          <div className="my-auto py-4">
            {!isAnswerRevealed ? (
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-snug">
                {currentCard.question}
              </h3>
            ) : (
              <div className="space-y-3">
                <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Q: {currentCard.question}
                </p>
                <p className="text-xl sm:text-2xl font-medium text-indigo-950 dark:text-indigo-100 leading-relaxed">
                  {currentCard.answer}
                </p>
              </div>
            )}
          </div>

          {/* Bottom Action Area */}
          <div className="w-full pt-6">
            {!isAnswerRevealed ? (
              <button
                id="btn-quiz-reveal-answer"
                onClick={() => setIsAnswerRevealed(true)}
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-lg shadow-indigo-500/25 transition-all active:scale-95"
              >
                Reveal Answer (Space)
              </button>
            ) : (
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-md mx-auto">
                <button
                  id="btn-quiz-struggled"
                  onClick={() => handleScore('practice')}
                  className="w-full sm:flex-1 py-3 px-4 rounded-2xl bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 dark:hover:bg-amber-900/60 text-amber-700 dark:text-amber-300 border-2 border-amber-200 dark:border-amber-800 font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-95 shadow-xs"
                >
                  <AlertCircle className="w-4 h-4" />
                  <span>Needs Practice [1]</span>
                </button>

                <button
                  id="btn-quiz-knew-it"
                  onClick={() => handleScore('known')}
                  className="w-full sm:flex-1 py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md shadow-emerald-600/20"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>I Knew It! [2]</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Quiz Controls & Filters */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2">
        <button
          onClick={onBackToDashboard}
          className="font-semibold text-slate-600 dark:text-slate-300 hover:underline"
        >
          ← Quit Quiz & Return
        </button>

        <span>Press <strong>1</strong> (Needs Practice) or <strong>2</strong> (Knew It)</span>
      </div>
    </div>
  );
};
