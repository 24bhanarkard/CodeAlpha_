import React from 'react';
import { 
  CheckCircle2, 
  BookOpen, 
  AlertCircle, 
  Star, 
  Trophy, 
  Flame,
  ArrowUpRight 
} from 'lucide-react';
import { useLearning } from '../../context/LearningContext';
import { ProgressBar } from '../common/ProgressBar';
import { LANGUAGES } from '../../data/languages';
import { PageId } from '../../types';

interface ProgressOverviewCardProps {
  onNavigate: (page: PageId) => void;
  id?: string;
}

export const ProgressOverviewCard: React.FC<ProgressOverviewCardProps> = ({
  onNavigate,
  id,
}) => {
  const { 
    selectedLanguage,
    totalWordsCount,
    learnedCount,
    difficultCount,
    favoriteCount,
    learningPercentage,
    averageQuizScore,
    totalQuizzesTaken,
  } = useLearning();

  const wordsRemaining = Math.max(0, totalWordsCount - learnedCount);
  const currentLang = LANGUAGES[selectedLanguage];

  const stats = [
    {
      label: 'Words Learned',
      value: learnedCount,
      total: totalWordsCount,
      icon: CheckCircle2,
      color: 'emerald',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950/40',
      textColor: 'text-emerald-600 dark:text-emerald-400',
      borderColor: 'border-emerald-100 dark:border-emerald-900/60',
      action: () => onNavigate('learn'),
    },
    {
      label: 'Words Remaining',
      value: wordsRemaining,
      icon: BookOpen,
      color: 'indigo',
      bgColor: 'bg-indigo-50 dark:bg-indigo-950/40',
      textColor: 'text-indigo-600 dark:text-indigo-400',
      borderColor: 'border-indigo-100 dark:border-indigo-900/60',
      action: () => onNavigate('flashcards'),
    },
    {
      label: 'Needs Practice',
      value: difficultCount,
      icon: AlertCircle,
      color: 'amber',
      bgColor: 'bg-amber-50 dark:bg-amber-950/40',
      textColor: 'text-amber-600 dark:text-amber-400',
      borderColor: 'border-amber-100 dark:border-amber-900/60',
      action: () => onNavigate('learn'),
    },
    {
      label: 'Quiz Avg. Score',
      value: totalQuizzesTaken > 0 ? `${averageQuizScore}%` : 'N/A',
      icon: Trophy,
      color: 'blue',
      bgColor: 'bg-blue-50 dark:bg-blue-950/40',
      textColor: 'text-blue-600 dark:text-blue-400',
      borderColor: 'border-blue-100 dark:border-blue-900/60',
      action: () => onNavigate('quiz'),
    },
  ];

  return (
    <div id={id} className="space-y-6">
      {/* Big Master Progress Banner */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-2xl leading-none">{currentLang.flag}</span>
              <h2 className="text-lg font-bold font-heading text-slate-900 dark:text-slate-100">
                {currentLang.name} Mastery Progress
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              You have memorized <span className="font-semibold text-slate-700 dark:text-slate-300">{learnedCount}</span> out of <span className="font-semibold text-slate-700 dark:text-slate-300">{totalWordsCount}</span> essential words and phrases.
            </p>

            <div className="pt-2">
              <ProgressBar
                value={learningPercentage}
                size="md"
                color="indigo"
                label="Overall Language Fluency"
                showPercentage={true}
              />
            </div>
          </div>

          {/* Radial / Stat Badge */}
          <div className="flex items-center justify-center sm:justify-start gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 shrink-0">
            <div className="text-center">
              <div className="text-3xl font-extrabold font-heading text-indigo-600 dark:text-indigo-400">
                {learningPercentage}%
              </div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Completion
              </div>
            </div>
            <div className="h-8 w-px bg-slate-200 dark:bg-slate-700" />
            <div className="text-center">
              <div className="text-3xl font-extrabold font-heading text-slate-800 dark:text-slate-200">
                {learnedCount}/{totalWordsCount}
              </div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Learned
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Core Statistics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {stats.map((item, idx) => {
          const Icon = item.icon;
          return (
            <button
              key={idx}
              type="button"
              onClick={item.action}
              className={`p-4 sm:p-5 rounded-2xl border text-left transition-all duration-200 bg-white dark:bg-slate-900 ${item.borderColor} hover:shadow-md hover:-translate-y-0.5 group focus:outline-none`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2.5 rounded-xl ${item.bgColor} ${item.textColor}`}>
                  <Icon size={20} />
                </div>
                <ArrowUpRight size={16} className="text-slate-300 dark:text-slate-600 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900 dark:text-slate-100 tracking-tight">
                {item.value}
              </div>
              <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">
                {item.label}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
