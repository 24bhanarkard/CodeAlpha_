export type Difficulty = 'normal' | 'needs-practice';

export interface FlashcardItem {
  id: string;
  question: string;
  answer: string;
  difficulty: Difficulty;
  category?: string;
  createdAt: number;
  lastReviewedAt?: number;
  timesReviewed?: number;
  timesCorrect?: number;
}

export type TabType = 'dashboard' | 'flashcards' | 'quiz' | 'settings';

export interface QuizScore {
  known: number;
  practice: number;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'error';
  message: string;
}

export interface UserProfile {
  name: string;
  email: string;
  avatarText: string;
  avatarColor: string;
  dailyGoal: number;
  streakDays: number;
  joinedDate: string;
}

export interface UserStats {
  totalReviewed: number;
  quizzesCompleted: number;
  cardsMastered: number;
  studyStreakDays: number;
  lastStudiedDate?: string;
}
