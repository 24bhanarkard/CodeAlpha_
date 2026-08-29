import React from 'react';
import { 
  LayoutDashboard, 
  BookOpen, 
  Layers, 
  HelpCircle, 
  Star 
} from 'lucide-react';
import { PageId } from '../../types';

interface MobileNavProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  currentPage,
  onNavigate,
}) => {
  const items = [
    { id: 'dashboard' as PageId, label: 'Home', icon: LayoutDashboard },
    { id: 'learn' as PageId, label: 'Words', icon: BookOpen },
    { id: 'flashcards' as PageId, label: 'Cards', icon: Layers },
    { id: 'quiz' as PageId, label: 'Quiz', icon: HelpCircle },
    { id: 'favorites' as PageId, label: 'Saved', icon: Star },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 dark:bg-slate-900/95 border-t border-slate-200 dark:border-slate-800 backdrop-blur-md px-2 py-1.5 flex justify-around items-center">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = currentPage === item.id;

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onNavigate(item.id)}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
              isActive
                ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Icon size={20} className={isActive ? 'stroke-[2.5]' : ''} />
            <span className="text-[10px] mt-0.5">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
