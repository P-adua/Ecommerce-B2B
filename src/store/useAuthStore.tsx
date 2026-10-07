import { create } from 'zustand';
import type { CompanyUser } from '../types/auth';

interface AuthState {
  user: CompanyUser | null;
  isLoginModalOpen: boolean;
  login: (user: CompanyUser) => void;
  logout: () => void;
  openLoginModal: (isOpen: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoginModalOpen: false,
  
  login: (user) => set({ user, isLoginModalOpen: false }),
  logout: () => set({ user: null }),
  openLoginModal: (isOpen) => set({ isLoginModalOpen: isOpen }),
}));