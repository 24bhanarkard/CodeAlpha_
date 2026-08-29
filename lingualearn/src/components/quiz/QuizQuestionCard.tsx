import React, { useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  HelpCircle,
  Volume2,
  Sparkles
} from 'lucide-react';
import { QuizQuestion } from '../../types';
import { AudioButton } from '../common/AudioButton';
import { useLearning } from '../../context/LearningContext';
import { soundFx } from '../../utils/audio';

interface QuizQuestionCardProps {
  question: QuizQuestion;
  questionNumber: number;
  totalQuestions: number;
  onAnswer: (isCorrect: boolean, selectedAnswer: string) => void;
  id?: string;
}

export const QuizQuestionCard: React.FC<QuizQuestionCardProps> = ({
  question,
  questionNumber,
  totalQuestions,
  onAnswer,
  id,
}) => {
  const { soundEffectsEnabled, markAsDifficult, markAsLearned } = useLearning();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const handleSelectOption = (option: string) => {
    if (hasSubmitted) return;

    setSelectedOption(option);
    setHasSubmitted(true);

    const isCorrect = option === question.correctAnswer;
    if (isCorrect) {
      soundFx.playCorrectSound(soundEffectsEnabled);
      markAsLearned(question.vocabularyId);
    } else {
      soundFx.playIncorrectSound(soundEffectsEnabled);
      markAsDifficult(question.vocabularyId);
    }
  };

  const handleContinue = () => {
    if (!selectedOption) return;
    const isCorrect = selectedOption === question.correctAnswer;
    onAnswer(isCorrect, selectedOption);
  };

  const optionLetters = ['A', 'B', 'C', 'D'];

  return (
    <div id={id} className="w-full max-w-2xl mx-auto rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-xl">
      {/* Top Header: Question count & Category */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-3 py-1 rounded-full border border-indigo-100 dark:border-indigo-900">
          Question {questionNumber} of {totalQuestions}
        </span>

        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
          Topic: {question.category}
        </span>
      </div>

      {/* Progress line */}
      <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full mb-6 overflow-hidden">
        <div 
          className="h-full bg-indigo-600 dark:bg-indigo-500 rounded-full transition-all duration-300"
          style={{ width: `${((questionNumber) / totalQuestions) * 100}%` }}
        />
      </div>

      {/* Question Prompt */}
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-bold font-heading text-slate-900 dark:text-slate-100 leading-snug mb-3">
          {question.prompt}
        </h2>

        {question.targetWord && (
          <div className="inline-flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80">
            <span className="text-lg font-bold text-slate-900 dark:text-slate-100">
              {question.targetWord}
            </span>
            {question.pronunciation && (
              <span className="text-xs font-mono text-slate-400 dark:text-slate-500">
                [{question.pronunciation}]
              </span>
            )}
            <AudioButton text={question.targetWord} size="sm" variant="secondary" />
          </div>
        )}
      </div>

      {/* Options (A, B, C, D) */}
      <div className="space-y-3 mb-6">
        {question.options.map((option, index) => {
          const letter = optionLetters[index] || '•';
          const isSelected = selectedOption === option;
          const isCorrect = option === question.correctAnswer;

          let buttonStyle = 'border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50';
          let letterStyle = 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400';

          if (hasSubmitted) {
            if (isCorrect) {
              buttonStyle = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 ring-2 ring-emerald-500/20';
              letterStyle = 'bg-emerald-600 text-white';
            } else if (isSelected && !isCorrect) {
              buttonStyle = 'border-red-500 bg-red-50 dark:bg-red-950/40 text-red-900 dark:text-red-200 ring-2 ring-red-500/20';
              letterStyle = 'bg-red-600 text-white';
            } else {
              buttonStyle = 'opacity-50 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900';
            }
          }

          return (
            <button
              key={option}
              type="button"
              disabled={hasSubmitted}
              onClick={() => handleSelectOption(option)}
              className={`w-full flex items-center justify-between p-4 rounded-2xl border text-left font-medium text-sm sm:text-base transition-all duration-200 ${buttonStyle} focus:outline-none`}
            >
              <div className="flex items-center gap-3.5">
                <span className={`h-8 w-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${letterStyle}`}>
                  {letter}
                </span>
                <span className="font-medium leading-normal">{option}</span>
              </div>

              {hasSubmitted && (
                <div>
                  {isCorrect && (
                    <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 size={18} className="stroke-[2.5]" />
                      <span className="hidden sm:inline">Correct</span>
                    </span>
                  )}
                  {isSelected && !isCorrect && (
                    <span className="flex items-center gap-1 text-xs font-bold text-red-600 dark:text-red-400">
                      <XCircle size={18} className="stroke-[2.5]" />
                      <span className="hidden sm:inline">Incorrect</span>
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Answer Explanation & Continue Button */}
      {hasSubmitted && (
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className={`p-4 rounded-2xl mb-4 ${
            selectedOption === question.correctAnswer 
              ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/60' 
              : 'bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60'
          }`}>
            <div className="flex items-start gap-2.5">
              <Sparkles size={18} className={selectedOption === question.correctAnswer ? 'text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5' : 'text-amber-600 dark:text-amber-400 shrink-0 mt-0.5'} />
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  {selectedOption === question.correctAnswer ? 'Well Done!' : 'Explanation'}
                </p>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
                  {question.explanation}
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleContinue}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md transition-all active:scale-95"
            >
              <span>{questionNumber === totalQuestions ? 'View Results' : 'Next Question'}</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
