import React, { useState, useEffect } from 'react';
import { LearningProvider, useLearning } from './context/LearningContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { MobileNav } from './components/layout/MobileNav';
import { Dashboard } from './pages/Dashboard';
import { Learn } from './pages/Learn';
import { FlashcardsPage } from './pages/FlashcardsPage';
import { QuizPage } from './pages/QuizPage';
import { DailyPracticePage } from './pages/DailyPracticePage';
import { FavoritesPage } from './pages/FavoritesPage';
import { ProgressPage } from './pages/ProgressPage';
import { SettingsPage } from './pages/SettingsPage';
import { PageId, Category } from './types';

const MainAppContent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<PageId>('dashboard');
  const [initialCategory, setInitialCategory] = useState<Category | 'All'>('All');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Scroll to top when changing pages
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const handleNavigate = (page: PageId, category?: Category) => {
    if (category) {
      setInitialCategory(category);
    } else {
      setInitialCategory('All');
    }
    setCurrentPage(page);
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Top Header */}
      <Header
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        currentPage={currentPage}
        onNavigate={handleNavigate}
      />

      {/* Main Layout Body */}
      <div className="flex-1 flex w-full max-w-7xl mx-auto">
        {/* Sidebar */}
        <Sidebar
          currentPage={currentPage}
          onNavigate={handleNavigate}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 max-w-5xl overflow-y-auto pb-24 md:pb-12">
          {currentPage === 'dashboard' && (
            <Dashboard onNavigate={handleNavigate} />
          )}
          {currentPage === 'learn' && (
            <Learn initialCategory={initialCategory} onNavigate={handleNavigate} />
          )}
          {currentPage === 'flashcards' && (
            <FlashcardsPage onNavigate={handleNavigate} />
          )}
          {currentPage === 'quiz' && (
            <QuizPage onNavigate={handleNavigate} />
          )}
          {currentPage === 'daily' && (
            <DailyPracticePage onNavigate={handleNavigate} />
          )}
          {currentPage === 'favorites' && (
            <FavoritesPage onNavigate={handleNavigate} />
          )}
          {currentPage === 'progress' && (
            <ProgressPage onNavigate={handleNavigate} />
          )}
          {currentPage === 'settings' && (
            <SettingsPage onNavigate={handleNavigate} />
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav
        currentPage={currentPage}
        onNavigate={handleNavigate}
      />
    </div>
  );
};

export default function App() {
  return (
    <LearningProvider>
      <MainAppContent />
    </LearningProvider>
  );
}
