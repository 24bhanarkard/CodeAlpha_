import React from 'react';
import { 
  BookOpen, 
  Layers, 
  HelpCircle, 
  Star, 
  ArrowRight, 
  Flame, 
  Sparkles, 
  Globe2,
  TrendingUp,
  Award
} from 'lucide-react';
import { useLearning } from '../context/LearningContext';
import { LANGUAGES } from '../data/languages';
import { CATEGORIES, CATEGORY_ICONS } from '../data/vocabulary';
import { PageId, Category } from '../types';
import { ProgressOverviewCard } from '../components/dashboard/ProgressOverviewCard';
import { DailyPracticeWidget } from '../components/dashboard/DailyPracticeWidget';
import { VocabularyCard } from '../components/vocabulary/VocabularyCard';

interface DashboardProps {
  onNavigate: (page: PageId, category?: Category) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { 
    selectedLanguage, 
    currentLanguageVocabulary, 
    learnedCount, 
    totalWordsCount,
    state 
  } = useLearning();

  const currentLang = LANGUAGES[selectedLanguage];
  const spotlightWords = currentLanguageVocabulary.slice(0, 3);

  const quickActions = [
    {
      title: 'Learn Vocabulary',
      desc: 'Browse, search, and memorize all curated words with audio.',
      icon: BookOpen,
      page: 'learn' as PageId,
      color: 'from-indigo-500 to-indigo-700',
      bgColor: 'bg-indigo-50 dark:bg-indigo-950/50',
      borderColor: 'border-indigo-200 dark:border-indigo-800',
      textColor: 'text-indigo-600 dark:text-indigo-400',
    },
    {
      title: 'Flashcards',
      desc: 'Test your active recall with animated 3D flip study cards.',
      icon: Layers,
      page: 'flashcards' as PageId,
      color: 'from-violet-500 to-purple-700',
      bgColor: 'bg-purple-50 dark:bg-purple-950/50',
      borderColor: 'border-purple-200 dark:border-purple-800',
      textColor: 'text-purple-600 dark:text-purple-400',
    },
    {
      title: 'Take a Quiz',
      desc: 'Challenge yourself with interactive multiple-choice tests.',
      icon: HelpCircle,
      page: 'quiz' as PageId,
      color: 'from-blue-500 to-cyan-700',
      bgColor: 'bg-blue-50 dark:bg-blue-950/50',
      borderColor: 'border-blue-200 dark:border-blue-800',
      textColor: 'text-blue-600 dark:text-blue-400',
    },
    {
      title: 'Saved Favorites',
      desc: 'Review your personalized list of starred terms and phrases.',
      icon: Star,
      page: 'favorites' as PageId,
      color: 'from-amber-500 to-orange-600',
      bgColor: 'bg-amber-50 dark:bg-amber-950/50',
      borderColor: 'border-amber-200 dark:border-amber-800',
      textColor: 'text-amber-600 dark:text-amber-400',
    },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-indigo-200 border border-white/10">
              <Sparkles size={14} className="text-amber-300" />
              <span>Interactive Language Suite</span>
            </div>
            
            <h1 className="text-2xl sm:text-4xl font-extrabold font-heading tracking-tight">
              Welcome back to <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-purple-200 to-pink-300">LinguaLearn</span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Currently mastering <strong className="text-white">{currentLang.name}</strong> ({currentLang.nativeName}) {currentLang.flag}. Consistency is the secret to fluency!
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => onNavigate('daily')}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-slate-900 hover:bg-slate-100 font-bold text-sm shadow-md transition-all active:scale-95"
            >
              <Flame size={18} className="text-amber-500 fill-amber-500" />
              <span>Daily Practice</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('quiz')}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold text-sm backdrop-blur-md transition-all active:scale-95"
            >
              <Award size={18} className="text-indigo-300" />
              <span>Quick Quiz</span>
            </button>
          </div>
        </div>

        {/* Decorative background element */}
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Daily Practice Action Card */}
      <DailyPracticeWidget onNavigate={onNavigate} />

      {/* Progress & Stats Overview */}
      <ProgressOverviewCard onNavigate={onNavigate} />

      {/* Quick Action Hub */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold font-heading text-slate-900 dark:text-slate-100">
            Quick Actions
          </h2>
          <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
            Jump directly into learning
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, idx) => {
            const Icon = action.icon;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => onNavigate(action.page)}
                className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-md transition-all duration-200 text-left flex flex-col justify-between group focus:outline-none"
              >
                <div>
                  <div className={`h-11 w-11 rounded-xl ${action.bgColor} ${action.textColor} flex items-center justify-center mb-4 transition-transform group-hover:scale-105`}>
                    <Icon size={22} />
                  </div>
                  <h3 className="text-base font-bold font-heading text-slate-900 dark:text-slate-100 mb-1">
                    {action.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {action.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-semibold text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1 transition-transform">
                  <span>Start session</span>
                  <ArrowRight size={14} />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Categories Explorer */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold font-heading text-slate-900 dark:text-slate-100">
            Explore Categories
          </h2>
          <button
            type="button"
            onClick={() => onNavigate('learn')}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight size={12} />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
          {CATEGORIES.map((category) => {
            const count = currentLanguageVocabulary.filter(v => v.category === category).length;
            const icon = CATEGORY_ICONS[category];

            return (
              <button
                key={category}
                type="button"
                onClick={() => onNavigate('learn', category)}
                className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-400 dark:hover:border-indigo-600 hover:shadow-xs transition-all text-center group"
              >
                <div className="text-2xl mb-1.5 filter group-hover:scale-110 transition-transform">
                  {icon}
                </div>
                <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                  {category}
                </div>
                <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                  {count} words
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Spotlight Vocabulary Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold font-heading text-slate-900 dark:text-slate-100">
              Vocabulary Spotlight
            </h2>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              Essential items from your {currentLang.name} course
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('learn')}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            Browse All ({totalWordsCount})
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {spotlightWords.map((item) => (
            <VocabularyCard key={item.id} item={item} layout="grid" />
          ))}
        </div>
      </div>
    </div>
  );
};
