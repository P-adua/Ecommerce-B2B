import { create } from 'zustand';
import type { Product } from '../types/products';
import type { CartItem } from '../types/cart';

interface CartState {
  items: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],

  // Adicionar produto (se já existir, aumenta a quantidade)
  addToCart: (product) => {
    set((state) => {
      const existingIndex = state.items.findIndex((item) => item.id === product.id);

      if (existingIndex > -1) {
        const newItems = [...state.items];
        newItems[existingIndex].quantity += 1;
        return { items: newItems };
      }

      return { items: [...state.items, { ...product, quantity: 1 }] };
    });
  },

  // Remover produto do carrinho
  removeFromCart: (productId) => {
    set((state) => ({
      items: state.items.filter((item) => item.id !== productId),
    }));
  },

  // Alterar quantidade manualmente
  updateQuantity: (productId, quantity) => {
    if (quantity <= 0) {
      get().removeFromCart(productId);
      return;
    }
    set((state) => ({
      items: state.items.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      ),
    }));
  },

  // Limpar carrinho inteiro
  clearCart: () => set({ items: [] }),

  // Contar total de itens para o badge do cabeçalho
  totalItems: () => {
    return get().items.reduce((total, item) => total + item.quantity, 0);
  },

  // Calcular o valor total da compra
  totalPrice: () => {
    return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
  },
}));