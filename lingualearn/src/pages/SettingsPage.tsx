import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  Globe, 
  Moon, 
  Sun, 
  Volume2, 
  RotateCcw, 
  Trash2, 
  Check, 
  AlertTriangle,
  Sparkles,
  Layers,
  Info
} from 'lucide-react';
import { useLearning } from '../context/LearningContext';
import { LANGUAGES, LANGUAGE_LIST } from '../data/languages';
import { LanguageSelector } from '../components/common/LanguageSelector';
import { Modal } from '../components/common/Modal';
import { PageId } from '../types';

interface SettingsPageProps {
  onNavigate: (page: PageId) => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ onNavigate }) => {
  const {
    selectedLanguage,
    setSelectedLanguage,
    theme,
    setTheme,
    audioSpeed,
    setAudioSpeed,
    soundEffectsEnabled,
    setSoundEffectsEnabled,
    resetLearningProgress,
    resetFavorites,
    resetAllData,
  } = useLearning();

  const currentLang = LANGUAGES[selectedLanguage];

  // Modal states
  const [modalType, setModalType] = useState<'progress' | 'favorites' | 'all' | null>(null);

  const handleConfirmReset = () => {
    if (modalType === 'progress') {
      resetLearningProgress(false);
    } else if (modalType === 'favorites') {
      resetFavorites(false);
    } else if (modalType === 'all') {
      resetAllData();
    }
    setModalType(null);
  };

  return (
    <div className="space-y-8 pb-12 max-w-3xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900 dark:text-slate-100 tracking-tight">
          Application Settings
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Customize your learning experience, theme preferences, and audio configurations.
        </p>
      </div>

      {/* 1. Target Language Selection */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-7 shadow-xs space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <Globe size={20} />
          </div>
          <div>
            <h2 className="text-base font-bold font-heading text-slate-900 dark:text-slate-100">
              Primary Learning Language
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Select the active language you are currently studying.
            </p>
          </div>
        </div>

        <div className="pt-2">
          <LanguageSelector variant="cards" />
        </div>
      </div>

      {/* 2. Theme & Appearance */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-7 shadow-xs space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
            {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
          </div>
          <div>
            <h2 className="text-base font-bold font-heading text-slate-900 dark:text-slate-100">
              Interface Theme
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Choose your preferred visual mode for daytime or night studying.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            type="button"
            onClick={() => setTheme('light')}
            className={`p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${
              theme === 'light'
                ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 ring-2 ring-indigo-600/20'
                : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <Sun size={20} className="text-amber-500" />
              <div>
                <div className="font-semibold text-sm">Light Mode</div>
                <div className="text-xs text-slate-400">Clean & high-contrast</div>
              </div>
            </div>
            {theme === 'light' && <Check size={18} className="text-indigo-600 stroke-[2.5]" />}
          </button>

          <button
            type="button"
            onClick={() => setTheme('dark')}
            className={`p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${
              theme === 'dark'
                ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 ring-2 ring-indigo-600/20'
                : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <Moon size={20} className="text-indigo-400" />
              <div>
                <div className="font-semibold text-sm">Dark Mode</div>
                <div className="text-xs text-slate-400">Eye-friendly in low light</div>
              </div>
            </div>
            {theme === 'dark' && <Check size={18} className="text-indigo-400 stroke-[2.5]" />}
          </button>
        </div>
      </div>

      {/* 3. Audio & Pronunciation Options */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-7 shadow-xs space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <Volume2 size={20} />
          </div>
          <div>
            <h2 className="text-base font-bold font-heading text-slate-900 dark:text-slate-100">
              Audio & Speech Settings
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Configure pronunciation playback speed and interactive sound effects.
            </p>
          </div>
        </div>

        <div className="space-y-4 pt-2">
          {/* Speech Rate */}
          <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800/80">
            <div>
              <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 block">
                Speech Playback Speed
              </span>
              <span className="text-xs text-slate-400">
                Slower playback can make subtle foreign syllables easier to hear.
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setAudioSpeed(0.8)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  audioSpeed <= 0.85
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                0.8x Slow
              </button>
              <button
                type="button"
                onClick={() => setAudioSpeed(1.0)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  audioSpeed > 0.85
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                1.0x Normal
              </button>
            </div>
          </div>

          {/* Sound Effects Toggle */}
          <div className="flex items-center justify-between py-2">
            <div>
              <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 block">
                Interactive Sound Effects
              </span>
              <span className="text-xs text-slate-400">
                Auditory chimes for correct answers, card flips, and celebrations.
              </span>
            </div>
            <button
              type="button"
              onClick={() => setSoundEffectsEnabled(!soundEffectsEnabled)}
              className={`w-12 h-7 rounded-full transition-colors relative flex items-center p-1 ${
                soundEffectsEnabled ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-xs transform transition-transform ${
                  soundEffectsEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* 4. Data Management & Reset Options */}
      <div className="rounded-3xl border border-red-200/80 dark:border-red-950 bg-white dark:bg-slate-900 p-6 sm:p-7 shadow-xs space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center">
            <AlertTriangle size={20} />
          </div>
          <div>
            <h2 className="text-base font-bold font-heading text-slate-900 dark:text-slate-100">
              Data & Progress Management
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              All learning progress is safely persisted in your browser's local storage.
            </p>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
            <div>
              <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                Reset Learning Progress
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Clears learned words, difficult marks, and quiz test records across all languages.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setModalType('progress')}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950 dark:text-amber-300 dark:hover:bg-amber-900/60 border border-amber-200 dark:border-amber-900 transition-colors self-start sm:self-auto shrink-0"
            >
              Reset Progress
            </button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
            <div>
              <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                Reset Starred Favorites
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Removes all bookmarked items from your favorites library.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setModalType('favorites')}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950 dark:text-amber-300 dark:hover:bg-amber-900/60 border border-amber-200 dark:border-amber-900 transition-colors self-start sm:self-auto shrink-0"
            >
              Reset Favorites
            </button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl border border-red-200 dark:border-red-950 bg-red-50/20 dark:bg-red-950/20">
            <div>
              <h4 className="text-sm font-semibold text-red-900 dark:text-red-300">
                Factory Reset All Data
              </h4>
              <p className="text-xs text-red-700/80 dark:text-red-400/80">
                Completely clears browser storage and resets LinguaLearn to fresh defaults.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setModalType('all')}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors self-start sm:self-auto shrink-0 shadow-xs"
            >
              Reset All
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <Modal
        isOpen={modalType !== null}
        onClose={() => setModalType(null)}
        title={
          modalType === 'progress'
            ? 'Reset Learning Progress?'
            : modalType === 'favorites'
            ? 'Reset Starred Favorites?'
            : 'Factory Reset All Data?'
        }
        description={
          modalType === 'progress'
            ? 'Are you sure you want to reset your learning progress and quiz records? This action cannot be undone.'
            : modalType === 'favorites'
            ? 'Are you sure you want to clear your saved favorites collection?'
            : 'Are you sure you want to completely erase all data including streaks, progress, favorites, and custom settings?'
        }
        type="danger"
        confirmLabel="Confirm Reset"
        onConfirm={handleConfirmReset}
      />
    </div>
  );
};
