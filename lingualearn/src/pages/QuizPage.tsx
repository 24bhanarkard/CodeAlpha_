import React, { useState, useMemo } from 'react';
import { 
  HelpCircle, 
  Play, 
  Sparkles, 
  RotateCcw, 
  Trophy, 
  Target, 
  BookOpen,
  Filter,
  CheckCircle2,
  AlertCircle,
  ArrowRight
} from 'lucide-react';
import { useLearning } from '../context/LearningContext';
import { generateQuizQuestions } from '../utils/quizGenerator';
import { QuizQuestionCard } from '../components/quiz/QuizQuestionCard';
import { QuizResults } from '../components/quiz/QuizResults';
import { CATEGORIES, CATEGORY_ICONS } from '../data/vocabulary';
import { LANGUAGES } from '../data/languages';
import { Category, PageId, QuizQuestion } from '../types';

interface QuizPageProps {
  onNavigate: (page: PageId) => void;
}

interface AnswerReviewItem {
  question: QuizQuestion;
  selectedAnswer: string;
  isCorrect: boolean;
}

export const QuizPage: React.FC<QuizPageProps> = ({ onNavigate }) => {
  const { 
    selectedLanguage, 
    currentLanguageVocabulary, 
    difficultVocabulary,
    recordQuizResult 
  } = useLearning();

  const currentLang = LANGUAGES[selectedLanguage];

  // Setup state
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [quizState, setQuizState] = useState<'idle' | 'in_progress' | 'completed'>('idle');

  // Active quiz state
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [reviews, setReviews] = useState<AnswerReviewItem[]>([]);

  const startQuiz = (onlyDifficult = false) => {
    const vocabPool = onlyDifficult && difficultVocabulary.length >= 4 
      ? difficultVocabulary 
      : currentLanguageVocabulary;

    const generated = generateQuizQuestions(
      vocabPool,
      selectedLanguage,
      questionCount,
      onlyDifficult ? 'All' : selectedCategory
    );

    if (generated.length === 0) return;

    setQuestions(generated);
    setCurrentQuestionIndex(0);
    setScore(0);
    setReviews([]);
    setQuizState('in_progress');
  };

  const handleAnswer = (isCorrect: boolean, selectedAnswer: string) => {
    const currentQ = questions[currentQuestionIndex];
    const newScore = isCorrect ? score + 1 : score;
    const newReviews = [
      ...reviews,
      {
        question: currentQ,
        selectedAnswer,
        isCorrect,
      },
    ];

    setScore(newScore);
    setReviews(newReviews);

    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Quiz finished
      const finalPercentage = Math.round((newScore / questions.length) * 100);
      recordQuizResult({
        category: selectedCategory,
        totalQuestions: questions.length,
        correctAnswers: newScore,
        incorrectAnswers: questions.length - newScore,
        percentage: finalPercentage,
      });
      setQuizState('completed');
    }
  };

  const handleRestart = () => {
    startQuiz();
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl leading-none">{currentLang.flag}</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900 dark:text-slate-100 tracking-tight">
              Interactive Quiz Mode
            </h1>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Test your {currentLang.name} vocabulary recall, meaning, and translation accuracy.
          </p>
        </div>

        {quizState !== 'idle' && (
          <button
            type="button"
            onClick={() => setQuizState('idle')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all self-start sm:self-auto"
          >
            <RotateCcw size={15} />
            <span>Quit to Setup</span>
          </button>
        )}
      </div>

      {/* QUIZ SETUP SCREEN */}
      {quizState === 'idle' && (
        <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-200">
          {/* Main Setup Box */}
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-md space-y-6">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <Target size={24} />
              </div>
              <div>
                <h2 className="text-lg font-bold font-heading text-slate-900 dark:text-slate-100">
                  Configure Your Quiz
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                  Choose your topic and number of multiple choice questions.
                </p>
              </div>
            </div>

            {/* Category Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                1. Select Topic / Category
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <button
                  type="button"
                  onClick={() => setSelectedCategory('All')}
                  className={`p-3 rounded-xl border text-xs font-semibold transition-all ${
                    selectedCategory === 'All'
                      ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 ring-2 ring-indigo-600/20'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="text-base mb-1">🌟</div>
                  <div>All Topics</div>
                </button>

                {CATEGORIES.map((cat) => {
                  const isSelected = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={`p-3 rounded-xl border text-xs font-semibold transition-all ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 ring-2 ring-indigo-600/20'
                          : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="text-base mb-1">{CATEGORY_ICONS[cat]}</div>
                      <div className="truncate">{cat}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Question Count Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                2. Number of Questions
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[5, 10, 15].map((cnt) => {
                  const isSelected = questionCount === cnt;
                  return (
                    <button
                      key={cnt}
                      type="button"
                      onClick={() => setQuestionCount(cnt)}
                      className={`py-3 rounded-xl border text-sm font-semibold transition-all ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 ring-2 ring-indigo-600/20'
                          : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {cnt} Questions
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Action Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => startQuiz(false)}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-base shadow-md transition-all active:scale-95"
              >
                <Play size={18} className="fill-white" />
                <span>Start Quiz ({questionCount} Questions)</span>
              </button>
            </div>
          </div>

          {/* Quick Drill for Difficult Words if available */}
          {difficultVocabulary.length >= 3 && (
            <div className="p-5 rounded-3xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/40 dark:bg-amber-950/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-amber-100 dark:bg-amber-900/60 text-amber-600 dark:text-amber-300 flex items-center justify-center shrink-0">
                  <AlertCircle size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    Targeted Review: {difficultVocabulary.length} Needs Practice Words
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Strengthen words you previously struggled with.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => startQuiz(true)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs transition-all shadow-xs shrink-0 self-start sm:self-auto"
              >
                <span>Drill Difficult Words</span>
                <ArrowRight size={14} />
              </button>
            </div>
          )}
        </div>
      )}

      {/* ACTIVE QUIZ SCREEN */}
      {quizState === 'in_progress' && questions.length > 0 && (
        <QuizQuestionCard
          question={questions[currentQuestionIndex]}
          questionNumber={currentQuestionIndex + 1}
          totalQuestions={questions.length}
          onAnswer={handleAnswer}
        />
      )}

      {/* QUIZ RESULTS SCREEN */}
      {quizState === 'completed' && (
        <QuizResults
          score={score}
          totalQuestions={questions.length}
          reviews={reviews}
          onRestart={handleRestart}
          onNavigate={onNavigate}
        />
      )}
    </div>
  );
};
