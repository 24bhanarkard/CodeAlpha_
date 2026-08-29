export type QuoteCategory = 
  | 'Wisdom' 
  | 'Creativity' 
  | 'Courage' 
  | 'Perseverance' 
  | 'Philosophy' 
  | 'Success' 
  | 'Mindfulness' 
  | 'Leadership'
  | 'Gratitude'
  | 'Resilience'
  | 'Compassion'
  | 'Innovation';

export interface Quote {
  id: string;
  text: string;
  author: string;
  category: QuoteCategory;
  context?: string;
}

export type ThemeMode = 'light' | 'dark';

export type BgMode = 'nature_mountain' | 'nature_forest' | 'warm_gradient' | 'minimal';

export interface ToastInfo {
  id: string;
  message: string;
  type?: 'success' | 'info';
}

