import React from 'react';
import { CalendarCheck, Flame, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
import { useLearning } from '../../context/LearningContext';
import { PageId } from '../../types';

interface DailyPracticeWidgetProps {
  onNavigate: (page: PageId) => void;
  id?: string;
}

export const DailyPracticeWidget: React.FC<DailyPracticeWidgetProps> = ({
  onNavigate,
  id,
}) => {
  const { dailyPractice, dailyPracticeItems, state } = useLearning();

  const isDone = dailyPractice.isCompleted;
  const completedCount = dailyPractice.completedItemIds.length;
  const totalCount = dailyPractice.targetItemIds.length || 5;

  return (
    <div
      id={id}
      className="relative overflow-hidden rounded-3xl border border-indigo-100 dark:border-indigo-900/60 bg-gradient-to-br from-indigo-500/10 via-white to-violet-500/10 dark:from-indigo-950/40 dark:via-slate-900 dark:to-violet-950/30 p-6 sm:p-7 shadow-xs"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              <CalendarCheck size={14} />
              Daily Habit
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600 dark:text-amber-400">
              <Flame size={14} className="fill-amber-500 text-amber-500" />
              {state.streak.count} Day Streak
            </span>
          </div>

          <h3 className="text-xl font-bold font-heading text-slate-900 dark:text-slate-100">
            {isDone ? "Today's Practice Completed! 🎉" : "Ready for Today's Quick Drill?"}
          </h3>

          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md">
            {isDone
              ? "You've crushed today's vocabulary drill and extended your streak. Feel free to review again or take a quiz!"
              : "5 targeted words picked just for you to strengthen memory retention and keep your streak alive."}
          </p>
        </div>

        <div className="flex sm:flex-col items-center sm:items-end justify-between gap-3 shrink-0">
          <div className="text-right">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block">
              Progress
            </span>
            <span className="text-lg font-bold font-heading text-indigo-600 dark:text-indigo-400">
              {completedCount}/{totalCount} Words
            </span>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('daily')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-xs active:scale-95 ${
              isDone
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            }`}
          >
            {isDone ? (
              <>
                <CheckCircle2 size={16} />
                <span>Review Drill</span>
              </>
            ) : (
              <>
                <span>Start Practice</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Target Word Pills preview */}
      {dailyPracticeItems.length > 0 && (
        <div className="mt-4 pt-4 border-t border-slate-200/60 dark:border-slate-800/80 flex items-center gap-2 flex-wrap text-xs">
          <span className="text-slate-400 dark:text-slate-500 font-medium">Drill words:</span>
          {dailyPracticeItems.map((item) => {
            const isWordCompleted = dailyPractice.completedItemIds.includes(item.id);
            return (
              <span
                key={item.id}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                  isWordCompleted
                    ? 'bg-emerald-100/80 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 line-through'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                }`}
              >
                {item.text}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
};
