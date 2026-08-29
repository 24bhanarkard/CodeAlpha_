import React from 'react';
import { 
  Sun, 
  Moon, 
  Menu, 
  Flame, 
  BookOpen, 
  Volume2, 
  VolumeX,
  Sparkles
} from 'lucide-react';
import { useLearning } from '../../context/LearningContext';
import { LanguageSelector } from '../common/LanguageSelector';
import { PageId } from '../../types';

interface HeaderProps {
  onToggleSidebar: () => void;
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onToggleSidebar,
  currentPage,
  onNavigate,
}) => {
  const { theme, toggleTheme, state, soundEffectsEnabled, setSoundEffectsEnabled } = useLearning();

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-4 sm:px-6">
      {/* Left: Mobile Menu Toggle & Brand Logo */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="md:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Toggle navigation menu"
        >
          <Menu size={20} />
        </button>

        <button
          type="button"
          onClick={() => onNavigate('dashboard')}
          className="flex items-center gap-2.5 group text-left focus:outline-none"
        >
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
            <BookOpen size={20} className="stroke-[2.5]" />
          </div>
          <div>
            <span className="font-heading font-bold text-lg text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-1.5">
              Lingua<span className="text-indigo-600 dark:text-indigo-400">Learn</span>
            </span>
          </div>
        </button>
      </div>

      {/* Center: Language Selector */}
      <div className="flex items-center gap-2">
        <LanguageSelector />
      </div>

      {/* Right: Streak, Sound toggle, Theme Toggle */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Streak Badge */}
        <div 
          title={`${state.streak.count} day practice streak!`}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/60 text-amber-700 dark:text-amber-300 text-xs sm:text-sm font-semibold shadow-2xs cursor-default"
        >
          <Flame size={16} className="text-amber-500 fill-amber-500 animate-pulse" />
          <span>{state.streak.count}d</span>
        </div>

        {/* Audio Mute/Unmute quick toggle */}
        <button
          type="button"
          onClick={() => setSoundEffectsEnabled(!soundEffectsEnabled)}
          title={soundEffectsEnabled ? 'Sound effects enabled' : 'Sound effects muted'}
          aria-label={soundEffectsEnabled ? 'Sound effects enabled' : 'Sound effects muted'}
          className="hidden sm:inline-flex p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          {soundEffectsEnabled ? <Volume2 size={18} /> : <VolumeX size={18} className="text-slate-400" />}
        </button>

        {/* Dark/Light Mode Toggle */}
        <button
          id="theme-toggle-btn"
          type="button"
          onClick={toggleTheme}
          title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
          aria-label={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
          className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all cursor-pointer active:scale-95"
        >
          {theme === 'light' ? (
            <Moon size={19} className="text-slate-700 hover:text-indigo-600 transition-colors" />
          ) : (
            <Sun size={19} className="text-amber-400 hover:text-amber-300 transition-colors" />
          )}
        </button>
      </div>
    </header>
  );
};
