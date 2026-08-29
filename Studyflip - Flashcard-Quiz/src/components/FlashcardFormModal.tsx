import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, Edit2, AlertCircle, Sparkles, Tag } from 'lucide-react';
import { FlashcardItem, Difficulty } from '../types';
import { AVAILABLE_CATEGORIES } from '../data/initialData';

interface FlashcardFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (cardData: { question: string; answer: string; difficulty: Difficulty; category?: string }) => void;
  initialCard?: FlashcardItem | null;
}

export const FlashcardFormModal: React.FC<FlashcardFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialCard,
}) => {
  const isEditing = !!initialCard;
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty>('normal');
  const [category, setCategory] = useState('Computer Science Basics');
  const [customCategory, setCustomCategory] = useState('');
  const [errors, setErrors] = useState<{ question?: string; answer?: string }>({});

  useEffect(() => {
    if (initialCard) {
      setQuestion(initialCard.question);
      setAnswer(initialCard.answer);
      setDifficulty(initialCard.difficulty);
      if (initialCard.category && AVAILABLE_CATEGORIES.includes(initialCard.category)) {
        setCategory(initialCard.category);
        setCustomCategory('');
      } else if (initialCard.category) {
        setCategory('Custom');
        setCustomCategory(initialCard.category);
      } else {
        setCategory('General');
      }
    } else {
      setQuestion('');
      setAnswer('');
      setDifficulty('normal');
      setCategory('General');
      setCustomCategory('');
    }
    setErrors({});
  }, [initialCard, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { question?: string; answer?: string } = {};

    if (!question.trim()) {
      newErrors.question = 'Question is required.';
    }
    if (!answer.trim()) {
      newErrors.answer = 'Answer is required.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const finalCategory = category === 'Custom' && customCategory.trim() ? customCategory.trim() : category;

    onSave({
      question: question.trim(),
      answer: answer.trim(),
      difficulty,
      category: finalCategory || 'General',
    });

    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-2xl overflow-hidden"
          role="dialog"
          aria-modal="true"
          aria-labelledby="flashcard-modal-title"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                {isEditing ? <Edit2 className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
              </div>
              <h2 id="flashcard-modal-title" className="text-xl font-bold text-slate-900 dark:text-white">
                {isEditing ? 'Edit Flashcard' : 'Add New Flashcard'}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Question input */}
            <div>
              <label htmlFor="card-question" className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2">
                Question <span className="text-rose-500">*</span>
              </label>
              <textarea
                id="card-question"
                rows={3}
                value={question}
                onChange={(e) => {
                  setQuestion(e.target.value);
                  if (errors.question) setErrors((prev) => ({ ...prev, question: undefined }));
                }}
                placeholder="e.g., What is polymorphism in OOP?"
                className={`w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 transition-all ${
                  errors.question
                    ? 'border-rose-500 focus:ring-rose-500/20'
                    : 'border-slate-200 dark:border-slate-700 focus:border-indigo-500 focus:ring-indigo-500/20'
                }`}
              />
              {errors.question && (
                <p className="flex items-center gap-1 text-xs text-rose-500 mt-1.5 font-medium">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.question}
                </p>
              )}
            </div>

            {/* Answer input */}
            <div>
              <label htmlFor="card-answer" className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2">
                Answer <span className="text-rose-500">*</span>
              </label>
              <textarea
                id="card-answer"
                rows={4}
                value={answer}
                onChange={(e) => {
                  setAnswer(e.target.value);
                  if (errors.answer) setErrors((prev) => ({ ...prev, answer: undefined }));
                }}
                placeholder="e.g., The ability of an object to take on many forms via method overriding or overloading."
                className={`w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 transition-all ${
                  errors.answer
                    ? 'border-rose-500 focus:ring-rose-500/20'
                    : 'border-slate-200 dark:border-slate-700 focus:border-indigo-500 focus:ring-indigo-500/20'
                }`}
              />
              {errors.answer && (
                <p className="flex items-center gap-1 text-xs text-rose-500 mt-1.5 font-medium">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.answer}
                </p>
              )}
            </div>

            {/* Category selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="card-category" className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2">
                  Category
                </label>
                <select
                  id="card-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
                >
                  {AVAILABLE_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                  <option value="Custom">+ Add Custom Category</option>
                </select>
              </div>

              {/* Initial Difficulty Status */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2">
                  Difficulty Status
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setDifficulty('normal')}
                    className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all ${
                      difficulty === 'normal'
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700 shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    Normal
                  </button>
                  <button
                    type="button"
                    onClick={() => setDifficulty('needs-practice')}
                    className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all ${
                      difficulty === 'needs-practice'
                        ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-700 shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    Needs Practice
                  </button>
                </div>
              </div>
            </div>

            {category === 'Custom' && (
              <div>
                <label htmlFor="card-custom-category" className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2">
                  Custom Category Name
                </label>
                <input
                  id="card-custom-category"
                  type="text"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  placeholder="e.g., Computer Networks, System Design"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                id="btn-submit-flashcard"
                type="submit"
                className="px-6 py-2.5 rounded-xl text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20 transition-all active:scale-95"
              >
                {isEditing ? 'Save Changes' : 'Create Flashcard'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
