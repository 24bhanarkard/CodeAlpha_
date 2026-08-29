import React, { useState } from 'react';
import { Volume2, VolumeX, Loader2 } from 'lucide-react';
import { speakWord } from '../../utils/audio';
import { useLearning } from '../../context/LearningContext';

interface AudioButtonProps {
  text: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'ghost';
  label?: string;
  className?: string;
  id?: string;
}

export const AudioButton: React.FC<AudioButtonProps> = ({
  text,
  size = 'md',
  variant = 'secondary',
  label,
  className = '',
  id,
}) => {
  const { selectedLanguage, audioSpeed } = useLearning();
  const [isPlaying, setIsPlaying] = useState(false);

  const handleSpeak = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isPlaying) return;
    setIsPlaying(true);
    await speakWord(text, selectedLanguage, audioSpeed);
    setIsPlaying(false);
  };

  const sizeClasses = {
    sm: 'p-1.5 text-xs',
    md: 'p-2 text-sm',
    lg: 'p-3 text-base',
  };

  const iconSizes = {
    sm: 15,
    md: 18,
    lg: 22,
  };

  const variantClasses = {
    primary: 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm',
    secondary: 'bg-indigo-50 hover:bg-indigo-100 text-indigo-600 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/60',
    ghost: 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300',
  };

  return (
    <button
      id={id}
      type="button"
      onClick={handleSpeak}
      title="Listen to pronunciation"
      aria-label={`Pronounce ${text}`}
      className={`inline-flex items-center justify-center gap-1.5 rounded-full transition-all duration-150 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
    >
      {isPlaying ? (
        <Volume2 className={`animate-pulse text-indigo-500`} size={iconSizes[size]} />
      ) : (
        <Volume2 size={iconSizes[size]} />
      )}
      {label && <span className="font-medium">{label}</span>}
    </button>
  );
};
