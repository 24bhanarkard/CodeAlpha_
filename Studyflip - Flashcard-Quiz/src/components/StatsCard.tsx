import React, { ReactNode } from 'react';

interface StatsCardProps {
  id?: string;
  icon: ReactNode;
  label: string;
  value: string | number;
  sublabel?: string;
  colorClass?: string;
  badge?: string;
  onClick?: () => void;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  id,
  icon,
  label,
  value,
  sublabel,
  colorClass = 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400',
  badge,
  onClick,
}) => {
  return (
    <div
      id={id}
      onClick={onClick}
      className={`relative bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 flex items-center gap-4 transition-all duration-200 ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >
      {/* Bento Icon/Value Box */}
      <div className={`w-12 h-12 rounded-xl ${colorClass} flex items-center justify-center font-black text-base shrink-0 shadow-xs`}>
        {icon}
      </div>

      {/* Bento Text Details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-1">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 truncate">
            {label}
          </p>
          {badge && (
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              {badge}
            </span>
          )}
        </div>
        <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight truncate mt-0.5">
          {value}
        </p>
        {sublabel && (
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium truncate mt-0.5">
            {sublabel}
          </p>
        )}
      </div>
    </div>
  );
};
