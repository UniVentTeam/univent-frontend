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
    : (import.meta.env.VITE_API_BASE_URL_LOCAL || 'http://localhost:4001');

console.log("DEBUG: Current MODE:", import.meta.env.MODE);
console.log("DEBUG: Configured BaseURL:", baseUrl);

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
  // Dacă trimitem fișier (FormData), folosim fetch direct pentru a permite browserului să seteze Content-Type la multipart/form-data
  if (eventData instanceof FormData) {
    const token = useAuthStore.getState().token;
    const response = await fetch(`${baseUrl}/events`, {
      method: 'POST',
      headers: {
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      },
      body: eventData,
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || 'Failed to create event');
    }
    return await response.json();
  }

  // Fallback (JSON)
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


export const deleteEvent = async (eventId: string) => {
  const { error } = await api.DELETE('/events/{id}', {
    params: {
      path: { id: eventId }
    }
  });

  if (error) throw new Error((error as any).message || 'Failed to delete event');
};

export const getEventById = async (id: string) => {
  const { data, error } = await api.GET('/events/{id}', {
    params: {
      path: { id }
    }
  });
  if (error) throw new Error((error as any).message || 'Failed to fetch event');
  return data;
};

export const updateEvent = async (id: string, eventData: any) => {
  // Handle FormData for file uploads
  if (eventData instanceof FormData) {
    const token = useAuthStore.getState().token;
    const response = await fetch(`${baseUrl}/events/${id}`, {
      method: 'PUT',
      headers: {
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      },
      body: eventData,
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || 'Failed to update event');
    }
    return await response.json();
  }

  // Fallback (JSON)
  /*
  const { data, error } = await api.PUT('/events/{id}', {
    params: { path: { id } },
    body: eventData,
  });

  if (error) throw new Error((error as any).message || 'Failed to update event');
  return data;
  */
};

export default api;
