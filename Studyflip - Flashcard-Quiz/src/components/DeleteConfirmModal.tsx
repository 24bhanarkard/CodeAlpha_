import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { FlashcardItem } from '../types';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  card: FlashcardItem | null;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  card,
  onClose,
  onConfirm,
}) => {
  if (!isOpen || !card) return null;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-2xl overflow-hidden p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-modal-title"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <h3 id="delete-modal-title" className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            Delete Flashcard?
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
            Are you sure you want to delete this flashcard? This action cannot be undone.
          </p>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 mb-6 text-sm text-slate-700 dark:text-slate-200 italic line-clamp-2">
            "{card.question}"
          </div>

          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              id="btn-confirm-delete"
              type="button"
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-500/20 transition-all active:scale-95"
            >
              <Trash2 className="w-4 h-4" />
              Delete Card
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
