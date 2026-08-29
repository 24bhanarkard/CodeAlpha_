import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { ToastMessage } from '../types';

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  return (
    <div
      id="toast-container"
      className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none"
    >
      <AnimatePresence>
        {toasts.map((toast) => {
          const isSuccess = toast.type === 'success';
          const isError = toast.type === 'error';
          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={`pointer-events-auto flex items-center justify-between p-4 rounded-xl shadow-lg border backdrop-blur-md ${
                isSuccess
                  ? 'bg-emerald-50/95 dark:bg-emerald-950/90 text-emerald-900 dark:text-emerald-100 border-emerald-200 dark:border-emerald-800'
                  : isError
                  ? 'bg-rose-50/95 dark:bg-rose-950/90 text-rose-900 dark:text-rose-100 border-rose-200 dark:border-rose-800'
                  : 'bg-indigo-50/95 dark:bg-indigo-950/90 text-indigo-900 dark:text-indigo-100 border-indigo-200 dark:border-indigo-800'
              }`}
            >
              <div className="flex items-center gap-3">
                {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />}
                {isError && <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />}
                {!isSuccess && !isError && <Info className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0" />}
                <p className="text-sm font-medium">{toast.message}</p>
              </div>
              <button
                onClick={() => onDismiss(toast.id)}
                className="p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors ml-2"
                aria-label="Dismiss toast"
              >
                <X className="w-4 h-4 opacity-70" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
