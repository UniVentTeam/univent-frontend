// src/api/userService.ts
import api from './client';
import { useAuthStore } from '@/stores/authStore';
import type { components } from '@/types/schema';
import { toast } from 'sonner';

type UserProfile = components['schemas']['UserProfile'];

/**
 * Preia profilul complet al utilizatorului logat.
 */
async function getProfile(): Promise<UserProfile> {
  const { data, error } = await api.GET('/users/profile');

  if (error) {
    toast.error('Failed to fetch user profile.');
    throw new Error('Could not retrieve user profile.');
  }

  // Actualizăm store-ul cu datele proaspete de la API
  if (data) {
    useAuthStore.getState().setUser(data);
  }

  return data;
}

/**
 * Actualizează profilul utilizatorului.
 * @param profileData Datele de profil care trebuie actualizate.
 */
async function updateProfile(profileData: Partial<UserProfile>) {
  const { user } = useAuthStore.getState();
  const updatedUser = { ...user, ...profileData };

  const { error } = await api.PUT('/users/profile', {
    body: updatedUser,
  });

  if (error) {
    toast.error('Failed to update profile.');
    throw new Error('Could not update profile.');
  }

  toast.success('Profile updated successfully!');
  // Return the updated user to be set in the store
  return updatedUser;
}

export const userService = {
  getProfile,
  updateProfile,
};
