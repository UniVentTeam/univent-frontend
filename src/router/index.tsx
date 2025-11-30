import { createBrowserRouter, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

// Layouts
import DashboardLayout from '@/layouts/DashboardLayout';
import AuthLayout from '@/layouts/AuthLayout';

// Pages - Auth
import LoginPage from '@/pages/Auth/Login';
import RegisterPage from '@/pages/Auth/Register';

// Pages - App
import HomePage from '@/pages/Home/HomePage';
import EventDetails from '@/pages/Events/EventDetails';
import CreateEvent from '@/pages/Events/CreateEvent';
import MyProfile from '@/pages/Profile/MyProfile';
import NotFound from '@/pages/NotFound';

export const router = createBrowserRouter([
  // 1. Login/Register
  {
    path: '/auth',
    element: <AuthLayout />, // Aici stă containerul gri/centrat
    children: [
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
      // Redirect automat dacă intră cineva doar pe /auth
      { index: true, element: <Navigate to="/auth/login" replace /> }
    ]
  },

  // 2. Aplicația principală
  {
    path: '/',
    element: <DashboardLayout />,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <HomePage />
      },
      {
        path: 'events/:id',
        element: <EventDetails />
      },

      // --- B. RUTE PROTEJATE (Doar logat) ---
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: 'events/create',
            element: <CreateEvent />
          },
          {
            path: 'profile',
            element: <MyProfile />
          }
        ]
      }
    ]
  },

  // 3. Catch-all (Orice altceva duce la 404 sau redirect)
  {
    path: '*',
    element: <NotFound />
  }
]);