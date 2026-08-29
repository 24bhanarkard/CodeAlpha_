import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, Info } from 'lucide-react';
import { ToastInfo } from '../types';

interface ToastProps {
  toast: ToastInfo | null;
}

export const Toast: React.FC<ToastProps> = ({ toast }) => {
  return (
    <div 
      className="fixed bottom-6 right-6 z-50 pointer-events-none flex flex-col items-end gap-2"
      aria-live="polite"
      aria-atomic="true"
    >
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-stone-900/95 dark:bg-stone-100/95 text-stone-100 dark:text-stone-900 shadow-2xl border border-stone-800 dark:border-stone-200 backdrop-blur-md text-sm font-bold"
            role="status"
          >
            {toast.type === 'info' ? (
              <Info className="w-4 h-4 text-amber-400 dark:text-amber-600 shrink-0" />
            ) : (
              <CheckCircle className="w-4 h-4 text-emerald-400 dark:text-emerald-600 shrink-0" />
            )}
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
