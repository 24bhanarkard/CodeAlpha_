import React, { useState, useEffect, useCallback } from 'react';
import { INITIAL_FLASHCARDS } from './data/initialData';
import { FlashcardItem, TabType, ToastMessage, Difficulty, UserProfile } from './types';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './pages/Dashboard';
import { MyFlashcards } from './pages/MyFlashcards';
import { Quiz } from './pages/Quiz';
import { Settings } from './pages/Settings';
import { FlashcardFormModal } from './components/FlashcardFormModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { KeyboardShortcutsModal } from './components/KeyboardShortcutsModal';
import { UserProfileModal } from './components/UserProfileModal';
import { ToastContainer } from './components/Toast';

const DEFAULT_PROFILE: UserProfile = {
  name: 'Dikshant B.',
  email: 'dikshant.b55@gmail.com',
  avatarText: 'DB',
  avatarColor: 'bg-indigo-600',
  dailyGoal: 10,
  streakDays: 5,
  joinedDate: 'August 2026',
};

export default function App() {
  // 1. LocalStorage state for Flashcards
  const [cards, setCards] = useState<FlashcardItem[]>(() => {
    try {
      const saved = localStorage.getItem('studyflip_cards');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (err) {
      console.error('Failed to load flashcards from storage', err);
    }
    return INITIAL_FLASHCARDS;
  });

  // 2. User Profile state
  const [profile, setProfile] = useState<UserProfile>(() => {
    try {
      const savedProfile = localStorage.getItem('studyflip_profile');
      if (savedProfile) {
        return JSON.parse(savedProfile);
      }
    } catch (err) {
      console.error('Failed to load profile from storage', err);
    }
    return DEFAULT_PROFILE;
  });

  // 3. Active Tab & Theme
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const savedTheme = localStorage.getItem('studyflip_theme');
      if (savedTheme) return savedTheme === 'dark';
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  });

  // 4. Modals & Side Drawer State
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<FlashcardItem | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [cardToDelete, setCardToDelete] = useState<FlashcardItem | null>(null);
  const [isShortcutsModalOpen, setIsShortcutsModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // 4. Toast notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Sync cards to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('studyflip_cards', JSON.stringify(cards));
    } catch (err) {
      console.error('Failed to persist cards', err);
    }
  }, [cards]);

  // Sync theme to document and localStorage
  useEffect(() => {
    try {
      localStorage.setItem('studyflip_theme', isDarkMode ? 'dark' : 'light');
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch (err) {
      console.error('Failed to save theme', err);
    }
  }, [isDarkMode]);

  // Global Keyboard shortcuts
  useEffect(() => {
    const handleGlobalKey = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return;
      }

      if (e.key === 'a' || e.key === 'A') {
        e.preventDefault();
        setEditingCard(null);
        setIsFormModalOpen(true);
      } else if (e.key === '?') {
        e.preventDefault();
        setIsShortcutsModalOpen((prev) => !prev);
      } else if (e.key === 'Escape') {
        setIsFormModalOpen(false);
        setIsDeleteModalOpen(false);
        setIsShortcutsModalOpen(false);
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('keydown', handleGlobalKey);
    return () => window.removeEventListener('keydown', handleGlobalKey);
  }, []);

  // Card Operations
  const handleSaveCard = (cardData: {
    question: string;
    answer: string;
    difficulty: Difficulty;
    category?: string;
  }) => {
    if (editingCard) {
      // Update existing
      setCards((prev) =>
        prev.map((c) =>
          c.id === editingCard.id
            ? {
                ...c,
                ...cardData,
              }
            : c
        )
      );
      showToast('Flashcard updated successfully!');
    } else {
      // Create new
      const newCard: FlashcardItem = {
        id: 'card-' + Date.now().toString(),
        ...cardData,
        createdAt: Date.now(),
        timesReviewed: 0,
        timesCorrect: 0,
      };
      setCards((prev) => [newCard, ...prev]);
      showToast('New flashcard created and added to deck!');
    }
    setEditingCard(null);
  };

  const handleOpenAddModal = () => {
    setEditingCard(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (card: FlashcardItem) => {
    setEditingCard(card);
    setIsFormModalOpen(true);
  };

  const handleOpenDeleteModal = (card: FlashcardItem) => {
    setCardToDelete(card);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!cardToDelete) return;
    setCards((prev) => prev.filter((c) => c.id !== cardToDelete.id));
    showToast('Flashcard deleted from deck.', 'info');
    setCardToDelete(null);
  };

  const handleToggleDifficulty = (id: string) => {
    setCards((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const nextDiff = c.difficulty === 'normal' ? 'needs-practice' : 'normal';
          showToast(
            nextDiff === 'needs-practice' ? 'Marked as Needs Practice' : 'Marked as Mastered',
            'info'
          );
          return { ...c, difficulty: nextDiff };
        }
        return c;
      })
    );
  };

  const handleUpdateDifficultyDirect = (id: string, difficulty: 'normal' | 'needs-practice') => {
    setCards((prev) =>
      prev.map((c) => (c.id === id ? { ...c, difficulty } : c))
    );
  };

  const handleRestoreDefaults = () => {
    setCards(INITIAL_FLASHCARDS);
    showToast('Restored 10 default Computer Science flashcards.');
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all flashcards from this deck?')) {
      setCards([]);
      showToast('All flashcards cleared.', 'info');
    }
  };

  const handleImportCards = (importedCards: FlashcardItem[]) => {
    setCards((prev) => [...importedCards, ...prev]);
    showToast(`Successfully imported ${importedCards.length} flashcards!`);
  };

  const handleSaveProfile = (updatedProfile: UserProfile) => {
    setProfile(updatedProfile);
    try {
      localStorage.setItem('studyflip_profile', JSON.stringify(updatedProfile));
      showToast('Profile updated successfully!');
    } catch (err) {
      console.error('Failed to save profile', err);
    }
  };

  const [activeStudyCardId, setActiveStudyCardId] = useState<string | null>(null);

  const needsPracticeCount = cards.filter((c) => c.difficulty === 'needs-practice').length;

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* 1. Desktop & Mobile Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        totalCards={cards.length}
        needsPracticeCount={needsPracticeCount}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        isMobileOpen={isMobileMenuOpen}
        setIsMobileOpen={setIsMobileMenuOpen}
        onOpenShortcuts={() => setIsShortcutsModalOpen(true)}
      />

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenAddModal={handleOpenAddModal}
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          profile={profile}
          onOpenProfileModal={() => setIsProfileModalOpen(true)}
          cards={cards}
        />

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-5xl mx-auto pb-12">
            {activeTab === 'dashboard' && (
              <Dashboard
                cards={cards}
                activeStudyCardId={activeStudyCardId}
                onClearActiveStudyCard={() => setActiveStudyCardId(null)}
                onAddCardClick={handleOpenAddModal}
                onEditCard={handleOpenEditModal}
                onDeleteCard={handleOpenDeleteModal}
                onToggleDifficulty={handleToggleDifficulty}
                onRestoreDefaults={handleRestoreDefaults}
                onStartQuiz={() => setActiveTab('quiz')}
              />
            )}

            {activeTab === 'flashcards' && (
              <MyFlashcards
                cards={cards}
                onAddCardClick={handleOpenAddModal}
                onEditCard={handleOpenEditModal}
                onDeleteCard={handleOpenDeleteModal}
                onToggleDifficulty={handleToggleDifficulty}
                onStudyCard={(card) => {
                  setActiveStudyCardId(card.id);
                  setActiveTab('dashboard');
                }}
              />
            )}

            {activeTab === 'quiz' && (
              <Quiz
                cards={cards}
                onBackToDashboard={() => setActiveTab('dashboard')}
                onUpdateCardDifficulty={handleUpdateDifficultyDirect}
              />
            )}

            {activeTab === 'settings' && (
              <Settings
                cards={cards}
                isDarkMode={isDarkMode}
                setIsDarkMode={setIsDarkMode}
                onRestoreDefaults={handleRestoreDefaults}
                onClearAll={handleClearAll}
                onImportCards={handleImportCards}
              />
            )}
          </div>
        </main>
      </div>

      {/* 3. Global Modals & Notifications */}
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        profile={profile}
        onSaveProfile={handleSaveProfile}
        cards={cards}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        onStartQuiz={() => setActiveTab('quiz')}
      />

      <FlashcardFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingCard(null);
        }}
        onSave={handleSaveCard}
        initialCard={editingCard}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        card={cardToDelete}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setCardToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
      />

      <KeyboardShortcutsModal
        isOpen={isShortcutsModalOpen}
        onClose={() => setIsShortcutsModalOpen(false)}
      />

      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
