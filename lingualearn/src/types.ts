export type LanguageId = 'es' | 'fr' | 'de' | 'ja';

export type Category = 
  | 'Greetings'
  | 'Numbers'
  | 'Food'
  | 'Travel'
  | 'Daily Conversation'
  | 'Family'
  | 'Common Words';

export interface Language {
  id: LanguageId;
  name: string;
  nativeName: string;
  flag: string;
  code: string;
  bcp47: string;
  description: string;
  color: string;
}

export interface VocabularyItem {
  id: string;
  languageId: LanguageId;
  text: string;
  translation: string;
  pronunciation: string;
  category: Category;
  exampleSentence: string;
  exampleTranslation: string;
  partOfSpeech?: 'noun' | 'verb' | 'adjective' | 'phrase' | 'number' | 'adverb';
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface QuizQuestion {
  id: string;
  vocabularyId: string;
  prompt: string;
  questionType: 'meaning' | 'translation' | 'phrase_context' | 'pronunciation_match';
  targetWord: string;
  pronunciation?: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  category: Category;
}

export interface QuizResult {
  id: string;
  date: string;
  languageId: LanguageId;
  category?: Category | 'All';
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  percentage: number;
  timeSpentSeconds?: number;
}

export interface DailyPracticeState {
  date: string; // YYYY-MM-DD
  targetItemIds: string[];
  completedItemIds: string[];
  isCompleted: boolean;
}

export interface UserLearningState {
  selectedLanguage: LanguageId;
  theme: 'light' | 'dark';
  learnedWords: Record<LanguageId, string[]>;
  difficultWords: Record<LanguageId, string[]>;
  favoriteWords: Record<LanguageId, string[]>;
  quizHistory: QuizResult[];
  dailyPractice: Record<LanguageId, DailyPracticeState>;
  streak: {
    count: number;
    lastActiveDate: string;
  };
  audioSpeed: number; // 0.8 or 1.0
  soundEffectsEnabled: boolean;
}

export type PageId = 
  | 'dashboard'
  | 'learn'
  | 'flashcards'
  | 'quiz'
  | 'daily'
  | 'favorites'
  | 'progress'
  | 'settings';
