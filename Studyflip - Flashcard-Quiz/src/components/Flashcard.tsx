import React from 'react';
import { motion } from 'motion/react';
import { RotateCw, Volume2, Sparkles, AlertCircle, CheckCircle, Tag } from 'lucide-react';
import { FlashcardItem } from '../types';
import { speakText } from '../utils/helpers';

interface FlashcardProps {
  card: FlashcardItem;
  currentIndex: number;
  totalCards: number;
  isFlipped: boolean;
  onFlip: () => void;
  onToggleDifficulty: () => void;
}

export const Flashcard: React.FC<FlashcardProps> = ({
  card,
  currentIndex,
  totalCards,
  isFlipped,
  onFlip,
  onToggleDifficulty,
}) => {
  const isDifficult = card.difficulty === 'needs-practice';

  const handleSpeak = (e: React.MouseEvent, text: string) => {
    e.stopPropagation();
    speakText(text);
  };

  const handleDifficultyClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleDifficulty();
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center">
      {/* 3D Perspective Card Container */}
      <div
        id="flashcard-container"
        className="w-full h-80 sm:h-96 cursor-pointer select-none perspective-1000 group"
        onClick={onFlip}
        role="button"
        tabIndex={0}
        aria-label={`Flashcard: ${isFlipped ? 'Answer' : 'Question'}. Click or press space to flip.`}
        onKeyDown={(e) => {
          if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            onFlip();
          }
        }}
      >
        <motion.div
          className="w-full h-full relative preserve-3d"
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.55, type: 'spring', stiffness: 220, damping: 22 }}
        >
          {/* ================= FRONT SIDE (QUESTION) ================= */}
          <div
            className="absolute inset-0 backface-hidden rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xl group-hover:shadow-2xl group-hover:border-indigo-300 dark:group-hover:border-indigo-700/60 transition-all duration-300 p-6 sm:p-10 flex flex-col justify-between overflow-hidden"
          >
            {/* Top Decorative accent border line */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-slate-100 dark:bg-slate-800">
              <div
                className="h-full bg-indigo-600 transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / totalCards) * 100}%` }}
              />
            </div>

            {/* Top Bar of Front Card */}
            <div className="flex items-center justify-between gap-2 pt-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 text-[11px] font-black uppercase tracking-widest border border-indigo-100 dark:border-indigo-900/60">
                  <Sparkles className="w-3 h-3" />
                  Question
                </span>
                {card.category && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold">
                    <Tag className="w-3 h-3 opacity-60" />
                    {card.category}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={(e) => handleSpeak(e, card.question)}
                  title="Read question aloud"
                  aria-label="Read question aloud"
                  className="p-2 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleDifficultyClick}
                  title={isDifficult ? 'Marked as Needs Practice' : 'Mark as Needs Practice'}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border transition-all ${
                    isDifficult
                      ? 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                      : 'bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                  }`}
                >
                  {isDifficult ? (
                    <>
                      <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                      Needs Practice
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-3.5 h-3.5 text-slate-400" />
                      Mastered
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Question Content */}
            <div className="my-auto py-4 text-center">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-snug tracking-tight">
                {card.question}
              </h2>
            </div>

            {/* Bottom Hint */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800/80 text-xs text-slate-400 dark:text-slate-500">
              <span className="font-semibold">Card {currentIndex + 1} of {totalCards}</span>
              <span className="flex items-center gap-1.5 font-bold group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                <RotateCw className="w-3.5 h-3.5" />
                Click card or button to reveal answer
              </span>
            </div>
          </div>

          {/* ================= BACK SIDE (ANSWER) ================= */}
          <div
            className="absolute inset-0 backface-hidden rounded-3xl bg-slate-900 dark:bg-slate-950 border border-slate-800 shadow-2xl p-6 sm:p-10 flex flex-col justify-between text-white overflow-hidden"
            style={{ transform: 'rotateY(180deg)' }}
          >
            {/* Top Decorative accent border line */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-slate-800">
              <div
                className="h-full bg-emerald-500 transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / totalCards) * 100}%` }}
              />
            </div>

            {/* Top Bar of Back Card */}
            <div className="flex items-center justify-between gap-2 pt-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-black uppercase tracking-widest border border-emerald-500/30">
                  <CheckCircle className="w-3 h-3 text-emerald-400" />
                  Answer
                </span>
                {card.category && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/10 text-indigo-100 text-xs font-semibold">
                    <Tag className="w-3 h-3 opacity-60" />
                    {card.category}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={(e) => handleSpeak(e, card.answer)}
                  title="Read answer aloud"
                  aria-label="Read answer aloud"
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleDifficultyClick}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border transition-all ${
                    isDifficult
                      ? 'bg-amber-500/20 text-amber-200 border-amber-400/40'
                      : 'bg-emerald-500/20 text-emerald-200 border-emerald-400/40'
                  }`}
                >
                  {isDifficult ? 'Needs Practice' : 'Mastered'}
                </button>
              </div>
            </div>

            {/* Answer Content */}
            <div className="my-auto py-4 text-center overflow-y-auto max-h-48 pr-1">
              <p className="text-lg sm:text-xl md:text-2xl font-semibold text-slate-100 leading-relaxed">
                {card.answer}
              </p>
            </div>

            {/* Bottom Hint */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-800 text-xs text-slate-400">
              <span className="font-semibold">Card {currentIndex + 1} of {totalCards}</span>
              <span className="flex items-center gap-1.5 font-bold hover:text-white transition-colors">
                <RotateCw className="w-3.5 h-3.5" />
                Click card to flip back to question
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bento-styled Show/Hide Answer Button */}
      <div className="mt-5 flex items-center justify-center gap-3">
        <button
          id="btn-toggle-answer"
          type="button"
          onClick={onFlip}
          className={`inline-flex items-center gap-2 px-8 py-3 rounded-full font-extrabold text-sm shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95 ${
            isFlipped
              ? 'bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-slate-200/50 dark:shadow-none'
              : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/25'
          }`}
        >
          <RotateCw className={`w-4 h-4 transition-transform duration-300 ${isFlipped ? 'rotate-180' : ''}`} />
          {isFlipped ? 'Hide Answer (Flip Back)' : 'Show Answer'}
        </button>
      </div>
    </div>
  );
};
