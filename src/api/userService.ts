// src/api/userService.ts
import api from './client';
import { useAuthStore } from '@/stores/authStore';
import type { components } from '@/types/schema';
import { toast } from 'sonner';

type UserProfile = components['schemas']['UserProfile'];
// Asumat pe baza cerinței - adăugăm un rol local
export type AdminUser = UserProfile & { id: string };
export type UserRole = components['schemas']['EnumUserRole'];

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

/**
 * [ADMIN] Preia toți utilizatorii din sistem.
 */
async function getAllUsers(params?: {
  search?: string;
  page?: number;
  limit?: number;
}): Promise<AdminUsersResponse> {
  const query: Record<string, any> = {};
  if (params?.search) query.search = params.search;
  if (params?.page) query.page = params.page;
  if (params?.limit) query.limit = params.limit;

  const { data, error } = await api.GET('/admin/users', { params: { query } });

  if (error) {
    toast.error('Failed to fetch users.');
    throw new Error('Could not retrieve users.');
  }

  return data as AdminUsersResponse;
}


/**
 * [ADMIN] Actualizează rolul unui utilizator.
 * @param userId ID-ul utilizatorului de modificat.
 * @param role Noul rol.
 */
async function updateUserRole(userId: string, role: UserRole): Promise<void> {
    // Presupunem că acest endpoint există.
    const { error } = await api.PATCH(`/admin/users/${userId}/role`, {
        body: { role },
    });

    if (error) {
        toast.error('Failed to update user role.');
        throw new Error('Could not update user role.');
    }

    toast.success('User role updated successfully!');
}

export const userService = {
  getProfile,
  updateProfile,
  getAllUsers,
  updateUserRole,
};
