import React, { useRef } from 'react';
import {
  Sun,
  Moon,
  Download,
  Upload,
  RotateCcw,
  Trash2,
  CheckCircle2,
  Database,
  Layers,
  GraduationCap,
  Sparkles,
} from 'lucide-react';
import { FlashcardItem } from '../types';
import { exportDeckToJson } from '../utils/helpers';

interface SettingsProps {
  cards: FlashcardItem[];
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean | ((prev: boolean) => boolean)) => void;
  onRestoreDefaults: () => void;
  onClearAll: () => void;
  onImportCards: (cards: FlashcardItem[]) => void;
}

export const Settings: React.FC<SettingsProps> = ({
  cards,
  isDarkMode,
  setIsDarkMode,
  onRestoreDefaults,
  onClearAll,
  onImportCards,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    exportDeckToJson(cards, `studyflip-backup-${new Date().toISOString().slice(0, 10)}.json`);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Normalize items
          const validCards: FlashcardItem[] = parsed.map((item, index) => ({
            id: item.id || `imported-${Date.now()}-${index}`,
            question: item.question || 'Untitled Question',
            answer: item.answer || 'Untitled Answer',
            difficulty: item.difficulty === 'needs-practice' ? 'needs-practice' : 'normal',
            category: item.category || 'Imported',
            createdAt: item.createdAt || Date.now(),
            timesReviewed: item.timesReviewed || 0,
            timesCorrect: item.timesCorrect || 0,
          }));

          onImportCards(validCards);
        } else {
          alert('Invalid JSON file format. Expected an array of flashcards.');
        }
      } catch (err) {
        alert('Could not parse the JSON file. Please check file validity.');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* 1. Appearance & Theme */}
      <section className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
            {isDarkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Appearance & Theme</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Customize interface colors and light/dark theme preference
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setIsDarkMode(false)}
            className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-3 transition-all ${
              !isDarkMode
                ? 'border-indigo-600 bg-indigo-50/40 text-indigo-900'
                : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-slate-600 dark:text-slate-400'
            }`}
          >
            <div className="p-3 rounded-full bg-amber-100 text-amber-600">
              <Sun className="w-6 h-6" />
            </div>
            <div className="text-center">
              <p className="font-bold text-sm">Light Mode</p>
              <p className="text-xs opacity-75">Clean and crisp</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setIsDarkMode(true)}
            className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-3 transition-all ${
              isDarkMode
                ? 'border-indigo-500 bg-indigo-950/40 text-indigo-200'
                : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-slate-600 dark:text-slate-400'
            }`}
          >
            <div className="p-3 rounded-full bg-indigo-900/60 text-indigo-400">
              <Moon className="w-6 h-6" />
            </div>
            <div className="text-center">
              <p className="font-bold text-sm">Dark Mode</p>
              <p className="text-xs opacity-75">Easy on the eyes</p>
            </div>
          </button>
        </div>
      </section>

      {/* 2. Deck Data Management & Backup */}
      <section className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Deck Storage & Backup</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Export your study deck, import custom flashcard sets, or restore sample data
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">Export Flashcard Deck</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Save your {cards.length} flashcards as a JSON file backup.
              </p>
            </div>
            <button
              id="btn-export-deck"
              type="button"
              onClick={handleExport}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 shadow-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
            >
              <Download className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Export JSON</span>
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">Import Flashcards</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Load flashcards from a JSON backup file.
              </p>
            </div>
            <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 shadow-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer">
              <Upload className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Import JSON</span>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json,application/json"
                onChange={handleImportFile}
                className="hidden"
              />
            </label>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">Restore Sample Deck</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Re-load the 10 Computer Science starter flashcards.
              </p>
            </div>
            <button
              id="btn-restore-sample"
              type="button"
              onClick={onRestoreDefaults}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 shadow-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
            >
              <RotateCcw className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Restore Samples</span>
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40 flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="text-sm font-bold text-rose-900 dark:text-rose-200">Clear All Flashcards</p>
              <p className="text-xs text-rose-600 dark:text-rose-400">
                Permanently erase all flashcards from browser storage.
              </p>
            </div>
            <button
              id="btn-clear-all-cards"
              type="button"
              onClick={onClearAll}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-xs transition-all"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear All</span>
            </button>
          </div>
        </div>
      </section>

      {/* 3. Project Overview & About */}
      <section className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">StudyFlip Assignment Project</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">College App Development Submission</p>
          </div>
        </div>

        <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          <p>
            StudyFlip is built with modern React 19, TypeScript, Tailwind CSS, Motion 3D animations, and browser LocalStorage persistence without backend requirements.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Smooth 3D Flip Card Animation</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Full CRUD (Add, Edit, Delete, View)</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Active Recall Quiz with Score Tracker</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>LocalStorage Persistence & Dark Mode</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
