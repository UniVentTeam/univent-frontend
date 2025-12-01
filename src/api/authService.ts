// src/api/authService.ts
import api from './client';
import { useAuthStore } from '@/stores/authStore';
import type { components } from '@/types/schema';
import { toast } from 'sonner';

// Tipuri extrase pentru claritate
type LoginRequest = components['schemas']['LoginRequest'];
type RegisterRequest = components['schemas']['RegisterRequest'];

/**
 * Gestionează procesul de login.
 * @param credentials - Email și parolă.
 * @returns Datele de autentificare dacă succes.
 * @throws Aruncă o eroare cu un mesaj prietenos în caz de eșec.
 */
async function login(credentials: LoginRequest) {
  const { data, error } = await api.POST('/auth/login', {
    body: credentials,
  });

  if (error) {
    console.error("Login failed:", error);
    // Afișăm un toast de eroare
    toast.error('Login Failed', {
      description: 'Invalid credentials. Please try again.',
    });
    // Aruncăm eroarea pentru ca formularul să poată reacționa (ex: oprire loading)
    throw new Error('Invalid credentials');
  }

  if (data?.user && data?.token) {
    // Salvăm starea de autentificare în store-ul Zustand
    useAuthStore.getState().setAuth(data.user, data.token);
    toast.success('Login Successful', {
      description: `Welcome back, ${data.user.fullName}!`,
    });
    return data;
  }

  // Fallback pentru cazuri neașteptate
  toast.error('Login Failed', {
    description: 'An unexpected error occurred.',
  });
  throw new Error('Invalid response from server.');
}

/**
 * Gestionează procesul de înregistrare.
 * @param details - Datele de înregistrare.
 * @throws Aruncă o eroare cu un mesaj prietenos în caz de eșec.
 */
async function register(details: RegisterRequest) {
  const { error } = await api.POST('/auth/register', {
    body: details,
  });

  if (error) {
    console.error("Registration failed:", error);
    const errorMessage = (error as any).message || 'An unknown error occurred.';
    toast.error('Registration Failed', {
      description: errorMessage,
    });
    throw new Error(errorMessage);
  }

  toast.success('Registration Successful', {
    description: 'You can now log in with your new account.',
  });
}

// Exportăm toate funcțiile ca un singur obiect "authService"
// pentru a fi ușor de importat și folosit în aplicație.
export const authService = {
  login,
  register,
};
