import React from 'react';

interface ProgressBarProps {
  value: number; // 0 to 100
  max?: number;
  label?: string;
  sublabel?: string;
  color?: 'indigo' | 'emerald' | 'amber' | 'blue' | 'rose';
  size?: 'sm' | 'md' | 'lg';
  showPercentage?: boolean;
  className?: string;
  id?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  label,
  sublabel,
  color = 'indigo',
  size = 'md',
  showPercentage = true,
  className = '',
  id,
}) => {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100)));

  const colorStyles = {
    indigo: 'bg-indigo-600 dark:bg-indigo-500',
    emerald: 'bg-emerald-600 dark:bg-emerald-500',
    amber: 'bg-amber-500 dark:bg-amber-400',
    blue: 'bg-blue-600 dark:bg-blue-500',
    rose: 'bg-rose-500 dark:bg-rose-400',
  };

  const heightStyles = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  return (
    <div id={id} className={`w-full ${className}`}>
      {(label || showPercentage) && (
        <div className="flex justify-between items-center mb-1.5 text-xs sm:text-sm font-medium">
          <div className="flex items-center gap-2">
            {label && <span className="text-slate-700 dark:text-slate-200">{label}</span>}
            {sublabel && <span className="text-slate-400 dark:text-slate-500 text-xs">({sublabel})</span>}
          </div>
          {showPercentage && (
            <span className="font-semibold text-slate-900 dark:text-slate-100">{percentage}%</span>
          )}
        </div>
      )}
      <div className={`w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden ${heightStyles[size]}`}>
        <div
          className={`${heightStyles[size]} ${colorStyles[color]} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={percentage}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  );
};
