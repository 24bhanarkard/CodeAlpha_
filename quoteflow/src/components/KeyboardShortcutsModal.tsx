import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Keyboard } from 'lucide-react';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({
  isOpen,
  onClose
}) => {
  const shortcuts = [
    { key: 'Space / N', label: 'Generate a new random quote' },
    { key: 'F', label: 'Add or remove quote from favorites' },
    { key: 'C', label: 'Copy quote and author to clipboard' },
    { key: 'H', label: 'Open Share modal (Image & Text)' },
    { key: 'T', label: 'Toggle dark / light theme' },
    { key: 'S', label: 'Open / close saved favorites panel' },
    { key: 'Esc', label: 'Close any active panel or dialog' }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4" 
          role="dialog" 
          aria-modal="true" 
          aria-labelledby="shortcuts-title"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-stone-950/50 backdrop-blur-xs"
            aria-hidden="true"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-md rounded-3xl bg-white dark:bg-[#1C1412] border border-amber-200/80 dark:border-stone-800 shadow-2xl p-6 sm:p-8 z-10"
          >
            <div className="flex items-center justify-between pb-4 border-b border-amber-100 dark:border-stone-800">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center shadow-md shadow-orange-500/20">
                  <Keyboard className="w-5 h-5" />
                </div>
                <h3 id="shortcuts-title" className="font-bold text-lg text-stone-900 dark:text-stone-100">
                  Keyboard Shortcuts
                </h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-amber-100/60 dark:hover:bg-stone-800 transition-colors cursor-pointer"
                aria-label="Close shortcuts dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-5 space-y-3.5">
              {shortcuts.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-sm py-1">
                  <span className="text-stone-600 dark:text-stone-300 font-medium">
                    {item.label}
                  </span>
                  <kbd className="px-3 py-1 text-xs font-mono font-bold bg-amber-50 dark:bg-stone-900 text-stone-800 dark:text-stone-200 rounded-lg border border-amber-200/80 dark:border-stone-700 shadow-2xs">
                    {item.key}
                  </kbd>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-amber-100 dark:border-stone-800">
              <button
                type="button"
                onClick={onClose}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 hover:from-amber-600 hover:to-rose-700 text-white text-sm font-bold shadow-lg shadow-orange-500/20 transition-all cursor-pointer"
              >
                Got it
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
