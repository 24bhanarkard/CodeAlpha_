import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import { LanguageId, UserLearningState, VocabularyItem, QuizResult, DailyPracticeState, Category } from '../types';
import { VOCABULARY_DATA } from '../data/vocabulary';
import { LANGUAGES } from '../data/languages';
import { soundFx } from '../utils/audio';

interface LearningContextType {
  state: UserLearningState;
  selectedLanguage: LanguageId;
  setSelectedLanguage: (lang: LanguageId) => void;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;
  audioSpeed: number;
  setAudioSpeed: (speed: number) => void;
  soundEffectsEnabled: boolean;
  setSoundEffectsEnabled: (enabled: boolean) => void;

  // Vocabulary item status
  isLearned: (id: string) => boolean;
  isDifficult: (id: string) => boolean;
  isFavorite: (id: string) => boolean;
  toggleLearned: (id: string) => void;
  toggleDifficult: (id: string) => void;
  toggleFavorite: (id: string) => void;
  markAsLearned: (id: string) => void;
  markAsDifficult: (id: string) => void;

  // Filtered dataset helpers
  currentLanguageVocabulary: VocabularyItem[];
  learnedVocabulary: VocabularyItem[];
  difficultVocabulary: VocabularyItem[];
  favoriteVocabulary: VocabularyItem[];
  
  // Stats
  totalWordsCount: number;
  learnedCount: number;
  difficultCount: number;
  favoriteCount: number;
  learningPercentage: number;
  averageQuizScore: number;
  totalQuizzesTaken: number;

  // Quiz
  recordQuizResult: (result: Omit<QuizResult, 'id' | 'date' | 'languageId'>) => void;
  quizHistoryForCurrentLang: QuizResult[];

  // Daily Practice
  dailyPractice: DailyPracticeState;
  dailyPracticeItems: VocabularyItem[];
  completeDailyPracticeItem: (id: string) => void;
  markDailyPracticeComplete: () => void;

  // Resets
  resetLearningProgress: (langOnly?: boolean) => void;
  resetFavorites: (langOnly?: boolean) => void;
  resetAllData: () => void;
}

const STORAGE_KEY = 'lingualearn_user_data_v2';

const DEFAULT_STATE: UserLearningState = {
  selectedLanguage: 'es',
  theme: 'light',
  learnedWords: {
    es: ['es-1', 'es-2'], // pre-seed a couple learned for friendly initial experience
    fr: [],
    de: [],
    ja: [],
  },
  difficultWords: {
    es: ['es-14'],
    fr: [],
    de: [],
    ja: [],
  },
  favoriteWords: {
    es: ['es-3', 'es-7'],
    fr: [],
    de: [],
    ja: [],
  },
  quizHistory: [
    {
      id: 'init-quiz-1',
      date: new Date(Date.now() - 86400000 * 2).toISOString(),
      languageId: 'es',
      category: 'Greetings',
      totalQuestions: 5,
      correctAnswers: 4,
      incorrectAnswers: 1,
      percentage: 80,
    }
  ],
  dailyPractice: {
    es: { date: '', targetItemIds: [], completedItemIds: [], isCompleted: false },
    fr: { date: '', targetItemIds: [], completedItemIds: [], isCompleted: false },
    de: { date: '', targetItemIds: [], completedItemIds: [], isCompleted: false },
    ja: { date: '', targetItemIds: [], completedItemIds: [], isCompleted: false },
  },
  streak: {
    count: 3,
    lastActiveDate: new Date().toISOString().split('T')[0],
  },
  audioSpeed: 0.9,
  soundEffectsEnabled: true,
};

function getTodayString(): string {
  return new Date().toISOString().split('T')[0];
}

const LearningContext = createContext<LearningContextType | undefined>(undefined);

export const LearningProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<UserLearningState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_STATE,
          ...parsed,
          learnedWords: { ...DEFAULT_STATE.learnedWords, ...parsed.learnedWords },
          difficultWords: { ...DEFAULT_STATE.difficultWords, ...parsed.difficultWords },
          favoriteWords: { ...DEFAULT_STATE.favoriteWords, ...parsed.favoriteWords },
          dailyPractice: { ...DEFAULT_STATE.dailyPractice, ...parsed.dailyPractice },
        };
      }
    } catch {
      // ignore
    }
    // Check system dark mode preference if no saved theme
    if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return { ...DEFAULT_STATE, theme: 'dark' };
    }
    return DEFAULT_STATE;
  });

  // Save to localStorage on state changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore
    }
  }, [state]);

  // Sync theme class on <html> / <body>
  useEffect(() => {
    const root = document.documentElement;
    if (state.theme === 'dark') {
      root.classList.add('dark');
      document.body.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
    } else {
      root.classList.remove('dark');
      document.body.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
    }
  }, [state.theme]);

  // Update streak on app mount / active date check
  useEffect(() => {
    const today = getTodayString();
    setState(prev => {
      const lastDate = prev.streak.lastActiveDate;
      if (lastDate === today) {
        return prev;
      }
      // Check if yesterday
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      let newStreak = prev.streak.count;
      if (lastDate === yesterdayStr) {
        // Maintained
      } else if (lastDate && lastDate < yesterdayStr) {
        // Broken streak (reset to 1)
        newStreak = 1;
      }

      return {
        ...prev,
        streak: {
          count: newStreak,
          lastActiveDate: today,
        }
      };
    });
  }, []);

  const selectedLanguage = state.selectedLanguage;

  const setSelectedLanguage = useCallback((lang: LanguageId) => {
    setState(prev => ({ ...prev, selectedLanguage: lang }));
  }, []);

  const setTheme = useCallback((theme: 'light' | 'dark') => {
    setState(prev => ({ ...prev, theme }));
  }, []);

  const toggleTheme = useCallback(() => {
    setState(prev => ({
      ...prev,
      theme: prev.theme === 'light' ? 'dark' : 'light',
    }));
  }, []);

  const setAudioSpeed = useCallback((speed: number) => {
    setState(prev => ({ ...prev, audioSpeed: speed }));
  }, []);

  const setSoundEffectsEnabled = useCallback((enabled: boolean) => {
    setState(prev => ({ ...prev, soundEffectsEnabled: enabled }));
  }, []);

  // Filtered items for current language
  const currentLanguageVocabulary = useMemo(() => {
    return VOCABULARY_DATA.filter(item => item.languageId === selectedLanguage);
  }, [selectedLanguage]);

  const learnedVocabulary = useMemo(() => {
    const learnedIds = state.learnedWords[selectedLanguage] || [];
    return currentLanguageVocabulary.filter(item => learnedIds.includes(item.id));
  }, [currentLanguageVocabulary, state.learnedWords, selectedLanguage]);

  const difficultVocabulary = useMemo(() => {
    const diffIds = state.difficultWords[selectedLanguage] || [];
    return currentLanguageVocabulary.filter(item => diffIds.includes(item.id));
  }, [currentLanguageVocabulary, state.difficultWords, selectedLanguage]);

  const favoriteVocabulary = useMemo(() => {
    const favIds = state.favoriteWords[selectedLanguage] || [];
    return currentLanguageVocabulary.filter(item => favIds.includes(item.id));
  }, [currentLanguageVocabulary, state.favoriteWords, selectedLanguage]);

  const isLearned = useCallback((id: string) => {
    return (state.learnedWords[selectedLanguage] || []).includes(id);
  }, [state.learnedWords, selectedLanguage]);

  const isDifficult = useCallback((id: string) => {
    return (state.difficultWords[selectedLanguage] || []).includes(id);
  }, [state.difficultWords, selectedLanguage]);

  const isFavorite = useCallback((id: string) => {
    return (state.favoriteWords[selectedLanguage] || []).includes(id);
  }, [state.favoriteWords, selectedLanguage]);

  const toggleLearned = useCallback((id: string) => {
    setState(prev => {
      const current = prev.learnedWords[prev.selectedLanguage] || [];
      const isAlready = current.includes(id);
      const updated = isAlready ? current.filter(x => x !== id) : [...current, id];
      
      // If marked as learned, remove from difficult words list automatically
      const currentDiff = prev.difficultWords[prev.selectedLanguage] || [];
      const updatedDiff = !isAlready ? currentDiff.filter(x => x !== id) : currentDiff;

      return {
        ...prev,
        learnedWords: { ...prev.learnedWords, [prev.selectedLanguage]: updated },
        difficultWords: { ...prev.difficultWords, [prev.selectedLanguage]: updatedDiff }
      };
    });
  }, []);

  const markAsLearned = useCallback((id: string) => {
    setState(prev => {
      const current = prev.learnedWords[prev.selectedLanguage] || [];
      if (current.includes(id)) return prev;
      const currentDiff = prev.difficultWords[prev.selectedLanguage] || [];
      return {
        ...prev,
        learnedWords: { ...prev.learnedWords, [prev.selectedLanguage]: [...current, id] },
        difficultWords: { ...prev.difficultWords, [prev.selectedLanguage]: currentDiff.filter(x => x !== id) }
      };
    });
  }, []);

  const toggleDifficult = useCallback((id: string) => {
    setState(prev => {
      const current = prev.difficultWords[prev.selectedLanguage] || [];
      const isAlready = current.includes(id);
      const updated = isAlready ? current.filter(x => x !== id) : [...current, id];

      return {
        ...prev,
        difficultWords: { ...prev.difficultWords, [prev.selectedLanguage]: updated }
      };
    });
  }, []);

  const markAsDifficult = useCallback((id: string) => {
    setState(prev => {
      const current = prev.difficultWords[prev.selectedLanguage] || [];
      if (current.includes(id)) return prev;
      return {
        ...prev,
        difficultWords: { ...prev.difficultWords, [prev.selectedLanguage]: [...current, id] }
      };
    });
  }, []);

  const toggleFavorite = useCallback((id: string) => {
    setState(prev => {
      const current = prev.favoriteWords[prev.selectedLanguage] || [];
      const isAlready = current.includes(id);
      const updated = isAlready ? current.filter(x => x !== id) : [...current, id];

      return {
        ...prev,
        favoriteWords: { ...prev.favoriteWords, [prev.selectedLanguage]: updated }
      };
    });
  }, []);

  // Quiz results
  const recordQuizResult = useCallback((res: Omit<QuizResult, 'id' | 'date' | 'languageId'>) => {
    const newResult: QuizResult = {
      ...res,
      id: 'quiz-' + Date.now(),
      date: new Date().toISOString(),
      languageId: state.selectedLanguage,
    };

    setState(prev => ({
      ...prev,
      quizHistory: [newResult, ...prev.quizHistory],
      streak: {
        ...prev.streak,
        count: prev.streak.count + 1,
        lastActiveDate: getTodayString(),
      }
    }));
  }, [state.selectedLanguage]);

  const quizHistoryForCurrentLang = useMemo(() => {
    return state.quizHistory.filter(q => q.languageId === selectedLanguage);
  }, [state.quizHistory, selectedLanguage]);

  // Statistics calculation
  const totalWordsCount = currentLanguageVocabulary.length;
  const learnedCount = learnedVocabulary.length;
  const difficultCount = difficultVocabulary.length;
  const favoriteCount = favoriteVocabulary.length;
  const learningPercentage = totalWordsCount > 0 ? Math.round((learnedCount / totalWordsCount) * 100) : 0;

  const totalQuizzesTaken = quizHistoryForCurrentLang.length;
  const averageQuizScore = useMemo(() => {
    if (quizHistoryForCurrentLang.length === 0) return 0;
    const totalPercentage = quizHistoryForCurrentLang.reduce((acc, curr) => acc + curr.percentage, 0);
    return Math.round(totalPercentage / quizHistoryForCurrentLang.length);
  }, [quizHistoryForCurrentLang]);

  // Daily Practice Management
  const currentDailyState = useMemo<DailyPracticeState>(() => {
    const today = getTodayString();
    const stored = state.dailyPractice[selectedLanguage];
    if (stored && stored.date === today && stored.targetItemIds.length > 0) {
      return stored;
    }

    // Generate 5 items for today: prioritize difficult items + unlearned items
    const diffIds = state.difficultWords[selectedLanguage] || [];
    const learnedIds = state.learnedWords[selectedLanguage] || [];
    const allItems = currentLanguageVocabulary;

    const difficultItems = allItems.filter(i => diffIds.includes(i.id));
    const unlearnedItems = allItems.filter(i => !learnedIds.includes(i.id) && !diffIds.includes(i.id));
    const otherItems = allItems.filter(i => learnedIds.includes(i.id));

    const selected: VocabularyItem[] = [];
    // pick up to 2 difficult
    difficultItems.slice(0, 2).forEach(i => selected.push(i));
    // pick unlearned
    unlearnedItems.slice(0, 5 - selected.length).forEach(i => selected.push(i));
    // if still not 5, pick others
    if (selected.length < 5) {
      otherItems.slice(0, 5 - selected.length).forEach(i => selected.push(i));
    }
    // fallback if less than 5 total items
    if (selected.length === 0 && allItems.length > 0) {
      selected.push(...allItems.slice(0, Math.min(5, allItems.length)));
    }

    return {
      date: today,
      targetItemIds: selected.map(s => s.id),
      completedItemIds: [],
      isCompleted: false,
    };
  }, [state.dailyPractice, selectedLanguage, currentLanguageVocabulary, state.difficultWords, state.learnedWords]);

  const dailyPracticeItems = useMemo(() => {
    return currentDailyState.targetItemIds
      .map(id => currentLanguageVocabulary.find(v => v.id === id))
      .filter((v): v is VocabularyItem => Boolean(v));
  }, [currentDailyState.targetItemIds, currentLanguageVocabulary]);

  const completeDailyPracticeItem = useCallback((id: string) => {
    setState(prev => {
      const today = getTodayString();
      const current = prev.dailyPractice[prev.selectedLanguage] || {
        date: today,
        targetItemIds: currentDailyState.targetItemIds,
        completedItemIds: [],
        isCompleted: false
      };

      const completed = current.completedItemIds.includes(id) 
        ? current.completedItemIds 
        : [...current.completedItemIds, id];
      
      const isCompleted = completed.length >= current.targetItemIds.length;

      if (isCompleted && !current.isCompleted) {
        soundFx.playCompletionFanfare(prev.soundEffectsEnabled);
      }

      return {
        ...prev,
        dailyPractice: {
          ...prev.dailyPractice,
          [prev.selectedLanguage]: {
            ...current,
            date: today,
            completedItemIds: completed,
            isCompleted,
          }
        }
      };
    });
  }, [currentDailyState]);

  const markDailyPracticeComplete = useCallback(() => {
    setState(prev => {
      const today = getTodayString();
      const current = prev.dailyPractice[prev.selectedLanguage] || currentDailyState;
      return {
        ...prev,
        dailyPractice: {
          ...prev.dailyPractice,
          [prev.selectedLanguage]: {
            ...current,
            date: today,
            completedItemIds: current.targetItemIds,
            isCompleted: true,
          }
        }
      };
    });
  }, [currentDailyState]);

  // Resets
  const resetLearningProgress = useCallback((langOnly = false) => {
    setState(prev => {
      if (langOnly) {
        return {
          ...prev,
          learnedWords: { ...prev.learnedWords, [prev.selectedLanguage]: [] },
          difficultWords: { ...prev.difficultWords, [prev.selectedLanguage]: [] },
          quizHistory: prev.quizHistory.filter(q => q.languageId !== prev.selectedLanguage),
        };
      }
      return {
        ...prev,
        learnedWords: { es: [], fr: [], de: [], ja: [] },
        difficultWords: { es: [], fr: [], de: [], ja: [] },
        quizHistory: [],
      };
    });
  }, []);

  const resetFavorites = useCallback((langOnly = false) => {
    setState(prev => {
      if (langOnly) {
        return {
          ...prev,
          favoriteWords: { ...prev.favoriteWords, [prev.selectedLanguage]: [] },
        };
      }
      return {
        ...prev,
        favoriteWords: { es: [], fr: [], de: [], ja: [] },
      };
    });
  }, []);

  const resetAllData = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setState(DEFAULT_STATE);
  }, []);

  return (
    <LearningContext.Provider
      value={{
        state,
        selectedLanguage,
        setSelectedLanguage,
        theme: state.theme,
        setTheme,
        toggleTheme,
        audioSpeed: state.audioSpeed,
        setAudioSpeed,
        soundEffectsEnabled: state.soundEffectsEnabled,
        setSoundEffectsEnabled,

        isLearned,
        isDifficult,
        isFavorite,
        toggleLearned,
        toggleDifficult,
        toggleFavorite,
        markAsLearned,
        markAsDifficult,

        currentLanguageVocabulary,
        learnedVocabulary,
        difficultVocabulary,
        favoriteVocabulary,

        totalWordsCount,
        learnedCount,
        difficultCount,
        favoriteCount,
        learningPercentage,
        averageQuizScore,
        totalQuizzesTaken,

        recordQuizResult,
        quizHistoryForCurrentLang,

        dailyPractice: currentDailyState,
        dailyPracticeItems,
        completeDailyPracticeItem,
        markDailyPracticeComplete,

        resetLearningProgress,
        resetFavorites,
        resetAllData,
      }}
    >
      {children}
    </LearningContext.Provider>
  );
};

export const useLearning = () => {
  const context = useContext(LearningContext);
  if (!context) {
    throw new Error('useLearning must be used within a LearningProvider');
  }
  return context;
};
