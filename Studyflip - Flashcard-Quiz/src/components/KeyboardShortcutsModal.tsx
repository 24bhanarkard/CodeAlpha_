import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Keyboard, X } from 'lucide-react';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const shortcuts = [
    { key: 'Space', desc: 'Flip flashcard / Show answer' },
    { key: '→ / J', desc: 'Next flashcard' },
    { key: '← / K', desc: 'Previous flashcard' },
    { key: 'M', desc: 'Toggle Needs Practice / Mastered' },
    { key: 'A', desc: 'Add new flashcard' },
    { key: '1', desc: 'Quiz: Needs Practice (in Quiz Mode)' },
    { key: '2', desc: 'Quiz: I Knew It (in Quiz Mode)' },
    { key: 'Esc', desc: 'Close modals / Cancel' },
  ];

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
          className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-2xl p-6 overflow-hidden"
          role="dialog"
          aria-modal="true"
          aria-labelledby="shortcuts-title"
        >
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                <Keyboard className="w-5 h-5" />
              </div>
              <h3 id="shortcuts-title" className="text-lg font-bold text-slate-900 dark:text-white">
                Keyboard Shortcuts
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800/80 my-4">
            {shortcuts.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between py-2.5 text-sm">
                <span className="text-slate-600 dark:text-slate-300">{item.desc}</span>
                <kbd className="px-2.5 py-1 text-xs font-mono font-bold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-xs">
                  {item.key}
                </kbd>
              </div>
            ))}
          </div>

          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl text-sm font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            Got it
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
