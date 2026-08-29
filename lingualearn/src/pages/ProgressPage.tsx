import React from 'react';
import { 
  BarChart2, 
  Trophy, 
  CheckCircle2, 
  AlertCircle, 
  Layers, 
  Flame, 
  Clock, 
  Calendar,
  BookOpen,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { useLearning } from '../context/LearningContext';
import { LANGUAGES, LANGUAGE_LIST } from '../data/languages';
import { CATEGORIES, CATEGORY_ICONS } from '../data/vocabulary';
import { ProgressBar } from '../components/common/ProgressBar';
import { PageId } from '../types';

interface ProgressPageProps {
  onNavigate: (page: PageId) => void;
}

export const ProgressPage: React.FC<ProgressPageProps> = ({ onNavigate }) => {
  const { 
    selectedLanguage, 
    currentLanguageVocabulary,
    learnedCount, 
    totalWordsCount, 
    learningPercentage,
    difficultCount,
    favoriteCount,
    averageQuizScore,
    totalQuizzesTaken,
    quizHistoryForCurrentLang,
    state
  } = useLearning();

  const currentLang = LANGUAGES[selectedLanguage];
  const wordsRemaining = Math.max(0, totalWordsCount - learnedCount);

  // Category breakdown calculation
  const categoryMastery = CATEGORIES.map((cat) => {
    const totalInCat = currentLanguageVocabulary.filter(v => v.category === cat).length;
    const learnedInCat = currentLanguageVocabulary.filter(
      v => v.category === cat && (state.learnedWords[selectedLanguage] || []).includes(v.id)
    ).length;
    const percentage = totalInCat > 0 ? Math.round((learnedInCat / totalInCat) * 100) : 0;
    return {
      category: cat,
      icon: CATEGORY_ICONS[cat],
      total: totalInCat,
      learned: learnedInCat,
      percentage,
    };
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl leading-none">{currentLang.flag}</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900 dark:text-slate-100 tracking-tight">
              Learning Analytics & Progress
            </h1>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Detailed performance tracking, category mastery, and quiz records for {currentLang.name}.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onNavigate('quiz')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold shadow-xs transition-all active:scale-95"
          >
            <Trophy size={16} />
            <span>Take Proficiency Quiz</span>
          </button>
        </div>
      </div>

      {/* Main Metric Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Words</span>
            <span className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <BookOpen size={16} />
            </span>
          </div>
          <div className="text-3xl font-extrabold font-heading text-slate-900 dark:text-slate-100">
            {totalWordsCount}
          </div>
          <div className="text-xs text-slate-400 dark:text-slate-500 mt-1">
            Curated course vocabulary
          </div>
        </div>

        <div className="p-5 rounded-3xl border border-emerald-100 dark:border-emerald-900/60 bg-emerald-50/20 dark:bg-emerald-950/20 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">Learned Words</span>
            <span className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
              <CheckCircle2 size={16} />
            </span>
          </div>
          <div className="text-3xl font-extrabold font-heading text-emerald-700 dark:text-emerald-400">
            {learnedCount}
          </div>
          <div className="text-xs text-emerald-600/80 dark:text-emerald-400/80 mt-1">
            {learningPercentage}% of target achieved
          </div>
        </div>

        <div className="p-5 rounded-3xl border border-amber-100 dark:border-amber-900/60 bg-amber-50/20 dark:bg-amber-950/20 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-amber-700 dark:text-amber-400">Needs Practice</span>
            <span className="p-2 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300">
              <AlertCircle size={16} />
            </span>
          </div>
          <div className="text-3xl font-extrabold font-heading text-amber-700 dark:text-amber-400">
            {difficultCount}
          </div>
          <div className="text-xs text-amber-600/80 dark:text-amber-400/80 mt-1">
            Challenging items marked
          </div>
        </div>

        <div className="p-5 rounded-3xl border border-blue-100 dark:border-blue-900/60 bg-blue-50/20 dark:bg-blue-950/20 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-blue-700 dark:text-blue-400">Quiz Accuracy</span>
            <span className="p-2 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
              <Trophy size={16} />
            </span>
          </div>
          <div className="text-3xl font-extrabold font-heading text-blue-700 dark:text-blue-400">
            {totalQuizzesTaken > 0 ? `${averageQuizScore}%` : '—'}
          </div>
          <div className="text-xs text-blue-600/80 dark:text-blue-400/80 mt-1">
            Across {totalQuizzesTaken} test attempts
          </div>
        </div>
      </div>

      {/* Category Mastery Breakdown Bars */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-xs space-y-6">
        <div>
          <h2 className="text-xl font-bold font-heading text-slate-900 dark:text-slate-100">
            Mastery by Category
          </h2>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
            Track your strengths and identify topics that need a quick refresher.
          </p>
        </div>

        <div className="space-y-4">
          {categoryMastery.map((cat) => (
            <div key={cat.category} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs sm:text-sm font-medium">
                <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200">
                  <span className="text-base">{cat.icon}</span>
                  <span className="font-semibold">{cat.category}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                  <span>{cat.learned} / {cat.total} words</span>
                  <span className="font-bold text-slate-900 dark:text-slate-100 w-10 text-right">
                    {cat.percentage}%
                  </span>
                </div>
              </div>
              <ProgressBar
                value={cat.percentage}
                size="sm"
                color={cat.percentage === 100 ? 'emerald' : cat.percentage > 50 ? 'indigo' : 'amber'}
                showPercentage={false}
              />
            </div>
          ))}
        </div>
      </div>

      {/* All Languages Progress Overview */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-xs space-y-6">
        <div>
          <h2 className="text-xl font-bold font-heading text-slate-900 dark:text-slate-100">
            Multi-Language Portfolio
          </h2>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
            Your learning footprint across all supported languages.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {LANGUAGE_LIST.map((lang) => {
            const count = (state.learnedWords[lang.id] || []).length;
            const total = 20; // 20 words per language in standard set
            const pct = Math.round((count / total) * 100);

            return (
              <div
                key={lang.id}
                className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{lang.flag}</span>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{lang.name}</h4>
                      <p className="text-[11px] text-slate-400">{lang.nativeName}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">{pct}%</span>
                </div>

                <ProgressBar value={pct} size="sm" showPercentage={false} color="indigo" />

                <div className="text-[11px] text-slate-500 flex justify-between">
                  <span>Learned words</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{count} / {total}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quiz History Log */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold font-heading text-slate-900 dark:text-slate-100">
              Recent Quiz History
            </h2>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              Record of your test sessions in {currentLang.name}
            </p>
          </div>
        </div>

        {quizHistoryForCurrentLang.length > 0 ? (
          <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
            {quizHistoryForCurrentLang.slice(0, 5).map((quiz) => (
              <div key={quiz.id} className="py-3.5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`h-10 w-10 rounded-xl flex items-center justify-center font-bold text-xs ${
                    quiz.percentage >= 80
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : quiz.percentage >= 60
                      ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                  }`}>
                    {quiz.percentage}%
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {quiz.category ? `${quiz.category} Quiz` : 'General Quiz'}
                    </h4>
                    <p className="text-xs text-slate-400 dark:text-slate-500">
                      {new Date(quiz.date).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    {quiz.correctAnswers}/{quiz.totalQuestions} Correct
                  </span>
                  <span className="text-xs text-slate-400 block">
                    {quiz.incorrectAnswers} missed
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-sm text-slate-500 dark:text-slate-400">
            No quiz attempts recorded yet for {currentLang.name}.
          </div>
        )}
      </div>
    </div>
  );
};
