import React, { useEffect } from 'react';
import { X, AlertTriangle, Info, CheckCircle2 } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  type?: 'danger' | 'info' | 'success';
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
  children?: React.ReactNode;
  id?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  type = 'info',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  children,
  id,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const typeIcons = {
    danger: <AlertTriangle className="text-red-500" size={24} />,
    info: <Info className="text-indigo-500" size={24} />,
    success: <CheckCircle2 className="text-emerald-500" size={24} />,
  };

  const confirmBtnStyles = {
    danger: 'bg-red-600 hover:bg-red-700 text-white shadow-xs focus:ring-red-500',
    info: 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs focus:ring-indigo-500',
    success: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs focus:ring-emerald-500',
  };

  return (
    <div id={id} className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-slate-900 p-6 text-left shadow-2xl border border-slate-200 dark:border-slate-800 transition-all duration-200"
      >
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-300"
        >
          <X size={18} />
        </button>

        <div className="flex items-start gap-4">
          <div className="rounded-full bg-slate-100 dark:bg-slate-800 p-2.5 shrink-0">
            {typeIcons[type]}
          </div>
          <div className="flex-1">
            <h3 id="modal-title" className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              {title}
            </h3>
            {description && (
              <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                {description}
              </p>
            )}
            {children && <div className="mt-4">{children}</div>}
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700/80 rounded-xl transition-colors"
          >
            {cancelLabel}
          </button>
          {onConfirm && (
            <button
              type="button"
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className={`px-4 py-2 text-sm font-medium rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${confirmBtnStyles[type]}`}
            >
              {confirmLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
