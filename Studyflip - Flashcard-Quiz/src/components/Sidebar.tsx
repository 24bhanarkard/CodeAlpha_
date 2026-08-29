import React from 'react';
import {
  LayoutDashboard,
  Layers,
  GraduationCap,
  Settings as SettingsIcon,
  Sparkles,
  Keyboard,
  Moon,
  Sun,
  X,
  Zap,
} from 'lucide-react';
import { TabType } from '../types';

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  totalCards: number;
  needsPracticeCount: number;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean | ((prev: boolean) => boolean)) => void;
  isMobileOpen?: boolean;
  setIsMobileOpen?: (val: boolean) => void;
  onOpenShortcuts?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  totalCards,
  needsPracticeCount,
  isDarkMode,
  setIsDarkMode,
  isMobileOpen,
  setIsMobileOpen,
  onOpenShortcuts,
}) => {
  const navItems = [
    {
      id: 'dashboard' as TabType,
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-4 h-4" />,
      badge: totalCards > 0 ? `${totalCards}` : undefined,
    },
    {
      id: 'flashcards' as TabType,
      label: 'My Flashcards',
      icon: <Layers className="w-4 h-4" />,
      badge: needsPracticeCount > 0 ? `${needsPracticeCount} review` : undefined,
      badgeColor: 'bg-amber-100 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300',
    },
    {
      id: 'quiz' as TabType,
      label: 'Quiz Mode',
      icon: <GraduationCap className="w-4 h-4" />,
      badge: 'Active Recall',
      badgeColor: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300',
    },
    {
      id: 'settings' as TabType,
      label: 'Settings',
      icon: <SettingsIcon className="w-4 h-4" />,
    },
  ];

  const handleNavClick = (tab: TabType) => {
    setActiveTab(tab);
    if (setIsMobileOpen) setIsMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs lg:hidden"
          onClick={() => setIsMobileOpen?.(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        id="app-sidebar"
        className={`fixed lg:static top-0 bottom-0 left-0 z-40 w-64 md:w-72 bg-white dark:bg-slate-900 border-r border-slate-200/90 dark:border-slate-800 flex flex-col justify-between transition-transform duration-300 ease-in-out ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top Brand Header & Navigation */}
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-md shadow-indigo-500/20 text-white font-bold">
                <div className="w-4 h-4 border-2 border-white rounded-xs"></div>
              </div>
              <div>
                <h1 className="font-bold text-xl tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                  StudyFlip
                </h1>
                <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500">
                  Active Recall System
                </p>
              </div>
            </div>

            {/* Mobile Close Button */}
            {setIsMobileOpen && (
              <button
                onClick={() => setIsMobileOpen(false)}
                className="lg:hidden p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Quick Deck Info Pill */}
          <div className="mt-5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">CS Study Deck</span>
            </div>
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">{totalCards} cards</span>
          </div>

          {/* Main Navigation links */}
          <nav className="mt-5 space-y-1" aria-label="Main Navigation">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 ${
                    isActive
                      ? 'bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 flex items-center justify-center ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`}>
                      {item.icon}
                    </div>
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-indigo-200/60 dark:bg-indigo-900/60 text-indigo-800 dark:text-indigo-200'
                          : item.badgeColor || 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
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

        {/* Bottom Bento Feature Card & Tools */}
        <div className="p-6 border-t border-slate-100 dark:border-slate-800 space-y-3.5">
          {/* Bento Pro/Tips Card */}
          <div className="bg-slate-900 dark:bg-slate-950 text-white p-4 rounded-2xl shadow-lg border border-slate-800/80">
            <div className="flex items-center justify-between mb-1">
              <p className="text-[10px] text-indigo-400 uppercase font-bold tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-indigo-400" />
                Active Recall Deck
              </p>
            </div>
            <p className="text-xs text-slate-300 mb-3 leading-relaxed">
              3D flip & spaced repetition study system ready.
            </p>
            <button
              onClick={() => setActiveTab('quiz')}
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-xs font-bold transition-all text-white shadow-xs flex items-center justify-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5" />
              START QUIZ
            </button>
          </div>

          {/* Shortcuts & Theme Toolbar */}
          <div className="flex items-center justify-between gap-2 pt-1">
            {onOpenShortcuts && (
              <button
                onClick={onOpenShortcuts}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <Keyboard className="w-3.5 h-3.5" />
                <span>Shortcuts</span>
              </button>
            )}

            <button
              id="btn-sidebar-theme-toggle"
              type="button"
              onClick={() => setIsDarkMode((prev) => !prev)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-slate-300 transition-all"
            >
              {isDarkMode ? (
                <>
                  <Moon className="w-3.5 h-3.5 text-indigo-400" />
                  Dark
                </>
              ) : (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-500" />
                  Light
                </>
              )}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
