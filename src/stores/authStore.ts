// src/stores/authStore.ts
// Modificăm store-ul pentru a persista datele în localStorage (pentru a supraviețui refresh-urilor paginii).
// Folosim middleware-ul 'persist' din Zustand pentru simplitate.
// Mai întâi, instalează 'zustand/middleware' dacă nu e deja: npm install zustand
// (Zustand are built-in middleware, dar asigură-te că ai versiunea corectă).

import { create } from 'zustand';
import { persist } from 'zustand/middleware'; // Importăm persist middleware
import type { components } from '../types/schema';

type User = components['schemas']['UserProfile'];

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
}

// Folosim persist pentru a salva starea în localStorage (nume: 'auth-storage')
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setAuth: (user, token) => {
        set({
          user,
          token,
          isAuthenticated: true,
        });
      },
      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: 'auth-storage', // Numele cheii în localStorage
      partialize: (state) => ({ user: state.user, token: state.token, isAuthenticated: state.isAuthenticated }), // Ce salvăm
    }
  )
);