import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Menu,
  Plus,
  GraduationCap,
  Sun,
  Moon,
  User,
  Settings as SettingsIcon,
  Flame,
  Target,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { TabType, UserProfile, FlashcardItem } from '../types';
import { getGreeting } from '../utils/helpers';

interface HeaderProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  onOpenAddModal: () => void;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean | ((prev: boolean) => boolean)) => void;
  onOpenMobileMenu: () => void;
  profile: UserProfile;
  onOpenProfileModal: () => void;
  cards?: FlashcardItem[];
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenAddModal,
  isDarkMode,
  setIsDarkMode,
  onOpenMobileMenu,
  profile,
  onOpenProfileModal,
  cards = [],
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const getTabTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return { title: 'Study Dashboard', subtitle: `${getGreeting()}, ${profile.name.split(' ')[0]}! Ready to practice today's deck?` };
      case 'flashcards':
        return { title: 'My Flashcards', subtitle: 'Manage, search, edit, and organize all your cards' };
      case 'quiz':
        return { title: 'Quiz Mode', subtitle: 'Active recall testing with real-time scoring' };
      case 'settings':
        return { title: 'Settings', subtitle: 'Preferences, theme customization, and backup options' };
      default:
        return { title: 'StudyFlip', subtitle: 'Master your subjects with active recall' };
    }
  };

  const { title, subtitle } = getTabTitle();
  const masteredCount = cards.filter((c) => c.difficulty !== 'needs-practice').length;

  return (
    <header className="sticky top-0 z-30 bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border-b border-slate-200/90 dark:border-slate-800 px-4 md:px-8 py-3.5">
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
        {/* Left Side: Mobile Menu + Title */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onOpenMobileMenu}
            className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="truncate">
            <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white tracking-tight truncate">
              {title}
            </h2>
            <p className="text-xs text-slate-400 dark:text-slate-500 hidden sm:block truncate">
              {subtitle}
            </p>
          </div>
        </div>

        {/* Right Side: Quick Action Buttons & Interactive Profile */}
        <div className="flex items-center gap-2.5 shrink-0">
          {activeTab !== 'quiz' && (
            <button
              id="btn-header-quick-quiz"
              onClick={() => setActiveTab('quiz')}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/70 dark:border-indigo-800/70 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-all"
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Quiz Mode</span>
            </button>
          )}

          <button
            id="btn-header-add-card"
            onClick={onOpenAddModal}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-sm shadow-indigo-500/20 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden xs:inline">Add Card</span>
            <span className="xs:hidden">Add</span>
          </button>

          {/* Theme Toggle Button */}
          <button
            id="btn-header-theme-toggle"
            type="button"
            onClick={() => setIsDarkMode((prev) => !prev)}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition-colors shadow-2xs"
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDarkMode ? (
              <Sun className="w-4 h-4 text-amber-400 animate-in fade-in zoom-in duration-200" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-600 animate-in fade-in zoom-in duration-200" />
            )}
          </button>

          {/* Interactive User Profile Button & Dropdown Popover */}
          <div className="relative" ref={dropdownRef}>
            <button
              id="btn-header-profile"
              type="button"
              onClick={() => setIsDropdownOpen((prev) => !prev)}
              className={`flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-xl border transition-all ${
                isDropdownOpen
                  ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/50 ring-2 ring-indigo-500/20'
                  : 'border-slate-200/90 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              aria-expanded={isDropdownOpen}
              aria-label="User profile menu"
            >
              <div
                className={`w-7 h-7 rounded-lg ${
                  profile.avatarColor || 'bg-indigo-600'
                } text-white flex items-center justify-center text-xs font-black shadow-xs`}
              >
                {profile.avatarText || 'SF'}
              </div>
              <span className="hidden sm:inline text-xs font-bold text-slate-700 dark:text-slate-200 max-w-[90px] truncate">
                {profile.name.split(' ')[0]}
              </span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                  isDropdownOpen ? 'rotate-180 text-indigo-600 dark:text-indigo-400' : ''
                }`}
              />
            </button>

            {/* Profile Dropdown Bento Menu */}
            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  id="profile-dropdown-menu"
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.15, ease: 'easeOut' }}
                  className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl shadow-xl p-3 z-50 overflow-hidden"
                >
                  {/* Profile Header in Dropdown */}
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800/80 mb-2.5">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl ${
                          profile.avatarColor || 'bg-indigo-600'
                        } text-white flex items-center justify-center text-sm font-black shadow-xs shrink-0`}
                      >
                        {profile.avatarText || 'SF'}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {profile.name}
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                          {profile.email}
                        </p>
                      </div>
                    </div>

                    {/* Streak & Goal Badges */}
                    <div className="flex items-center justify-between gap-2 mt-3 pt-2.5 border-t border-slate-200/60 dark:border-slate-700/60 text-[11px]">
                      <span className="flex items-center gap-1 font-bold text-amber-600 dark:text-amber-400">
                        <Flame className="w-3.5 h-3.5" />
                        {profile.streakDays || 5} Day Streak
                      </span>
                      <span className="flex items-center gap-1 font-bold text-indigo-600 dark:text-indigo-400">
                        <Target className="w-3.5 h-3.5" />
                        Goal: {profile.dailyGoal || 10} / day
                      </span>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="space-y-1">
                    <button
                      id="btn-dropdown-view-profile"
                      type="button"
                      onClick={() => {
                        setIsDropdownOpen(false);
                        onOpenProfileModal();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <User className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                      <span>View & Edit Profile</span>
                    </button>

                    <button
                      id="btn-dropdown-quiz"
                      type="button"
                      onClick={() => {
                        setIsDropdownOpen(false);
                        setActiveTab('quiz');
                      }}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <span className="flex items-center gap-2.5">
                        <GraduationCap className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                        <span>Quiz Mode</span>
                      </span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-300">
                        Test
                      </span>
                    </button>

                    <button
                      id="btn-dropdown-settings"
                      type="button"
                      onClick={() => {
                        setIsDropdownOpen(false);
                        setActiveTab('settings');
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <SettingsIcon className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                      <span>App Settings & Backup</span>
                    </button>

                    <div className="pt-1.5 my-1 border-t border-slate-100 dark:border-slate-800">
                      <button
                        id="btn-dropdown-toggle-theme"
                        type="button"
                        onClick={() => {
                          setIsDarkMode((prev) => !prev);
                        }}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        <span className="flex items-center gap-2.5">
                          {isDarkMode ? (
                            <Sun className="w-4 h-4 text-amber-400" />
                          ) : (
                            <Moon className="w-4 h-4 text-indigo-600" />
                          )}
                          <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
                        </span>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                          {isDarkMode ? 'Dark' : 'Light'}
                        </span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
};
