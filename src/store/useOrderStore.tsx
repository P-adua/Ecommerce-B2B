import { create } from 'zustand';
import type { CartItem } from './useCartStore';

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  totalPrice: number;
  shippingCost: number;
  paymentMethod: string;
  status: 'Processando' | 'Faturado' | 'Em Transporte' | 'Entregue';
}

interface OrderState {
  orders: Order[];
  addOrder: (order: Omit<Order, 'id' | 'date' | 'status'>) => void;
}

export const useOrderStore = create<OrderState>((set) => ({
  orders: [],

  addOrder: (newOrder) => {
    const order: Order = {
      ...newOrder,
      id: `PED-${Math.floor(100000 + Math.random() * 900000)}`,
      date: new Date().toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      status: 'Processando',
    };

    set((state) => ({ orders: [order, ...state.orders] }));
  },
}));