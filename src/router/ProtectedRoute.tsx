// src/components/ProtectedRoute.tsx
// Modificăm ProtectedRoute să folosească store-ul Zustand în loc de localStorage direct.
// Asta asigură consistență cu starea aplicației.

import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore'; // Importăm store-ul

export default function ProtectedRoute() {
  const location = useLocation();
  const { isAuthenticated } = useAuthStore(); // Folosim hook-ul pentru a accesa starea

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}