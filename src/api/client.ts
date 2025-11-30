import createClient, { type Middleware } from "openapi-fetch";
import type { paths } from "../types/schema"; // Tipurile generate automat

// 1. Inițializăm clientul cu tipurile 'paths'
const api = createClient<paths>({
  baseUrl: "https://api.univent.ro" // sau http://localhost:3000
});

// 2. Configurare Middleware (Echivalentul Interceptorilor din Axios)
// Aceasta injectează token-ul automat la fiecare request
const authMiddleware: Middleware = {
  async onRequest({ request }) {
    // Luăm token-ul din localStorage (sau din context/state management)
    const token = localStorage.getItem("accessToken");

    if (token) {
      request.headers.set("Authorization", `Bearer ${token}`);
    }
    return request;
  },

  async onResponse({ response }) {
    // Putem trata erori globale, ex: 401 Unauthorized
    if (response.status === 401) {
      console.log("Sesiune expirată, redirect la login...");
      // window.location.href = '/login';
    }
    return response;
  },
};

// Activăm middleware-ul
api.use(authMiddleware);

export default api;