
export interface Product {
  barcode: string;
  name: string;
  brand: string;
  image: string;
  ingredients: string[];
  healthGrade: string; // A-E
  ecoGrade: string; // A-F
  nutriments: Record<string, any>;
  lastScannedAt: number;
  userId?: string; // Optional for future backend association
}

export interface AIAnalysis {
  healthInsight: string;
  sustainabilityInsight: string;
  healthScore: number; // 0-100
  ecoScore: number; // 0-100
  alternative?: {
    name: string;
    reason: string;
  };
  concerningIngredients?: {
    name: string;
    reason: string;
  }[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface StoreState {
  userId: string | null;
  history: Product[];
  currentProduct: Product | null;
  currentAnalysis: AIAnalysis | null;
  hasSeenOnboarding: boolean;
  isChatOpen: boolean;
  chatPrompt: string | null;
  language: 'en' | 'fr';
  theme: 'light' | 'dark';
  setUserId: (id: string | null) => void;
  addScan: (product: Product) => void;
  removeScan: (barcode: string) => void;
  clearHistory: () => void;
  setCurrentProduct: (product: Product | null) => void;
  setCurrentAnalysis: (analysis: AIAnalysis | null) => void;
  setHasSeenOnboarding: (val: boolean) => void;
  setChatOpen: (isOpen: boolean, prompt?: string) => void;
  setLanguage: (lang: 'en' | 'fr') => void;
  setTheme: (theme: 'light' | 'dark') => void;
}
