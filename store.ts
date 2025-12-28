
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { StoreState, Product } from './types';

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      userId: 'local-user', // Default ID for local-first experience
      history: [],
      currentProduct: null,
      currentAnalysis: null,
      hasSeenOnboarding: false,
      isChatOpen: false,
      chatPrompt: null,
      language: 'en',
      theme: 'light',
      
      setUserId: (id) => set({ userId: id }),
      
      addScan: (product) => 
        set((state) => {
          // Associate the product with the current user
          const productWithUser = { ...product, userId: state.userId || 'local-user' };
          const filteredHistory = state.history.filter(p => p.barcode !== product.barcode);
          return { history: [productWithUser, ...filteredHistory].slice(0, 50) };
        }),
        
      removeScan: (barcode) =>
        set((state) => ({
          history: state.history.filter(p => p.barcode !== barcode)
        })),

      clearHistory: () => set({ history: [] }),
      
      setCurrentProduct: (product) => set({ currentProduct: product }),
      setCurrentAnalysis: (analysis) => set({ currentAnalysis: analysis }),
      setHasSeenOnboarding: (val) => set({ hasSeenOnboarding: val }),
      setChatOpen: (isOpen, prompt) => set({ isChatOpen: isOpen, chatPrompt: prompt || null }),
      setLanguage: (lang) => set({ language: lang }),
      setTheme: (theme) => set({ theme: theme }),
    }),
    {
      name: 'eco-scan-pro-storage-v2', // Incremented version due to schema change
      partialize: (state) => ({ 
        userId: state.userId,
        history: state.history,
        hasSeenOnboarding: state.hasSeenOnboarding,
        language: state.language,
        theme: state.theme
      }),
    }
  )
);
