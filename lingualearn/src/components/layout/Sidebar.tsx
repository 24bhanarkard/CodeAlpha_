import React from 'react';
import { 
  LayoutDashboard, 
  BookOpen, 
  Layers, 
  HelpCircle, 
  Star, 
  BarChart2, 
  Settings,
  CalendarCheck,
  Flame,
  Award,
  Sun,
  Moon
} from 'lucide-react';
import { PageId } from '../../types';
import { useLearning } from '../../context/LearningContext';
import { LANGUAGES } from '../../data/languages';
import { ProgressBar } from '../common/ProgressBar';

interface SidebarProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onNavigate,
  isOpen,
  onClose,
}) => {
  const { 
    selectedLanguage, 
    learnedCount, 
    totalWordsCount, 
    learningPercentage,
    favoriteCount,
    difficultCount,
    dailyPractice,
    theme,
    toggleTheme,
  } = useLearning();

  const currentLang = LANGUAGES[selectedLanguage];

  const navItems = [
    { id: 'dashboard' as PageId, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'learn' as PageId, label: 'Learn Vocabulary', icon: BookOpen, badge: totalWordsCount },
    { id: 'flashcards' as PageId, label: 'Flashcards', icon: Layers },
    { id: 'quiz' as PageId, label: 'Quiz Mode', icon: HelpCircle },
    { 
      id: 'daily' as PageId, 
      label: 'Daily Practice', 
      icon: CalendarCheck, 
      badge: dailyPractice.isCompleted ? 'Done' : 'New',
      badgeColor: dailyPractice.isCompleted ? 'emerald' : 'amber'
    },
    { id: 'favorites' as PageId, label: 'Favorites', icon: Star, badge: favoriteCount > 0 ? favoriteCount : undefined },
    { id: 'progress' as PageId, label: 'Progress & Stats', icon: BarChart2 },
    { id: 'settings' as PageId, label: 'Settings', icon: Settings },
  ];

  const handleNav = (id: PageId) => {
    onNavigate(id);
    onClose();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 border-r border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 flex flex-col justify-between transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:h-[calc(100vh-4rem)] ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-4 py-5 space-y-1">
          <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Learning Menu
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNav(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-150 group text-left ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-xs font-semibold'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/70'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      size={18}
                      className={isActive ? 'text-white' : 'text-slate-400 dark:text-slate-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors'}
                    />
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== undefined && (
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-semibold transition-colors ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : item.badgeColor === 'emerald'
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                          : item.badgeColor === 'amber'
                          ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                          : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer: Active Language Progress Card & Quick Theme Toggle */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50 space-y-3">
          <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xl leading-none">{currentLang.flag}</span>
                <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  {currentLang.name}
                </div>
              </div>
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                {learnedCount}/{totalWordsCount}
              </span>
            </div>

            <ProgressBar
              value={learningPercentage}
              size="sm"
              showPercentage={false}
              color="indigo"
            />

            <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
              <span>Mastery</span>
              <span className="font-medium">{learningPercentage}% Complete</span>
            </div>
          </div>

          <button
            type="button"
            onClick={toggleTheme}
            className="w-full py-2 px-3 rounded-xl border border-slate-200/80 dark:border-slate-700/80 bg-white dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700/60 text-slate-700 dark:text-slate-300 text-xs font-medium flex items-center justify-between transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-2">
              {theme === 'light' ? <Sun size={15} className="text-amber-500" /> : <Moon size={15} className="text-indigo-400" />}
              <span>{theme === 'light' ? 'Light Theme' : 'Dark Theme'}</span>
            </span>
            <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500">
              Toggle
            </span>
          </button>
        </div>
      </aside>
    </>
  );
};
