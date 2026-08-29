import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Globe } from 'lucide-react';
import { useLearning } from '../../context/LearningContext';
import { LANGUAGES, LANGUAGE_LIST } from '../../data/languages';
import { LanguageId } from '../../types';

interface LanguageSelectorProps {
  variant?: 'compact' | 'full' | 'cards';
  onSelect?: () => void;
  id?: string;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  variant = 'compact',
  onSelect,
  id,
}) => {
  const { selectedLanguage, setSelectedLanguage, state } = useLearning();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLang = LANGUAGES[selectedLanguage];

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (langId: LanguageId) => {
    setSelectedLanguage(langId);
    setIsOpen(false);
    if (onSelect) onSelect();
  };

  if (variant === 'cards') {
    return (
      <div id={id} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {LANGUAGE_LIST.map((lang) => {
          const isSelected = lang.id === selectedLanguage;
          const learnedCount = (state.learnedWords[lang.id] || []).length;
          
          return (
            <button
              key={lang.id}
              type="button"
              onClick={() => handleSelect(lang.id)}
              className={`p-4 rounded-xl border text-left transition-all duration-200 relative overflow-hidden flex flex-col justify-between ${
                isSelected
                  ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 dark:border-indigo-500 shadow-sm ring-2 ring-indigo-600/20'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-xs'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl filter drop-shadow-xs" role="img" aria-label={lang.name}>
                    {lang.flag}
                  </span>
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-slate-100">{lang.name}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{lang.nativeName}</p>
                  </div>
                </div>
                {isSelected && (
                  <span className="h-6 w-6 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                    <Check size={14} className="stroke-[3]" />
                  </span>
                )}
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex justify-between items-center text-xs">
                <span className="text-slate-500 dark:text-slate-400">Learned items</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                  {learnedCount} words
                </span>
              </div>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div id={id} ref={dropdownRef} className="relative inline-block text-left">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/70 text-slate-800 dark:text-slate-200 transition-colors shadow-2xs font-medium text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        <span className="text-lg leading-none">{currentLang.flag}</span>
        <span className="font-semibold">{currentLang.name}</span>
        <span className="text-xs text-slate-400 dark:text-slate-500 hidden sm:inline">({currentLang.nativeName})</span>
        <ChevronDown size={15} className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-60 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl z-50 py-1.5 divide-y divide-slate-100 dark:divide-slate-800/60 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Switch Target Language
          </div>
          <div className="py-1">
            {LANGUAGE_LIST.map((lang) => {
              const isSelected = lang.id === selectedLanguage;
              return (
                <button
                  key={lang.id}
                  type="button"
                  onClick={() => handleSelect(lang.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 text-sm transition-colors text-left ${
                    isSelected
                      ? 'bg-indigo-50/80 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300 font-semibold'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl leading-none">{lang.flag}</span>
                    <div>
                      <div>{lang.name}</div>
                      <div className="text-xs text-slate-400 dark:text-slate-500 font-normal">{lang.nativeName}</div>
                    </div>
                  </div>
                  {isSelected && <Check size={16} className="text-indigo-600 dark:text-indigo-400 stroke-[2.5]" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
