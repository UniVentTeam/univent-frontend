// src/api/client.ts
// Modificăm middleware-ul pentru a gestiona și logout-ul în caz de 401.
// Deoarece logout e în store, îl importăm și îl apelăm direct.

import createClient, { type Middleware } from 'openapi-fetch';
import type { paths } from '../types/schema';
import { useAuthStore } from '@/stores/authStore'; // Importăm store-ul pentru logout
import qs from 'qs';

const baseUrl =
  import.meta.env.MODE === 'production'
    ? import.meta.env.VITE_API_BASE_URL_PRODUCTION
    : import.meta.env.VITE_API_BASE_URL_LOCAL;

const api = createClient<paths>({
  baseUrl,
  querySerializer: (params) => {
    return qs.stringify(params, { arrayFormat: 'repeat' });
  },
});

const authMiddleware: Middleware = {
  async onRequest({ request }) {
    // Luăm token-ul din store (deoarece e persistent, e disponibil)
    const token = useAuthStore.getState().token;

    if (token) {
      request.headers.set('Authorization', `Bearer ${token}`);
    }
    return request;
  },

  async onResponse({ response }) {
    if (response.status === 401) {
      console.log('Sesiune expirată, redirect la login...');
      useAuthStore.getState().logout(); // Apelăm logout din store
      window.location.href = '/auth/login'; // Redirect explicit
    }
    return response;
  },
};

api.use(authMiddleware);

export const createEvent = async (eventData: any) => {
  const { data, error } = await api.POST('/events', {
    body: eventData,
  });

  if (error) {
    throw new Error((error as any).message || 'Failed to create event');
  }

  return data;
};

export const getMyAssociations = async () => {
  // @ts-ignore - Route added recently
  const { data, error } = await api.GET('/associations/mine', {});
  if (error) throw new Error((error as any).message || 'Failed to fetch associations');
  return data;
};

export const getEvents = async (query?: any) => {
  const { data, error } = await api.GET('/events', {
    params: {
      query: query
    }
  });

  if (error) throw new Error((error as any).message || 'Failed to fetch events');
  return data;
};

export const updateEventStatus = async (eventId: string, status: 'PUBLISHED' | 'REJECTED', reason?: string) => {
  const { data, error } = await api.PATCH('/events/{id}/status', {
    params: {
      path: { id: eventId }
    },
    body: {
      status,
      rejectionReason: reason
    }
  });

  if (error) throw new Error((error as any).message || 'Failed to update status');
  return data;
};

export default api;
