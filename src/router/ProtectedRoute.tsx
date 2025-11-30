import { Navigate, Outlet, useLocation } from 'react-router-dom';

export default function ProtectedRoute() {
  const location = useLocation();

  // TODO: Aici vei lega logica reală de autentificare (din Context, Redux, sau localStorage)
  // Momentan simulăm că verificăm un token în localStorage
  const isAuthenticated = localStorage.getItem('token') !== null;

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // Dacă e logat, randează copiii (Ruta privată)
  return <Outlet />;
}