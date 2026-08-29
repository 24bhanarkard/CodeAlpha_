import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  User,
  Mail,
  Target,
  Flame,
  Award,
  CheckCircle,
  Calendar,
  Sparkles,
  Sun,
  Moon,
  Zap,
} from 'lucide-react';
import { UserProfile, FlashcardItem } from '../types';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onSaveProfile: (profile: UserProfile) => void;
  cards: FlashcardItem[];
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean | ((prev: boolean) => boolean)) => void;
  onStartQuiz: () => void;
}

const AVATAR_COLORS = [
  'bg-indigo-600',
  'bg-emerald-600',
  'bg-purple-600',
  'bg-amber-600',
  'bg-rose-600',
  'bg-blue-600',
  'bg-slate-800',
];

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSaveProfile,
  cards,
  isDarkMode,
  setIsDarkMode,
  onStartQuiz,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UserProfile>(profile);

  if (!isOpen) return null;

  const totalCards = cards.length;
  const masteredCards = cards.filter((c) => c.difficulty !== 'needs-practice').length;
  const reviewCards = totalCards - masteredCards;
  const masteryRate = totalCards > 0 ? Math.round((masteredCards / totalCards) * 100) : 0;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const initials = formData.name
      .trim()
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase() || 'SF';

    onSaveProfile({
      ...formData,
      avatarText: initials,
    });
    setIsEditing(false);
  };

  return (
    <AnimatePresence>
      <div
        id="user-profile-modal-backdrop"
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs"
        onClick={onClose}
      >
        <motion.div
          id="user-profile-modal-content"
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header Banner */}
          <div className="relative bg-gradient-to-r from-indigo-600 to-violet-600 p-6 text-white">
            <button
              id="btn-close-profile-modal"
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label="Close profile modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-4">
              <div
                className={`w-16 h-16 rounded-2xl ${profile.avatarColor || 'bg-indigo-600'} border-2 border-white/40 flex items-center justify-center text-white text-2xl font-black shadow-lg`}
              >
                {profile.avatarText || 'SF'}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-black text-white tracking-tight truncate">
                    {profile.name}
                  </h3>
                  <span className="px-2 py-0.5 rounded-full bg-white/20 text-[11px] font-bold tracking-wide uppercase">
                    Pro Learner
                  </span>
                </div>
                <p className="text-xs text-indigo-100/90 truncate flex items-center gap-1.5 mt-0.5">
                  <Mail className="w-3.5 h-3.5 opacity-80" />
                  {profile.email}
                </p>
                <p className="text-[11px] text-indigo-200/80 flex items-center gap-1 mt-1">
                  <Calendar className="w-3 h-3 opacity-70" />
                  Member since {profile.joinedDate || 'August 2026'}
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
            {/* Bento Study Metrics */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800 text-center">
                <div className="w-7 h-7 mx-auto mb-1.5 rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 flex items-center justify-center">
                  <Award className="w-4 h-4" />
                </div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Mastery
                </p>
                <p className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
                  {masteryRate}%
                </p>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800 text-center">
                <div className="w-7 h-7 mx-auto mb-1.5 rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400 flex items-center justify-center">
                  <Flame className="w-4 h-4" />
                </div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Day Streak
                </p>
                <p className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
                  {profile.streakDays || 5}d
                </p>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800 text-center">
                <div className="w-7 h-7 mx-auto mb-1.5 rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 flex items-center justify-center">
                  <Target className="w-4 h-4" />
                </div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Daily Goal
                </p>
                <p className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
                  {profile.dailyGoal || 10} cards
                </p>
              </div>
            </div>

            {/* Editing Form or Detail View */}
            {isEditing ? (
              <form onSubmit={handleSave} className="space-y-4 pt-1">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      id="input-profile-name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      id="input-profile-email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Daily Card Review Goal
                  </label>
                  <div className="relative">
                    <Target className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      id="input-profile-goal"
                      type="number"
                      min="1"
                      max="100"
                      value={formData.dailyGoal}
                      onChange={(e) => setFormData({ ...formData, dailyGoal: parseInt(e.target.value) || 10 })}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                </div>

                {/* Avatar Color Picker */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Avatar Theme Color
                  </label>
                  <div className="flex items-center gap-2.5">
                    {AVATAR_COLORS.map((col) => (
                      <button
                        key={col}
                        type="button"
                        onClick={() => setFormData({ ...formData, avatarColor: col })}
                        className={`w-8 h-8 rounded-xl ${col} transition-all flex items-center justify-center text-white ${
                          formData.avatarColor === col ? 'ring-2 ring-offset-2 ring-indigo-600 scale-110' : 'opacity-80 hover:opacity-100'
                        }`}
                      >
                        {formData.avatarColor === col && <CheckCircle className="w-4 h-4" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-3">
                  <button
                    type="button"
                    onClick={() => {
                      setFormData(profile);
                      setIsEditing(false);
                    }}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    id="btn-save-profile"
                    type="submit"
                    className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-sm transition-all"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                {/* Active Recall Summary Box */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                      Active Recall Stats
                    </p>
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                      {totalCards} Total Cards
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 flex justify-between items-center">
                      <span className="text-slate-500 dark:text-slate-400">Mastered:</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">{masteredCards}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 flex justify-between items-center">
                      <span className="text-slate-500 dark:text-slate-400">Needs Review:</span>
                      <span className="font-bold text-amber-600 dark:text-amber-400">{reviewCards}</span>
                    </div>
                  </div>
                </div>

                {/* Quick Preferences in Profile */}
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                      {isDarkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">Appearance</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {isDarkMode ? 'Dark Mode Active' : 'Light Mode Active'}
                      </p>
                    </div>
                  </div>
                  <button
                    id="btn-profile-toggle-theme"
                    type="button"
                    onClick={() => setIsDarkMode((prev) => !prev)}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 shadow-2xs hover:border-slate-300 transition-all"
                  >
                    Switch to {isDarkMode ? 'Light' : 'Dark'}
                  </button>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 pt-2">
                  <button
                    id="btn-edit-profile-trigger"
                    type="button"
                    onClick={() => {
                      setFormData(profile);
                      setIsEditing(true);
                    }}
                    className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                  >
                    Edit Profile Details
                  </button>
                  <button
                    id="btn-profile-start-quiz"
                    type="button"
                    onClick={() => {
                      onClose();
                      onStartQuiz();
                    }}
                    className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-xs flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    Start Quick Quiz
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
