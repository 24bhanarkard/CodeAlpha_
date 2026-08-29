import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Trophy, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  Layers, 
  BookOpen,
  ArrowRight,
  Sparkles,
  Flame
} from 'lucide-react';
import { QuizQuestion, PageId } from '../../types';
import { useLearning } from '../../context/LearningContext';

interface QuizAnswerReview {
  question: QuizQuestion;
  selectedAnswer: string;
  isCorrect: boolean;
}

interface QuizResultsProps {
  score: number;
  totalQuestions: number;
  reviews: QuizAnswerReview[];
  onRestart: () => void;
  onNavigate: (page: PageId) => void;
  id?: string;
}

export const QuizResults: React.FC<QuizResultsProps> = ({
  score,
  totalQuestions,
  reviews,
  onRestart,
  onNavigate,
  id,
}) => {
  const percentage = Math.round((score / totalQuestions) * 100);
  const incorrectCount = totalQuestions - score;

  useEffect(() => {
    if (percentage >= 70) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // ignore
      }
    }
  }, [percentage]);

  const getFeedbackBadge = () => {
    if (percentage === 100) return { title: 'Perfect Score! 🌟', desc: 'Flawless performance! You have mastered these words.' };
    if (percentage >= 80) return { title: 'Great Job! 🎉', desc: 'Outstanding knowledge! You are making rapid progress.' };
    if (percentage >= 60) return { title: 'Good Effort! 👍', desc: 'You are on the right track. A quick review will make it stick.' };
    return { title: 'Keep Practicing! 💪', desc: 'Language learning takes consistency. Review missed words and try again!' };
  };

  const feedback = getFeedbackBadge();

  return (
    <div id={id} className="w-full max-w-2xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Primary Results Card */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 text-center shadow-xl">
        <div className="mx-auto h-20 w-20 rounded-3xl bg-gradient-to-tr from-amber-400 to-orange-500 text-white flex items-center justify-center shadow-md mb-4">
          <Trophy size={40} />
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900 dark:text-slate-100">
          {feedback.title}
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
          {feedback.desc}
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 my-6">
          <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900">
            <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">Score</span>
            <div className="text-2xl sm:text-3xl font-extrabold font-heading text-indigo-700 dark:text-indigo-300 mt-0.5">
              {score}/{totalQuestions}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900">
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Accuracy</span>
            <div className="text-2xl sm:text-3xl font-extrabold font-heading text-emerald-700 dark:text-emerald-300 mt-0.5">
              {percentage}%
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Missed</span>
            <div className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-700 dark:text-slate-300 mt-0.5">
              {incorrectCount}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={onRestart}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-xs transition-all active:scale-95"
          >
            <RotateCcw size={16} />
            <span>Restart Quiz</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('flashcards')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-700/80 transition-all active:scale-95"
          >
            <Layers size={16} />
            <span>Study Flashcards</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('dashboard')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-semibold transition-all"
          >
            <BookOpen size={16} />
            <span>Dashboard</span>
          </button>
        </div>
      </div>

      {/* Answer Review Section */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm">
        <h3 className="text-lg font-bold font-heading text-slate-900 dark:text-slate-100 mb-4 flex items-center justify-between">
          <span>Question Review</span>
          <span className="text-xs text-slate-400 font-normal">
            {score} correct • {incorrectCount} incorrect
          </span>
        </h3>

        <div className="space-y-3">
          {reviews.map((rev, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-2xl border ${
                rev.isCorrect
                  ? 'border-emerald-100 dark:border-emerald-950 bg-emerald-50/30 dark:bg-emerald-950/20'
                  : 'border-red-100 dark:border-red-950 bg-red-50/30 dark:bg-red-950/20'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2.5">
                  <div className="mt-0.5 shrink-0">
                    {rev.isCorrect ? (
                      <CheckCircle2 size={18} className="text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <XCircle size={18} className="text-red-500" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      {rev.question.prompt}
                    </h4>
                    <div className="mt-1.5 space-y-0.5 text-xs">
                      {!rev.isCorrect && (
                        <div className="text-red-600 dark:text-red-400">
                          Your answer: <span className="font-semibold">{rev.selectedAnswer}</span>
                        </div>
                      )}
                      <div className="text-emerald-700 dark:text-emerald-400 font-medium">
                        Correct answer: <span className="font-bold">{rev.question.correctAnswer}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
