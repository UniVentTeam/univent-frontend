// src/api/client.ts
// Modificăm middleware-ul pentru a gestiona și logout-ul în caz de 401.
// Deoarece logout e în store, îl importăm și îl apelăm direct.

import createClient, { type Middleware } from 'openapi-fetch';
import type { paths } from '../types/schema';
import { useAuthStore } from '@/stores/authStore'; // Importăm store-ul pentru logout
import qs from 'qs';

const api = createClient<paths>({
  baseUrl: 'http://localhost:4001', // sau http://localhost:3000
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

export default api;
