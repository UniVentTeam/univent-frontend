// src/stores/authStore.ts
// Modificăm store-ul pentru a persista datele în localStorage (pentru a supraviețui refresh-urilor paginii).
// Folosim middleware-ul 'persist' din Zustand pentru simplitate.
// Mai întâi, instalează 'zustand/middleware' dacă nu e deja: npm install zustand
// (Zustand are built-in middleware, dar asigură-te că ai versiunea corectă).

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { components } from '../types/schema';

type User = components['schemas']['UserProfile'];

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  role: 'student' | 'admin' | 'organizer';
  setAuth: (user: User, token: string) => void;
  setUser: (user: User) => void;
  setRole: (role: 'student' | 'admin' | 'organizer') => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      role: 'student', // rolul default
      setAuth: (user, token) => {
        set({
          user,
          token,
          isAuthenticated: true,
        });
      },
      setUser: (user) => set({ user }),
      setRole: (role) => set({ role }), // adăugăm funcția pentru rol
      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          role: 'student', // resetăm rolul la logout
        });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        role: state.role, // salvăm și rolul
      }),
    }
  )
);
