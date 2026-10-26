import { create } from 'zustand';
import type { Product } from '../types/products';

interface CompareState {
  compareItems: Product[];
  addToCompare: (product: Product) => void;
  removeFromCompare: (productId: string) => void;
  clearCompare: () => void;
}

export const useCompareStore = create<CompareState>((set, get) => ({
  compareItems: [],

  addToCompare: (product) => {
    const { compareItems } = get();
    // Limite máximo de 3 itens para comparação lado a lado
    if (compareItems.some((item) => item.id === product.id)) return;
    if (compareItems.length >= 3) {
      alert('Você pode comparar no máximo 3 produtos simultaneamente.');
      return;
    }
    set({ compareItems: [...compareItems, product] });
  },

  removeFromCompare: (productId) => {
    set((state) => ({
      compareItems: state.compareItems.filter((item) => item.id !== productId),
    }));
  },

  clearCompare: () => set({ compareItems: [] }),
}));