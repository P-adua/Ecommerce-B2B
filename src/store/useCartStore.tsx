import { create } from 'zustand';
import type { Product } from '../types/products';

export interface CartItem extends Product {
  quantity: number;
}

// Função utilitária para calcular a porcentagem de desconto por volume
export function getVolumeDiscountPercent(quantity: number): number {
  if (quantity >= 20) return 15;
  if (quantity >= 10) return 10;
  if (quantity >= 5) return 5;
  return 0;
}

// Calcula o preço unitário final considerando o desconto de volume
export function getDiscountedUnitPrice(price: number, quantity: number): number {
  const discountPercent = getVolumeDiscountPercent(quantity);
  return price * (1 - discountPercent / 100);
}

interface CartState {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
  totalOriginalPrice: () => number; // Para mostrar quanto a empresa economizou
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],

  addToCart: (product, quantity = 1) => {
    set((state) => {
      const existingItem = state.items.find((item) => item.id === product.id);
      if (existingItem) {
        return {
          items: state.items.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          ),
        };
      }
      return { items: [...state.items, { ...product, quantity }] };
    });
  },

  removeFromCart: (productId) => {
    set((state) => ({
      items: state.items.filter((item) => item.id !== productId),
    }));
  },

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

  clearCart: () => set({ items: [] }),

  totalItems: () => {
    return get().items.reduce((total, item) => total + item.quantity, 0);
  },

  // Preço total com descontos aplicados
  totalPrice: () => {
    return get().items.reduce((total, item) => {
      const discountedPrice = getDiscountedUnitPrice(item.price, item.quantity);
      return total + discountedPrice * item.quantity;
    }, 0);
  },

  // Preço original sem descontos (para exibir a economia)
  totalOriginalPrice: () => {
    return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
  },
}));